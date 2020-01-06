from django.http import JsonResponse
import jieba.analyse

def get_keyword(request):
    if not request.POST:
        result = {
            
        }
    result = {'keyword': str(jieba.analyse.textrank(request.POST['text'], topK=10, withWeight=False, allowPOS=('ns', 'n', 'vn', 'v')))}
    return JsonResponse(result)
