import re
import datetime
from AI_back.src.algorithm.get_time import time_extract
from TestModel.models import *

class TodoAI:
    @staticmethod
    def get_expired(timestamp):
        tmp = datetime.datetime.fromtimestamp(timestamp)
        now = datetime.datetime.now()
        one_day = datetime.timedelta(days=1)
        if tmp < now:
            return 2
        elif now + one_day < tmp:
            return 0
        else:
            return 1

    @staticmethod
    def get_todo_ai(raw_text):
        result = TodoAI.get_time(raw_text)
        re_result = []
        for item in result:
            all_result = {
                "date": item[0],
                "content": item[1]
            }
            re_result.append(all_result)
            # tmp = TodoData.objects.create(date=all_result['date'], content=all_result['content'], finished = 0)

        return re_result

    @staticmethod
    def get_rules():
        rules = []
        rules.append('(([^。，？！…（）、；"]{0,8})(([1-2][0-9])?[0-9][0-9])年([01]?[0-9])月([01]?[0-9])[日号]([^。？！…（）；"]{0,8}))')
        rules.append('(([^。，？！…（）、；"]{0,8})([01]?[0-9])月([01]?[0-9])[日号]([^。？！…（）；"]{0,8}))')
        rules.append('(([^。，？！…（）、；"]{0,8})([01]?[0-9])[日号]([^。？！…（）；"]{0,5}))')
        rules.append('(([^。，？！…（）、；"]{0,8})明天([^。？！…（）；"]{0,8})|([^。，？！…（）、；"]{0,8})后天([^。？！…（）；"]{0,8})|([^。，？！…（）、；"]{0,8})大后天([^。？！…（）；"]{0,8}))')
        rules.append('(([^。，？！…（）、；"]{0,8})((礼拜|星期|周)[一二三四五六七日])([^。？！…（）；"]{0,8}))')
        return rules

    @staticmethod
    def get_time(content):
        # reformat_rules = {0:,}
        result = []
        rules = TodoAI.get_rules()
        today = datetime.date.today()
        now = datetime.datetime.now()
        year = today.__getattribute__('year')
        month = today.__getattribute__('month')
        day = today.__getattribute__('day')
        weekday = today.isoweekday()
        flag = False
        for index, rule in enumerate(rules):
            if flag and index <= 2:
                continue
            pattern = re.compile(rule)
            tmp = pattern.findall(content)
            for i in tmp:
                flag = True
                try:
                    acc_time = time_extract(i[0])[0]
                    print('acc_itme',acc_time)
                except:
                    print('date time not found error')
                    if index == 0:
                        acc_time = now.timestamp()
                    else:
                        acc_time = now.timestamp()
                result.append([str(int(acc_time)), (i[0])])

        return result