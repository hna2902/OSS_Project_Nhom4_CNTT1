# views.py
from django.shortcuts import render, redirect
from django.shortcuts import render, redirect
import requests

def register(request):
    if request.method == 'POST':
        # Lấy dữ liệu từ form đăng ký
        ten = request.POST.get('ten')
        tai_khoan = request.POST.get('tai_khoan')
        mat_khau = request.POST.get('mat_khau')

        # Gửi request đến API đăng ký
        response = requests.post('http://localhost:8000/api/register/', data={
            'ten': ten,
            'tai_khoan': tai_khoan,
            'mat_khau': mat_khau,
        })

        # Kiểm tra phản hồi từ API
        if response.status_code == 201:
            # Đăng ký thành công, chuyển hướng đến trang đăng nhập
            return redirect('login')
        else:
            # Nếu có lỗi từ API (tài khoản đã tồn tại hoặc lỗi khác)
            error_message = response.json().get('error', 'Đã có lỗi xảy ra. Vui lòng thử lại!')
            return render(request, 'register.html', {'error': error_message})

    return render(request, 'register.html')
