'''
@Description: 获取中文文本情感偏向的简单程序
@Author: LiangCong (liangxcong@gmail.com)
@LastEditors: LiangCong (liangxcong@gmail.com)
@LastEditTime: 2019-07-16 12:02:53
'''

import json

import operator

import jieba
import jieba.posseg as pseg

from get_text_polarity_function import get_text_polarity

emotions = ['PA', 'PE', 'PD', 'PH', 'PG', 'PB', 'PK', 'NA', 'NB', 'NJ', 'NH', 'PF', 'NI', 'NC', 'NG', 'NE', 'ND', 'NN', 'NK', 'NL', 'PC']
opposite_emotions = {'PA': 'NB', 'NB': 'PA', 'PE': 'NI', 'NI': 'PE', 'PD': 'ND', 'ND': 'PD', 'PH': 'NN', 'NN': 'PH', 'PG': 'NL', 'NL': 'PG', 'PB': 'ND', 'PK': 'NK', 'NK': 'PK', 'NA': 'PE', 'NJ': 'PG', 'NH': 'PE', 'PF': 'PE', 'NC': 'PE', 'NG': 'PE', 'NE': 'PE', 'PC': 'PE'}
big_emotions = ['乐', '好', '怒', '哀', '惧', '恶', '惊', '积极', '消极']
emotions_chinese = {'PA':'快乐', 'PE':'安心', 'PD':'尊敬', 'PH':'赞扬', 'PG':'相信', 'PB':'喜爱', 'PK':'祝愿', 'NA':'愤怒', 'NB':'悲伤', 'NJ':'失望', 'NH':'疚', 'PF':'思', 'NI':'慌', 'NC':'恐惧', 'NG':'羞', 'NE':'烦闷', 'ND':'憎恶', 'NN':'贬责', 'NK':'妒忌', 'NL':'怀疑', 'PC':'惊奇', 'positive': '积极', 'negative': '消极'}

negative_words = ['非', '别', '不', '没', '无', '勿', '不是', '假']
positive_words = ['必', '非常', '很', '太', '相当', '特别', '绝对', '极其',  '极', '真', '最']

