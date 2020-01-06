import datetime
import traceback

from django.http import JsonResponse

from AI_back.src.algorithm.get_digest import Digest
from AI_back.src.algorithm.rnn_predict import RnnPredictor
from AI_back.src.algorithm.get_score import Score
from AI_back.src.algorithm.todo import TodoAI
from AI_back.src.algorithm.bert_predictor import BertPredictor
from AI_back.src.settings import *
from TestModel.models import *
import datetime
import json


class Diary:
    special_list = []

    score = Score()
    bp = BertPredictor()

    @staticmethod
    def parse_emotions(str1):
        re = []
        # print('str1',str1)
        for index,i in enumerate(str1):
            if i == '1':
                re.append(num2emtion[index])
        return re

    @staticmethod
    def get_message(request):
        try:
            result = {
                'feed_item_data': [],
                'success': 1,
            }
            feed_items = FeedItem.objects.filter()
            for feed_item in feed_items:
                result['feed_item_data'].append(
                    {
                        'type': feed_item.type,
                        'date': feed_item.date,
                        'user_name': feed_item.user_name,
                        'user_img': feed_item.user_img,
                        'digest': feed_item.digest,
                        'emotion': Diary.parse_emotions(feed_item.emotion),
                        'score': feed_item.score,
                        'item_id': feed_item.id,
                        'diary_id':feed_item.diary_id
                    }
                )
            result['feed_item_data'] = sorted(result['feed_item_data'],key=lambda d:d['date'], reverse=True)

            # print(result)

            return JsonResponse(result)
        except:
            traceback.print_exc()
            print('get message error')
            result = {
                'feed_item_data': [
                        {
                            'type': 0,
                            'date':"2019-12-31 00:00",
                            'user_name':"我自己",
                            'user_img':"http://127.0.0.1:8000/image/user_img_generic.jpeg",
                            'digest': '今天是快乐的一天，我写完了作业，吃了好吃的，看了电影，喝了奶茶，还去了游乐场。',
                            'emotion':['😀'],
                            'score': 0.55,
                        },
                ],
                'success': 0,
            }
            return JsonResponse(result)

    @staticmethod
    def get_notice(request):
        try:
            result = {
                'todo_data': [],
                'success': 1,
            }
            feed_items = TodoData.objects.filter()
            for feed_item in feed_items:
                result['todo_data'].append(
                    {
                        'date': feed_item.date,
                        'content': feed_item.content,
                        'expired': TodoAI.get_expired(feed_item.date),
                        'finished': feed_item.finished,
                        'id': feed_item.id,
                    }
                )

            return JsonResponse(result)
        except:
            traceback.print_exc()
            print('get notice error')
            result = {
                    'todo_data':[
                        {
                            'date': 1576886400,
                            'content': '2019年最后一天',
                            'expired': 0,
                            'finished': 0,
                            'id': 0,
                        },
                    ],
                    'success': 0,
            }
            return JsonResponse(result)

    @staticmethod
    def notice_operate(request):
        try:
            json_dic = eval(request.body)
            # print(request.body)
            id = json_dic['id']
            type = json_dic['type']
            tmp = TodoData.objects.get(id=id)
            if type == 0:
                tmp.finished = 1
                tmp.save()
            elif type == 1:
                tmp.delete()
            elif type == 2:
                tmp.finished = 0
                tmp.save()
            result = {
                'success': 1,
            }
            # print(result)

            return JsonResponse(result)
        except:
            traceback.print_exc()
            print('notice operate error')
            result = {
                'success': 0,
            }
            return JsonResponse(result)

    @staticmethod
    def new_diary_presentation(request):
        try:
            json_dic = eval(request.body)
            date = json_dic['date']
            today = datetime.datetime.fromtimestamp(date).day
            diary_content = DiaryContent.objects.filter(day=today)
            if diary_content.exists():
                Diary.special_list.append(diary_content[0].id)
                if len(diary_content) > 1:
                    print("one day, many diary error")
                result = {
                     'success': 1,
                     'type': 0,  # 1表示新建成功，并返回空的object_text；0表示新建失败，返回今天已经写过的日记
                     'object_text': diary_content[0].object_text,
                     'id':diary_content[0].id,
                }
            else:
                tmp = DiaryContent.objects.create(day=today,date=date)
                Diary.special_list.append(tmp.id)
                result = {
                    'success': 1,
                    'type': 1, #1表示新建成功，并返回空的object_text；0表示新建失败，返回今天已经写过的日记
                    'id': tmp.id,
                    'object_text':'{}'
                }

            return JsonResponse(result)

        except Exception as e:
            traceback.print_exc()
            print(e)
            print('new diary error')
            result = {'success':0}
            return JsonResponse(result)



    @staticmethod
    def new_diary(request):
        try:
            # check if it has been created
            today = datetime.date.today().isoformat()
            diary_content = DiaryContent.objects.filter(day=today)
            if diary_content.exists():
                if len(diary_content) > 1:
                    print("one day, many diary error")
                result = {
                     'success': 1,
                     'type': 0,  # 1表示新建成功，并返回空的object_text；0表示新建失败，返回今天已经写过的日记
                     'object_text': diary_content[0].object_text,
                     'id':diary_content[0].id,
                }
            else:
                tmp = DiaryContent.objects.create(day=today,date=datetime.datetime.now().timestamp())
                result = {
                    'success': 1,
                    'type': 1, #1表示新建成功，并返回空的object_text；0表示新建失败，返回今天已经写过的日记
                    'id': tmp.id,
                    'object_text':'{}'
                }
            # print(result)

            return JsonResponse(result)

        except Exception as e:
            print(e)
            print('new diary error')
            result = {'success':0}
            return JsonResponse(result)

    @staticmethod
    def submit_diary(request):
        try:
            # print(request.body)
            json_dic = json.loads(request.body.decode())
            raw_text = json_dic['raw_text']
            object_text = json_dic['object_text']
            id = json_dic['id']
            print("raw_text:", raw_text)
            diary_content = DiaryContent.objects.get(id=id)
            diary_content.object_text = object_text
            diary_content.raw_text = raw_text
            diary_content.save()
            result = {
                'id':diary_content.id,
                'todo_data':TodoAI.get_todo_ai(raw_text),
                'success':1
            }
            # if id in special list
            if diary_content.id in Diary.special_list:
                diary_content.processed = True
                local_score_info, local_score = Diary.score.local_score(diary_content.raw_text)
                FeedItem.objects.create(type=0, digest=Digest.get_digest_sumy(diary_content.raw_text, 2), date=diary_content.date,
                                        day=diary_content.day, emotion=Diary.bp.format_predict(diary_content.raw_text), score=local_score,
                                        diary_id=diary_content.id)
            print('submit_diary',result)

            return JsonResponse(result)

        except Exception as e:
            traceback.print_exc()
            print('submit diary error: '+str(e))
            result = {'success':0}
            return JsonResponse(result)

    @staticmethod
    def submit_notice(request):
        try:
            print('submit notice')
            json_dic = json.loads(request.body.decode())
            todo_data = json_dic['todo_data'] # todo_data to write down
            print(todo_data)
            # print(todo_data)
            # todo_data = json.loads(todo_data)
            for item in todo_data:
                TodoData.objects.create(content=item['content'],date=item['date'])
            result = {'success': 1}
            # print(result)
            return JsonResponse(result)
        except:
            print('submit notice error')
            traceback.print_exc()
            result = {'success': 0}
            return JsonResponse(result)

    @staticmethod
    def get_diary(request):
        try:
            json_dic = eval(request.body)
            id = json_dic['id']
            diary_content = DiaryContent.objects.get(id=int(id))
            result = {
                'object_text': diary_content.object_text,
                'success': 1,
                'date':diary_content.date
            }
            # print(result)

            return JsonResponse(result)
        except:
            traceback.print_exc()
            print('get diary error')
            result = {'success': 0}
            return JsonResponse(result)

    @staticmethod
    def get_diary_info(request):
        try:
            result = {'success': 1,
                      'id': [],
                      'emotions': [],
                      'digests': [],
                      'data': [],
                      'dates': [],
                      'data_number':0
                      }
            feed_items = FeedItem.objects.filter()
            result['data_number'] = len(feed_items)
            for idx,feed_item in enumerate(feed_items):
                result['id'].append(feed_item.id)
                result['emotions'].append(Diary.parse_emotions(feed_item.emotion))
                result['digests'].append(feed_item.digest)
                result['data'].append({'x':idx, 'y': feed_item.score})
                result['dates'].append(feed_item.date)
            result_tuple = []
            for i in range(len(result['id'])):
                result_tuple.append((result['id'][i], result['emotions'][i], result['digests'][i], result['data'][i], result['dates'][i]))

            result_tuple = sorted(result_tuple, key=lambda d:d[-1],reverse=False)
            for i in range(len(result['id'])):
                result['id'][i] = result_tuple[i][0]
                result['emotions'][i] = result_tuple[i][1]
                result['digests'][i] = result_tuple[i][2]
                result['data'][i] = {'x':i,'y':result_tuple[i][3]['y']}
                result['dates'][i] = result_tuple[i][4]
            # print(result)
            return JsonResponse(result)
        except:
            traceback.print_exc()
            print('get diary info error')
            result = {'success': 0}
            return JsonResponse(result)

    @staticmethod
    def initial(request):
        try:
            now_time = datetime.datetime.now().timestamp()
            # let all diary processed
            diary_list = DiaryContent.objects.filter(processed=False)
            for diary in diary_list:
                if diary.date > now_time: # it can not go to if use naturally
                    continue
                diary.processed = True
                local_score_info, local_score = Diary.score.local_score(diary.raw_text)
                FeedItem.objects.create(type=0,digest=Digest.get_digest_sumy(diary.raw_text,2),
                                        date=diary.date,day=diary.day,emotion=Diary.bp.format_predict(diary.raw_text),
                                        score=local_score,diary_id = diary.id)
            # let all notice flush
            # notice_list = TodoData.objects.filter()
            # for notice in notice_list:
            #     if notice.date < now_time:
            result = {'success': 1}
            # print(result)
            return JsonResponse(result)
        except:
            traceback.print_exc()
            print('initial error')
            result = {'success': 0}
            return JsonResponse(result)
