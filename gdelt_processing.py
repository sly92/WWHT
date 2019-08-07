#!/usr/bin/env python3
# -*- coding: utf-8 -*-


"""
Load the GDELT from 2008 to 2018 and clean it using PySpark
TODO: Add the lost part (top 10 actors)
"""


from itertools import chain
from functools import partial
from urllib.request import urlopen
from pyspark import SparkContext
from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import FloatType
import utils
# Monkey patching SSL
import ssl
ssl.match_hostname = lambda cert, hostname: True


SC = SparkContext.getOrCreate()
SPARK = SparkSession.builder.master('local').appName('GDELT Soothsayer').getOrCreate()

print('Starting GDELT Cleaning')
gdelt = list()
cols_to_take = ['SQLDATE', 'Actor1Code', 'Actor2Code', 'EventCode']
columns = urlopen('http://gdeltproject.org/data/lookups/CSV.header.dailyupdates.txt').read().decode('utf-8').split('\t')

print('Getting GDELT')
for year in range(2008, 2019):
    gdf = SPARK.read.option('header', 'false').option('sep', '\t').csv('s3://gdelt-open-data/events/' + str(year) + '*')
    for i in range(58):
        gdf = gdf.withColumnRenamed("_c" + str(i), columns[i])
    gdelt.append(gdf.select(cols_to_take).dropna().drop_duplicates())

print('Unioning GDELT')
gdelt = gdelt[0].unionByName(gdelt[1]).distinct()

print('Writing cleaned GDELT')
gdelt.write.csv('s3://gdelt4ibd/cleaned_gdelt_2008_2018.csv', 'overwrite', 'gzip', header='true')
gdelt.cache()

dummies_var = list()

print('Lowercasing GDELT')
for col in gdelt.columns[1:]:
    gdelt = gdelt.withColumn(col, F.lower(F.col(col)))

print('Getting only GDELT FRA Event')
gdelt = gdelt.where('Actor1Code RLIKE "^fra.*"')
gdelt = gdelt.where('Actor2Code RLIKE "^fra.*"')


# Taking top 10 actors here


print('Normalizing Date')
date_normalizer = partial(utils.normalize_date, starting_date='20170101', ending_date='20190101', date_format='%Y%m%d')
pudf_normalizer = F.pandas_udf(lambda ds: ds.apply(date_normalizer), FloatType(), F.PandasUDFType.SCALAR)
# date_normalizer = F.udf(lambda d: normalize_date(d, '20170101', '20190101', '%Y%m%d'), FloatType())
gdelt = gdelt.withColumn('date', pudf_normalizer(gdelt.SQLDATE)).drop('SQLDATE')

print('GDELT to dummies')
for col in cols_to_take[1:]:
    categories = gdelt.select(col).distinct().rdd.flatMap(lambda x: x).collect()
    dummies_var.append([F.when(F.col(col) == category, 1).otherwise(0).alias(col.lower() + '_' + category) for category in categories])
gdelt = gdelt.select('date', *list(chain.from_iterable(dummies_var)))

print('Writing Normalized GDELT')
gdelt.write.csv('s3://gdelt4ibd/normalized_gdelt_2008_2018.csv', 'overwrite', 'gzip', header='true')
