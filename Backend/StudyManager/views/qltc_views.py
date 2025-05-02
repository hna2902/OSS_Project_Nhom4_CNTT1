from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from StudyManager.database import db
from StudyManager.models import QLMonHoc
import requests

@csrf_exempt
def index(request):
    # Lấy danh sách tín chỉ
    response = requests.get("http://localhost:8000/api/tinchi/", cookies=request.COOKIES)
    tinchis = response.json() if response.status_code == 200 else []

    # Lấy danh sách môn học
    user_id = request.session.get("user_id")
    monhocs = QLMonHoc.collection.find(
        {"MaNguoiDung": user_id},
        {"MaMonHoc": 1, "TenMon": 1}
    ) if user_id else []
    monhocs = list(monhocs)

    if request.method == 'POST':
        action = request.POST.get("action")

        # Xử lý thêm tín chỉ
        if action == "add":
            ma_mon = request.POST.get("MaMon")
            ten_mon = ""

            if ma_mon and user_id:
                mon_hoc = QLMonHoc.collection.find_one(
                    {"MaMonHoc": ma_mon, "MaNguoiDung": user_id},
                    {"TenMon": 1}
                )
                ten_mon = mon_hoc["TenMon"] if mon_hoc else ""

            payload = {
                "TongTinChi": request.POST.get("TongTinChi"),
                "SoChiDat": request.POST.get("SoChiDat"),
                "SoChiNo": request.POST.get("SoChiNo"),
                "MaMon": ma_mon,
                "TenMon": ten_mon
            }

            response = requests.post("http://localhost:8000/api/tinchi/", data=payload, cookies=request.COOKIES)

            if response.status_code == 200:
                return HttpResponseRedirect(reverse('tinchi'))
            return HttpResponse("Lỗi khi thêm tín chỉ", status=500)

        # Xử lý sửa tín chỉ
        elif action == "update":
            id_tin_chi = request.POST.get("IDTinChi")
            ma_mon = request.POST.get("MaMon")
            ten_mon = ""

            if ma_mon and user_id:
                mon_hoc = QLMonHoc.collection.find_one(
                    {"MaMonHoc": ma_mon, "MaNguoiDung": user_id},
                    {"TenMon": 1}
                )
                ten_mon = mon_hoc["TenMon"] if mon_hoc else ""

            payload = {
                "TongTinChi": request.POST.get("TongTinChi"),
                "SoChiDat": request.POST.get("SoChiDat"),
                "SoChiNo": request.POST.get("SoChiNo"),
                "MaMon": ma_mon,
                "TenMon": ten_mon,
                "IDTinChi": id_tin_chi
            }

            response = requests.put(f"http://localhost:8000/api/tinchi/{id_tin_chi}/", data=payload, cookies=request.COOKIES)

            if response.status_code == 200:
                return HttpResponseRedirect(reverse('tinchi'))
            return HttpResponse("Lỗi khi sửa tín chỉ", status=500)

        # Xử lý xóa tín chỉ
        elif action == "delete":
            id_tin_chi = request.POST.get("IDTinChi")
            response = requests.delete(f"http://localhost:8000/api/tinchi/{id_tin_chi}/", cookies=request.COOKIES)

            if response.status_code == 200:
                return HttpResponseRedirect(reverse('tinchi'))
            return HttpResponse("Lỗi khi xóa tín chỉ", status=500)

        return HttpResponse("Hành động không hợp lệ", status=400)

    return render(request, 'QLTC/index.html', {
        'tinchis': tinchis,
        'monhocs': monhocs
    })


