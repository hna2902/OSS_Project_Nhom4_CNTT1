from django.shortcuts import render
import requests

def index(request):
    user_id = request.session.get("user_id")
    if not user_id:
        return render(request, 'TTND/index.html', {'user': None, 'user_id': None})

    # Lấy thông tin người dùng
    url = f"http://localhost:8000/api/thongtinnguoidung/{user_id}/"
    response = requests.get(url)
    user = response.json() if response.status_code == 200 else None

    # Cập nhật thông tin tên, email, sdt (KHÔNG cập nhật avatar ở đây)
    if request.method == 'POST':
        updated_data = {
            'Ten': request.POST.get('Ten'),
            'SDT': request.POST.get('SDT'),
            'Email': request.POST.get('Email')
            # Avatar sẽ xử lý ở 1 route riêng qua upload ảnh
        }

        patch_response = requests.patch(url, json=updated_data)
        if patch_response.status_code == 200:
            user = patch_response.json()
            success_message = "Cập nhật thông tin thành công!"
        else:
            success_message = "Cập nhật thông tin thất bại!"

        return render(request, 'TTND/index.html', {'user': user, 'message': success_message, 'user_id': user_id})

    return render(request, 'TTND/index.html', {'user': user, 'user_id': user_id})
