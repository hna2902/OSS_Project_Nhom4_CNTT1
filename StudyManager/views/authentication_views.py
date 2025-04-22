# views.py
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.shortcuts import render, redirect
from django.contrib import messages
from StudyManager.models import TaiKhoan

def register(request):
    if request.method == 'POST':
        # Lấy dữ liệu từ form đăng ký
        ten = request.POST.get('ten')
        tai_khoan = request.POST.get('tai_khoan')
        mat_khau = request.POST.get('mat_khau')

        print(f"Tên: {ten}, Tài khoản: {tai_khoan}, Mật khẩu: {mat_khau}")  # Kiểm tra dữ liệu form

        # Lấy user_id tự động
        user_id = TaiKhoan.get_next_user_id()

        try:
            # Kiểm tra tài khoản đã tồn tại
            TaiKhoan.insert(user_id, tai_khoan, mat_khau, ten, sdt="", email="")
            print("Tài khoản đã được tạo thành công.")
        except ValueError as e:
            # Nếu tài khoản đã tồn tại
            messages.error(request, str(e))
            return render(request, 'Authentication/register.html')

        # Đăng ký thành công, chuyển hướng đến trang đăng nhập
        messages.success(request, 'Đăng ký thành công! Bạn có thể đăng nhập ngay.')
        return redirect('login')

    return render(request, 'Authentication/register.html')



def login_view(request):
    if request.method == 'POST':
        tai_khoan = request.POST.get('tai_khoan')
        mat_khau = request.POST.get('mat_khau')

        print(f"Tài khoản: {tai_khoan}, Mật khẩu: {mat_khau}")  # Debugging

        user = TaiKhoan.get_user_by_tai_khoan(tai_khoan)
        
        if user:
            print(f"User tìm thấy: {user}")  # Debugging
            if check_password(mat_khau, user['MatKhauHash']):
                request.session['user_id'] = user['_id']
                messages.success(request, 'Đăng nhập thành công!')
                return redirect('/')  # Chuyển hướng về trang chủ sau khi đăng nhập
            else:
                messages.error(request, 'Tài khoản hoặc mật khẩu không đúng!')
        else:
            messages.error(request, 'Tài khoản hoặc mật khẩu không đúng!')

    return render(request, 'Authentication/login.html')

def logout_view(request):
    try:
        del request.session['user_id']
    except KeyError:
        pass
    messages.success(request, 'Bạn đã đăng xuất thành công.')
    return redirect('login')  # hoặc redirect('/') nếu muốn về trang chủ
