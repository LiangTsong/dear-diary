'''
@Description: 获取每5天内朋友圈的情绪状况
@Author: LiangCong (liangxcong@gmail.com)
@LastEditors: LiangCong (liangxcong@gmail.com)
@LastEditTime: 2019-07-16 12:15:05
'''
import json
import math

from get_text_emotion import get_emotion

BEGIN_UNIX_TIME_S = 1506787200
FIVE_DAY_UNIX_TIME_S = 432000

invalid_user_list = list()
sns_user_emotion_dict = dict()
a = input('Please type in number a')
b = input('Please type in number b')
a = int(a)
b = int(b)

with open('./logfile_' + str(a) + '_to_' + str(b) + '.txt', 'a') as f:
    f.write('GROUP ' + str(a) + ' to ' + str(b)  + ': Begin\n')

for current_group in range(a, b):

    # 1, Get invalid user list
    with open('../group' + str(current_group) + '/invalid_users.txt', 'r') as f:
        line = f.readline()
        line = line[1:]
        items = line.split(',')
        for item in items:
            invalid_user_list.append(item.split(':')[0])

    timer = 0

    # 2, Scan snsdata
    with open('../group' + str(current_group) + '/snsdata_180522.data', 'r') as f:
        for line in f:
            timer += 1
            if timer % 1000 == 0:
                print(str(100 * timer / 751560) + '%\n')
            new_line = line.split('\t')
            new_user = new_line[0]
            if new_user not in invalid_user_list:
                if new_user not in sns_user_emotion_dict:
                    sns_user_emotion_dict[new_user] = dict()
                try:
                    #  2.1, Get time
                    time = math.floor((int(new_line[3]) - BEGIN_UNIX_TIME_S) / FIVE_DAY_UNIX_TIME_S)
                    if time not in sns_user_emotion_dict[new_user]:
                        sns_user_emotion_dict[new_user][time] = dict()
                    # 2.2, Calculate emotion
                    output = get_emotion(new_line[2])
                    # 2.3, Update old data
                    number = 'number'
                    emotion = 'emotion'
                    polarity = 'polarity'
                    emotion_type = 'emotion_type'
                    if number not in sns_user_emotion_dict[new_user][time]:
                        sns_user_emotion_dict[new_user][time][number] = 1
                        sns_user_emotion_dict[new_user][time][emotion] = output[0]
                        sns_user_emotion_dict[new_user][time][emotion_type] = output[1]
                        sns_user_emotion_dict[new_user][time][polarity] = output[2]
                    else:
                        sns_user_emotion_dict[new_user][time][number] += 1
                        for key in sns_user_emotion_dict[new_user][time][emotion]:
                            sns_user_emotion_dict[new_user][time][emotion][key] += output[0][key]
                        for key in sns_user_emotion_dict[new_user][time][emotion_type]:
                            sns_user_emotion_dict[new_user][time][emotion_type][key] += output[1][key]
                        for key in sns_user_emotion_dict[new_user][time][polarity]:
                            sns_user_emotion_dict[new_user][time][polarity][key] += output[2][key]
                except ValueError:
                    print('WRONG: ' + new_line[0])
                
    # 3, Save the dictionary
    with open('../group' + str(current_group) + '/snsdata_emotions_5days.json', 'w') as f:
        json.dump(sns_user_emotion_dict, f)
    
    # 4, Save log
    with open('./logfile_' + str(a) + '_to_' + str(b) + '.txt', 'a') as f:
        f.write('GROUP ' + str(current_group) + ' : Done\n')
