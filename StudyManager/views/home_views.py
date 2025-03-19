from django.shortcuts import render

def home(request):
    return render(request, 'Home/index.html')  # Đường dẫn mới
