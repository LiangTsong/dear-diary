'''
@Description: 获取文本情感极性
@Author: LiangCong (liangxcong@gmail.com)
@LastEditors: LiangCong (liangxcong@gmail.com)
@LastEditTime: 2019-07-31 16:12:45
'''
import jieba
import jieba.posseg as pseg

def get_text_polarity(str_input, words, word_polarity_dict, wechat_emoji, positive_words, negative_words):

    polarity_positive = 0.01
    polarity_negative = -0.01
    polarity = 0
    
    emotion_words_in_input = list()

    # EMOJI FIRST
    for emoji in wechat_emoji:
        count = str_input.count(emoji)
        for i in range(0, count):
            emotion_words_in_input.append(emoji)
            if wechat_emoji[emoji] > 0:
                polarity_positive += wechat_emoji[emoji]
            else:
                polarity_negative += wechat_emoji[emoji]

    # TEXT
    str_dict = pseg.cut(str_input)
    single_word = ''
    connect = 0
    weight = 1
    for word, flag in str_dict:
        single_word += word
        if flag == 'd' or flag == 'zg' or flag == 'df' or flag == 'dg' or flag == 'c':
            connect += 1
            if word in positive_words:
                weight = weight * (1 + connect / 5)
            elif word in negative_words:
                weight = - weight * (1 + connect / 5)
            continue
        else:
            if word in words:
                emotion_words_in_input.append(single_word)
                single_word_polarity = weight * word_polarity_dict[word]
                if single_word_polarity > 0:
                    polarity_positive += single_word_polarity
                else:
                    polarity_negative += single_word_polarity
            single_word = ''
            connect = 0
            weight = 1

    return {'N': polarity_negative, 'P': polarity_positive}