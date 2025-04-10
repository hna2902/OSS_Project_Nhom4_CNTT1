from django.shortcuts import render
from StudyManager.database import db

import requests

def index(request):
    response = requests.get("http://localhost:8000/api/monhoc/", cookies=request.COOKIES)
    monhocs = response.json() if response.status_code == 200 else []

    # Thêm bước chuyển đổi _id => id để dùng trong template
    for mh in monhocs:
        if '_id' in mh:
            mh['id'] = mh['_id']  # chuyển _id thành id cho dễ dùng
    print("user_id trong view HTML:", request.session.get("user_id"))
    return render(request, 'QLMH/index.html', {'monhocs': monhocs})


from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from StudyManager.database import db

import requests  # để gửi POST request

@csrf_exempt
def add_subject(request):
    if request.method == 'POST':
        payload = {
            "TenMon": request.POST.get("TenMon"),
            "GiangVien": request.POST.get("GiangVien"),
            "ThoiGianBatDau": request.POST.get("ThoiGianBatDau"),
            "ThoiGianKetThuc": request.POST.get("ThoiGianKetThuc"),
            "SoTinChi": request.POST.get("SoTinChi"),
            # KHÔNG truyền MaNguoiDung ở đây
        }

        # Lấy cookie để gửi kèm session id thôi
        requests.post(
            "http://localhost:8000/api/monhoc/",
            data=payload,
            cookies=request.COOKIES  # để backend tự lấy session
        )
        return HttpResponseRedirect(reverse('monhoc'))

    return HttpResponse("Phương thức không hợp lệ", status=405)

