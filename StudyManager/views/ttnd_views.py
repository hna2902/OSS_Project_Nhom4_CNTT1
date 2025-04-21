from django.shortcuts import render
import requests

def index(request):
    user_id = request.session.get("user_id")
    if not user_id:
        return render(request, 'TTND/index.html', {'user': None, 'user_id': None})  # Truyền cả user_id vào template

    # Lấy thông tin người dùng
    url = f"http://localhost:8000/api/thongtinnguoidung/{user_id}/"
    response = requests.get(url)
    user = response.json() if response.status_code == 200 else None

    # Xử lý cập nhật thông tin người dùng nếu có thay đổi
    if request.method == 'POST':
        updated_data = {
            'Ten': request.POST.get('Ten'),
            'SDT': request.POST.get('SDT'),
            'Email': request.POST.get('Email'),
            'Avatar': request.POST.get('Avatar')
        }

        # Gửi yêu cầu PATCH để cập nhật thông tin người dùng
        patch_response = requests.patch(url, json=updated_data)
        if patch_response.status_code == 200:
            user = patch_response.json()  # Cập nhật lại thông tin người dùng sau khi thay đổi
            success_message = "Cập nhật thông tin thành công!"
        else:
            success_message = "Cập nhật thông tin thất bại!"

        return render(request, 'TTND/index.html', {'user': user, 'message': success_message, 'user_id': user_id})

    # Render trang với thông tin người dùng hiện tại
    return render(request, 'TTND/index.html', {'user': user, 'user_id': user_id})  # Truyền user_id vào template
