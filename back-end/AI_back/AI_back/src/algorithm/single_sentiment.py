# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     tencent_api
   Description :
   Author :       YOUQING
   date：          2017/11/20
-------------------------------------------------
   Change Activity:
                   2017/11/20:
-------------------------------------------------
"""

import json

import requests
from bs4 import BeautifulSoup

import AI_back.src.algorithm.md5sign


def get_content(plus_item):
    url = "https://api.ai.qq.com/fcgi-bin/nlp/nlp_textpolar"  # API地址
    params = AI_back.src.algorithm.md5sign.get_params(plus_item)#获取请求参数
    url=url+'?'+params#请求地址拼接

    try:
        r = requests.get(url)
        soup = BeautifulSoup(r.text, 'lxml')
        allcontents=soup.select('body')[0].text.strip()
        allcontents_json=json.loads(allcontents)#str转成dict
        print(allcontents_json)
        return allcontents_json["data"]["polar"],allcontents_json["data"]["confd"],allcontents_json["data"]["text"]
    except:
        print('a')
        return 0,0,0



if __name__ == '__main__':
    polar,confd,text=get_content('今天天气真好，我很开心')
    print('情感倾向：'+str(polar)+'\n'+'程度：'+str(confd)+'\n'+'文本：'+str(text))