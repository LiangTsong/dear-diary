from django.http import JsonResponse

def get_user_info(request):
    # if not request.POST:
    #     result = {'user_img': 'http://127.0.0.1:8000/image/user_img_generic.jpeg',
    #              'user_name': '梁聪',
    #              'success': 0}
    #     print(result)
    #
    #     return JsonResponse(result)

    result = {'user_img': 'http://127.0.0.1:8000/image/user_img_generic.jpeg',
              'user_name': '人小智',
              'success': 1}
    print(result)

    return JsonResponse(result)