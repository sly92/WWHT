#!/usr/bin/env python3
# -*- coding: utf-8 -*-


"""
Serve the API over the ML model designing to predict an event between two FR actors
"""


from flask import Flask, jsonify, request
from tensorflow.python.keras.models import load_model  # Monkey Patching weird bug : from keras.models import load_model
import numpy as np
import utils


app = Flask(__name__)
MODEL = load_model('./models/LSTM_2D256_MODEL_ADAM_CAT_DR_BN.h5')
MODEL._make_predict_function()  # Resolve : https://github.com/keras-team/keras/issues/6462
# TODO: Fix this long line (in a conf or something)
HEADER = 'date,actor1code_fracvl,actor1code_fragov,actor1code_frajud,actor1code_framed,actor1code_fra,actor1code_fracop,actor1code_fraeli,actor1code_frabus,actor1code_framil,actor1code_fraedu,actor2code_fracvl,actor2code_fraleg,actor2code_fragov,actor2code_frajud,actor2code_framed,actor2code_fra,actor2code_fracop,actor2code_frabus,actor2code_framil,actor2code_fraedu,eventcode_125,eventcode_0833,eventcode_1241,eventcode_0861,eventcode_124,eventcode_0355,eventcode_030,eventcode_1043,eventcode_0312,eventcode_1412,eventcode_154,eventcode_132,eventcode_101,eventcode_1041,eventcode_138,eventcode_032,eventcode_073,eventcode_112,eventcode_087,eventcode_053,eventcode_1056,eventcode_113,eventcode_133,eventcode_1124,eventcode_028,eventcode_162,eventcode_139,eventcode_160,eventcode_012,eventcode_1821,eventcode_203,eventcode_052,eventcode_0233,eventcode_061,eventcode_093,eventcode_1213,eventcode_1013,eventcode_1722,eventcode_1711,eventcode_0834,eventcode_171,eventcode_027,eventcode_183,eventcode_037,eventcode_060,eventcode_0874,eventcode_013,eventcode_195,eventcode_110,eventcode_024,eventcode_107,eventcode_1721,eventcode_092,eventcode_031,eventcode_075,eventcode_0842,eventcode_0841,eventcode_202,eventcode_081,eventcode_1322,eventcode_034,eventcode_015,eventcode_163,eventcode_100,eventcode_1383,eventcode_174,eventcode_019,eventcode_046,eventcode_1822,eventcode_166,eventcode_131,eventcode_140,eventcode_126,eventcode_120,eventcode_020,eventcode_1384,eventcode_0243,eventcode_1053,eventcode_130,eventcode_033,eventcode_164,eventcode_1243,eventcode_071,eventcode_1832,eventcode_136,eventcode_040,eventcode_0811,eventcode_011,eventcode_0253,eventcode_185,eventcode_0334,eventcode_025,eventcode_201,eventcode_0872,eventcode_194,eventcode_128,eventcode_102,eventcode_1831,eventcode_042,eventcode_111,eventcode_0241,eventcode_0311,eventcode_044,eventcode_051,eventcode_0331,eventcode_055,eventcode_1312,eventcode_1231,eventcode_045,eventcode_0871,eventcode_086,eventcode_1621,eventcode_190,eventcode_0244,eventcode_0231,eventcode_0341,eventcode_144,eventcode_0356,eventcode_115,eventcode_193,eventcode_1723,eventcode_0213,eventcode_0242,eventcode_0873,eventcode_122,eventcode_0353,eventcode_1244,eventcode_1122,eventcode_062,eventcode_038,eventcode_1123,eventcode_114,eventcode_035,eventcode_090,eventcode_150,eventcode_070,eventcode_170,eventcode_016,eventcode_153,eventcode_173,eventcode_141,eventcode_180,eventcode_1044,eventcode_1724,eventcode_1411,eventcode_106,eventcode_0254,eventcode_0256,eventcode_1313,eventcode_143,eventcode_018,eventcode_116,eventcode_186,eventcode_152,eventcode_134,eventcode_105,eventcode_1042,eventcode_1014,eventcode_022,eventcode_0814,eventcode_0862,eventcode_142,eventcode_1031,eventcode_064,eventcode_094,eventcode_0232,eventcode_072,eventcode_0333,eventcode_014,eventcode_057,eventcode_127,eventcode_0332,eventcode_010,eventcode_063,eventcode_1823,eventcode_172,eventcode_1242,eventcode_181,eventcode_0831,eventcode_039,eventcode_121,eventcode_023,eventcode_1233,eventcode_036,eventcode_056,eventcode_0234,eventcode_050,eventcode_123,eventcode_041,eventcode_1246,eventcode_191,eventcode_083,eventcode_182,eventcode_1121,eventcode_080,eventcode_175,eventcode_017,eventcode_137,eventcode_161,eventcode_151,eventcode_082,eventcode_026,eventcode_129,eventcode_1712,eventcode_021,eventcode_043,eventcode_1125,eventcode_196,eventcode_0214,eventcode_0344,eventcode_1662,eventcode_192,eventcode_085,eventcode_054,eventcode_145,eventcode_1222,eventcode_0211,eventcode_084,eventcode_074,eventcode_091'


@app.route('/')
def hello_world():
    """
    Plain old Hello World !
    """
    return 'Hello World!'


@app.route('/predict')
def predict():
    """
    Compute a prediction for 15 days based on a date and the actors
    Take 3 arguments in the request
    date: The date of the event to predict
    actor1: The Actor who execute the action
    actor2: The actor who receive the action
    :return: The result as a JSON
    """
    date = request.args.get('date')
    actor1 = request.args.get('actor1')
    actor2 = request.args.get('actor2')
    to_predict = [[[0] * 21] * 16]  # np.zeros((1, 16, 21), dtype=np.float32)
    headers_cols = HEADER.split(',')
    actor1_cols = {headers_cols[i+1].split('_')[1]: i+1 for i in range(len(headers_cols[1:11]))}
    actor2_cols = {headers_cols[i+11].split('_')[1]: i+11 for i in range(len(headers_cols[11:21]))}
    output_cols = {i: headers_cols[i + 21].split('_')[1] for i in range(len(headers_cols[21:]))}
    ddays = utils.list_of_dates(date, '%Y%m%d', 16)
    for i in range(16):
        to_predict[0][i][0] = utils.normalize_date(ddays[i], '20080101', '20190101', '%Y%m%d')
        to_predict[0][i][actor1_cols[actor1.lower()]] = 1.0
        to_predict[0][i][actor2_cols[actor2.lower()]] = 1.0
    predictions = MODEL.predict(np.asarray(to_predict, dtype=np.float32), batch_size=1)
    predicted = [{ddays[i]: output_cols[np.argmax(predictions[0][i])]} for i in range(16)]
    return jsonify(predicted)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
