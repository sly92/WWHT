#!/usr/bin/env python3
# -*- coding: utf-8 -*-


"""
Utilities function for stuff
"""


from datetime import datetime, timedelta
import numpy as np


def all_divisor(num):
    """
    Return all the divisors of a number
    :param num: The number to find the divisors
    :return: A list of divisors
    """
    divisor = list()
    for i in range(1, num+1):
        if num % i == 0:
            divisor.append(i)
    return divisor


def normalize_nums(num, minimum, maximum):
    """
    Normalize a positive integer between 0 and 1
    :param num: The num to normalize
    :param minimum: The maximum range
    :param maximum:  The minimum range
    :return: The normalized number
    """
    nnum = 0
    if num == 0:
        return nnum
    if num == np.nan:
        return nnum
    # if num >= 1 or num <= -1:
    #     nnum = num / maxiumum
    # else:
    #     nnum = num * (1 / maxiumum)
    nnum = (num - minimum) / (maximum - minimum)
    return nnum


def normalize_date(date, starting_date, ending_date, date_format):
    """
    Return the position of the date between the starting and ending as a percentage
    :param date: The date to format
    :param starting_date: The lower date boundary
    :param ending_date: The lower date boundary
    :param date_format: The date format to use
    :return: A float representing the positions between the date
    """
    num_days = (datetime.strptime(ending_date, date_format) - datetime.strptime(starting_date, date_format)).days
    day = (datetime.strptime(date, date_format) - datetime.strptime(starting_date, date_format)).days
    return day / num_days


def list_of_dates(starting_date, date_format, iteration):
    """
    Return a list of string formatted date from the start to the end of the iteration
    :param starting_date: The lower date boundary
    :param date_format: The date format to use
    :param iteration: The number of date to count for
    :return: A list of string date formatted
    """
    lod = [starting_date]
    sdate = datetime.strptime(starting_date, date_format)
    for i in range(1, iteration + 1):
        d = sdate + timedelta(days=i)
        lod.append(str(d.year) + str(d.month) + str(d.day))
    return lod
