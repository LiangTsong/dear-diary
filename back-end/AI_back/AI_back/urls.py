"""AI_back URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from AI_back.src.user_info import get_user_info
from AI_back.src.keyword import get_keyword
from AI_back.src.diary import Diary
from django.views.static import serve
import os/

d = Diary()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/keyword/', get_keyword), # is of not use
    path('api/user_info/', get_user_info),
    path('api/message/', d.get_message),
    path('api/notice/', d.get_notice),
    path('api/notice_operate/', d.notice_operate),
    path('api/new_diary/', d.new_diary),
    path('api/submit_diary/', d.submit_diary),
    path('api/submit_notice/', d.submit_notice),
    path('api/get_diaryi/', d.get_diary),
    path('api/get_diary_info/', d.get_diary_info),
    path('api/initial/',d.initial),
    path('api/new_diary_presentation/',d.new_diary_presentation),
    re_path(r'^image/(?P<path>.*)$', serve, {'document_root': os.path.join('AI_back/data/', 'img/')})
]
