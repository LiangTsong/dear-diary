

# Create your models here.
from django.db.models import *
from django.contrib.auth import *
from django.contrib.auth.models import *
from AI_back.src.settings import num2sentiment

class FeedItem(Model):
    id = AutoField(primary_key=True)
    type = IntegerField(default='')
    user_name = TextField(default='人小智')
    user_img = TextField(default='http://127.0.0.1:8000/image/user_img_generic.jpeg')
    digest = TextField(default='')
    date = FloatField(null=False)
    emotion = TextField(default='00000000')
    score = FloatField(default=0)
    day = TextField(default='2019-12-01')
    diary_id = IntegerField(null=False)


class TodoData(Model):
    id = AutoField(primary_key=True)
    content = TextField(default='')
    # expired = IntegerField(null=False)
    finished = IntegerField(default=0)
    date = FloatField(null=False)
    # day = TextField(default='2019-12-01')


class DiaryContent(Model):
    day = TextField(default='2019-12-01')
    date = FloatField(null=False)
    object_text = TextField(default='')
    raw_text = TextField(default='')
    id = AutoField(primary_key=True)
    processed = BooleanField(default=False)
