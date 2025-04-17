from django.shortcuts import render, redirect
from StudyManager.database import db
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
import requests

def index(request):
    # Gọi API lấy thời khóa biểu
    response = requests.get(
        "http://127.0.0.1:8000/api/thoikhoabieu/",
        cookies=request.COOKIES
    )
    tkbs = response.json() if response.status_code == 200 else []

    ds_thu = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
    ds_thoi_gian = sorted(list({tkb["ThoiGianHoc"] for tkb in tkbs}))

    # Lấy user_id từ session
    user_id = request.session.get("user_id")

    # Lấy danh sách tên môn học theo người dùng
    ds_monhoc = list(db.QLMonHoc.find(
        {"MaNguoiDung": user_id},
        {"_id": 0, "TenMon": 1}
    ))

    return render(request, 'TKB/index.html', {
        'tkbs': tkbs,
        'ds_thu': ds_thu,
        'ds_thoi_gian': ds_thoi_gian,
        'ds_monhoc': ds_monhoc,
        'so_cot': len(ds_thu) + 1
    })

def add_schedule(request):
    if request.method == 'POST':
        payload = {
            "Thu": request.POST.get("Thu"),
            "MonHoc": request.POST.get("MonHoc"),
            "ThoiGianHoc": request.POST.get("ThoiGianHoc"),
        }

        # Gửi POST tới API để thêm
        response = requests.post(
            "http://localhost:8000/api/thoikhoabieu/",
            data=payload,
            cookies=request.COOKIES  # gửi kèm session
        )
        return HttpResponseRedirect(reverse('thoikhoabieu'))

    return HttpResponse("Phương thức không hợp lệ", status=405)

def delete_schedule(request, pk):
    # Xóa toàn bộ TKB theo MaTKB
    response = requests.delete(
        f"http://127.0.0.1:8000/api/thoikhoabieu/{pk}/",
        cookies=request.COOKIES
    )
    
    if response.status_code == 200:
        return redirect('thoikhoabieu')
    else:
        return HttpResponse("Có lỗi xảy ra khi xóa TKB", status=400)

def update_schedule(request, pk):
    if request.method == 'POST':
        payload = {
            "Thu": request.POST.get("Thu"),
            "MonHoc": request.POST.get("MonHoc"),
            "ThoiGianHoc": request.POST.get("ThoiGianHoc"),
        }

        # Gửi PUT request đến API để cập nhật môn học
        response = requests.put(
            f"http://127.0.0.1:8000/api/thoikhoabieu/{pk}/",
            data=payload,
            cookies=request.COOKIES
        )

        if response.status_code == 200:
            return HttpResponseRedirect(reverse('thoikhoabieu'))
        else:
            return HttpResponse("Có lỗi xảy ra khi sửa môn học", status=400)

    return HttpResponse("Phương thức không hợp lệ", status=405)

def delete_schedule_subject(request, pk):
    # Xóa môn học theo IDTKB
    response = requests.delete(
        f"http://127.0.0.1:8000/api/thoikhoabieu/{pk}/delete_subject/",
        cookies=request.COOKIES
    )

    if response.status_code == 200:
        return redirect('thoikhoabieu')
    else:
        return HttpResponse("Có lỗi xảy ra khi xóa môn học trong TKB", status=400)
