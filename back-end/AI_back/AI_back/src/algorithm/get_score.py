import json

import operator

import jieba
import jieba.posseg as pseg
from AI_back.src.algorithm.get_text_polarity_function import get_text_polarity
from AI_back.src.algorithm.get_text_emotion import emotions, opposite_emotions, big_emotions, emotions_chinese, negative_words, positive_words, wechat_emoji, wechat_emoji_polarity

class Score:
    def __init__(self):
        with open('AI_back/src/algorithm/model/word_emotion_level_pn.json', 'r') as f:
            self.word_emotion_dict = json.load(f)
        self.words = self.word_emotion_dict.keys()

        with open('AI_back/src/algorithm/model/word_polarity_dict.json', 'r') as f:
            self.word_polarity_dict = json.load(f)
        self.words_polarity = self.word_polarity_dict.keys()

    def local_score(self,str_input):
        emotion = {key: 0 for key in emotions}

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
                if word in self.words:
                    if weight > 0:
                        emotion[self.word_emotion_dict[word][0]] += self.word_emotion_dict[word][1] * weight
                    else:
                        emotion[opposite_emotions[self.word_emotion_dict[word][0]]] += self.word_emotion_dict[word][1] * (-weight)
                single_word = ''
                connect = 0
                weight = 1

        polarity = get_text_polarity(str_input, self.words_polarity, self.word_polarity_dict, wechat_emoji_polarity, positive_words, negative_words)
        # 获得极性


        big_emotion = dict()
        big_emotion['HAPPINESS'] = emotion['PA'] + emotion['PE']
        big_emotion['GOOD'] = emotion['PD'] + emotion['PH'] + emotion['PG'] + emotion['PB'] + emotion['PK']
        big_emotion['ANGER'] = emotion['NA']
        big_emotion['SADNESS'] = emotion['NB'] + emotion['NJ'] + emotion['NH'] + emotion['PF']
        big_emotion['SCARE'] = emotion['NI'] + emotion['NC'] + emotion['NG']
        big_emotion['HATE'] = emotion['NE'] + emotion['ND'] + emotion['NN'] + emotion['NK'] + emotion['NL']
        big_emotion['SUPRISE'] = emotion['PC']

        # return [emotion, big_emotion, polarity]
        return big_emotion, self.normalized(polarity['N'],polarity['P'])

    def normalized(self,a1,a2):
        return a2/(a2-a1)

score = Score()
print(score.local_score('我今天好难受'))