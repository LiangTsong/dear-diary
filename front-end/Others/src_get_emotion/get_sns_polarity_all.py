'''
@Description: 获取用户所有朋友圈内容的情感极性
@Author: LiangCong (liangxcong@gmail.com)
@LastEditors: LiangCong (liangxcong@gmail.com)
@LastEditTime: 2019-07-17 12:57:31
'''

import json

user_emotion = dict()
user_polarity = dict()
for i in range(29, 41):
    with open('../group' + str(i) + '/snsdata_emotions_5days.json', 'r') as f:
        user_emotion = json.load(f)
    for user_id, times in user_emotion.items():
        number = 0
        positive = 0
        negative = 0
        for time, emotion_polarity in times.items():
            number += emotion_polarity['number']
            positive += emotion_polarity['polarity']['P']
            negative += emotion_polarity['polarity']['N']
        user_polarity[user_id] = dict()
        user_polarity[user_id]['number'] = number + 0
        if positive == 0 and negative == 0:
            # 出现为空的情况
            positive = 0.01
            negative = -0.01
        user_polarity[user_id]['polarity'] = positive / (positive - negative)
    with open('../group' + str(i) + '/snsdata_polarity_all.json', 'w') as f:
        json.dump(user_polarity, f)
    print('GROUP ' + str(i) + ' DONE!')