wechat_emoji = {
    '[捂脸]':['PE', 10, 1],
    '[撇嘴]':['NN', 10, 2],
    '[难过]':['NB', 10, 2],
    '[抓狂]':['NA', 10, 2],
    '[吐]':['ND', 10, 2],
    '[嘿哈]':['PA', 10, 1],
    '[呲牙]':['PA', 10, 1],
    '[耶]':['PA', 10, 1],
    '[微笑]':['ND', 2, 2],
    '[奸笑]':['PA', 10, 1],
    '[偷笑]':['PA', 10, 1],
    '[色]':['PB', 10, 1],
    '[勾引]':['PB', 10, 0],
    '[太阳]':['PG', 10, 1],
    '[掩面]':['PA', 10, 0],
    '[强]':['PH', 10, 1],
    '[弱]':['NN', 10, 2],
    '[抱拳]':['PD', 10, 1],
    '[大哭]':['NB', 10, 2],
    '[可怜]':['NJ', 10, 2],
    '[再见]':['ND', 2, 2],
    '[爱心]':['PB', 10, 1],
    '[胜利]':['PA', 10, 1],
    '[玫瑰]':['PB', 10, 1],
    '[闭嘴]':['ND', 10, 2],
    '[睡]':['NJ', 5, 2],
    '[惊讶]':['PC', 10, 0],
    '[发呆]':['NJ', 5, 0],
    '[得意]':['PA', 10, 1],
    '[流泪]':['NB', 10, 2],
    '[害羞]':['NG', 10, 0],
    '[尴尬]':['NG', 10, 2],
    '[发怒]':['NA', 10, 2],
    '[调皮]':['PA', 10, 1],
    '[囧]':['NG', 7, 2],
    '[愉快]':['PA', 10, 1],
    '[白眼]':['ND', 10, 1],
    '[傲慢]':['PG', 10, 1],
    '[困]':['NJ', 10, 2],
    '[惊恐]':['NC', 10, 2],
    '[流汗]':['NI', 5, 2],
    '[憨笑]':['PE', 10, 1],
    '[悠闲]':['PE', 10, 1],
    '[奋斗]':['PG', 10, 1],
    '[咒骂]':['ND', 10, 2],
    '[疑问]':['NL', 10, 1],
    '[嘘]':['NE', 3, 2],
    '[晕]':['NE', 10, 2],
    '[衰]':['NJ', 10, 2],
    '[骷髅]':['NJ', 10, 2],
    '[敲打]':['NJ', 10, 2],
    '[擦汗]':['NI', 10, 2],
    '[抠鼻]':['NL', 10, 2],
    '[鼓掌]':['PB', 10, 1],
    '[坏笑]':['PA', 10, 1],
    '[左哼哼]':['ND', 10, 1],
    '[右哼哼]':['ND', 10, 1],
    '[哈欠]':['NJ', 10, 2],
    '[鄙视]':['NN', 10, 2],
    '[委屈]':['NB', 10, 2],
    '[快哭了]':['NB', 10, 2],
    '[阴险]':['PA', 5, 2],
    '[亲亲]':['PA', 10, 1],
    '[菜刀]':['ND', 10, 2],
    '[西瓜]':['PE', 10, 1],
    '[啤酒]':['PE', 10, 1],
    '[咖啡]':['PE', 10, 1],
    '[猪头]':['PE', 2, 0],
    '[凋谢]':['NJ', 10, 2],
    '[嘴唇]':['PB', 10, 1],
    '[心碎]':['NB', 10, 2],
    '[炸弹]':['NE', 10, 2],
    '[便便]':['ND', 10, 2],
    '[月亮]':['PE', 3, 0],
    '[拥抱]':['PB', 8, 1],
    '[握手]':['PD', 10, 0],
    '[拳头]':['PG', 10, 0],
    '[OK]':['PG', 10, 0],
    '[跳跳]':['PA', 10, 1],
    '[发抖]':['NC', 10, 2],
    '[怄火]':['NA', 10, 2],
    '[转圈]':['PA', 10, 1],
    '[机智]':['PA', 10, 1],
    '[皱眉]':['NL', 10, 2],
    '[红包]':['PA', 10, 1],
    '[發]':['PA', 10, 1],
    '[福]':['PA', 10, 1],
    '哈哈哈':['PA', 10, 1],
    '苦笑':['NJ', 5, 0],
    '🙏':['PD', 10, 1],
    '💪':['PG', 10, 1],
    '😂':['PA', 10, 1],
    '🔥':['PA', 10, 1],
    '🍻':['PA', 10, 1],
    '🎂':['PA', 10, 1],
    '❤️':['PB', 10, 1],
    '👍':['PH', 10, 1],
    '👎':['NN', 10, 2],
    '😢':['NB', 10, 2],
}

wechat_emoji_polarity = {
    '[捂脸]':10,
    '[撇嘴]':-10,
    '[难过]':-10,
    '[抓狂]':-10,
    '[吐]':-10,
    '[嘿哈]':10,
    '[呲牙]':10,
    '[耶]':10,
    '[微笑]':-2,
    '[奸笑]':10,
    '[偷笑]':10,
    '[色]':10,
    '[勾引]':10,
    '[太阳]':10,
    '[掩面]':10,
    '[强]':10,
    '[弱]':-10,
    '[抱拳]':10,
    '[大哭]':-10,
    '[可怜]':-5,
    '[再见]':-1,
    '[爱心]':10,
    '[胜利]':10,
    '[玫瑰]':10,
    '[闭嘴]':-10,
    '[睡]':-2,
    '[惊讶]':-2,
    '[发呆]':-2,
    '[得意]':10,
    '[流泪]':-10,
    '[害羞]':-2,
    '[尴尬]':-5,
    '[发怒]':-10,
    '[调皮]':10,
    '[囧]':-5,
    '[愉快]':10,
    '[白眼]':-10,
    '[傲慢]':5,
    '[困]':-10,
    '[惊恐]':-10,
    '[流汗]':-5,
    '[憨笑]':10,
    '[悠闲]':10,
    '[奋斗]':10,
    '[咒骂]':-10,
    '[疑问]':-5,
    '[嘘]':-3,
    '[晕]':-10,
    '[衰]':-10,
    '[骷髅]':-10,
    '[敲打]':-10,
    '[擦汗]':-10,
    '[抠鼻]':-10,
    '[鼓掌]':10,
    '[坏笑]':10,
    '[左哼哼]':-10,
    '[右哼哼]':-10,
    '[哈欠]':-10,
    '[鄙视]':-10,
    '[委屈]':-10,
    '[快哭了]':-10,
    '[阴险]':3,
    '[亲亲]':10,
    '[菜刀]':-10,
    '[西瓜]':10,
    '[啤酒]':10,
    '[咖啡]':10,
    '[猪头]':2,
    '[凋谢]':-10,
    '[嘴唇]':10,
    '[心碎]':-10,
    '[炸弹]':-10,
    '[便便]':-10,
    '[月亮]':3,
    '[拥抱]':10,
    '[握手]':10,
    '[拳头]':10,
    '[OK]':10,
    '[跳跳]':10,
    '[发抖]':-10,
    '[怄火]':-10,
    '[转圈]':10,
    '[机智]':10,
    '[皱眉]':-10,
    '[红包]':10,
    '[發]':10,
    '[福]':10,
    '哈哈哈':10,
    '苦笑':0,
    '🙏':5,
    '💪':10,
    '😂':10,
    '🔥':10,
    '🍻':10,
    '🎂':10,
    '❤️':10,
    '👍':10,
    '👎':-10,
    '😢':-10,
}

word_emotion_dict = dict()
with open('word_emotion_level_pn.json', 'r') as f:
    word_emotion_dict = json.load(f)
words = word_emotion_dict.keys()

word_polarity_dict = dict()
with open('word_polarity_dict.json', 'r') as f:
    word_polarity_dict = json.load(f)
words_polarity = word_polarity_dict.keys()

def get_emotion(str_input):

    emotion = {key:0 for key in emotions}

    # EMOJI FIRST
    for emoji in wechat_emoji:
        count = str_input.count(emoji)
        for i in range(0, count):
            emotion[wechat_emoji[emoji][0]] += wechat_emoji[emoji][1]

    # TEXT EMOTION
    str_dict = pseg.cut(str_input)
    single_word = ''
    connect = 0
    weight = 1
    for word, flag in str_dict:
        single_word += word
        if flag == 'd' or flag == 'zg' or flag == 'df' or flag == 'dg' or flag == 'c':
            connect += 1
            if word in positive_words:
                weight = (weight + 0.2) * connect
            elif word in negative_words:
                weight = (- weight - 0.2) * connect
            continue
        else:
            if word in words:
                if weight > 0:
                    emotion[word_emotion_dict[word][0]] += word_emotion_dict[word][1] * weight
                else:
                    emotion[opposite_emotions[word_emotion_dict[word][0]]] += word_emotion_dict[word][1] * (-weight)
            single_word = ''
            connect = 0
            weight = 1

    
    polarity = get_text_polarity(str_input, words_polarity, word_polarity_dict, wechat_emoji_polarity, positive_words, negative_words)


    big_emotion = dict()
    big_emotion['HAPPINESS'] = emotion['PA'] + emotion['PE']
    big_emotion['GOOD'] = emotion['PD'] + emotion['PH'] + emotion['PG'] + emotion['PB'] + emotion['PK']
    big_emotion['ANGER'] = emotion['NA']
    big_emotion['SADNESS'] = emotion['NB'] + emotion['NJ'] + emotion['NH'] + emotion['PF']
    big_emotion['SCARE'] = emotion['NI'] + emotion['NC'] + emotion['NG']
    big_emotion['HATE'] = emotion['NE'] + emotion['ND'] + emotion['NN'] + emotion['NK'] + emotion['NL']
    big_emotion['SUPRISE'] = emotion['PC']
    
    return [emotion, big_emotion, polarity]


with open('word_emotion_level_pn.json', 'r') as f:
    word_emotion_dict = json.load(f)
words = word_emotion_dict.keys()

with open('word_polarity_dict.json', 'r') as f:
    word_polarity_dict = json.load(f)
words_polarity = word_polarity_dict.keys()

while(True):
    print(get_emotion(input("请输入文字：")))
    print('\n')