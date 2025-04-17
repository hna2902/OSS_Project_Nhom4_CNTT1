from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from StudyManager.models import QLMonHoc
import requests

@csrf_exempt
def index(request):
    # Lấy danh sách việc cần làm
    response = requests.get("http://localhost:8000/api/vieccanlam/", cookies=request.COOKIES)
    vieccanlams = response.json() if response.status_code == 200 else []

    user_id = request.session.get("user_id")
    monhocs = QLMonHoc.collection.find(
        {"MaNguoiDung": user_id},
        {"MaMonHoc": 1, "TenMon": 1}
    ) if user_id else []
    monhocs = list(monhocs)  # Chuyển đổi cursor thành list
    print("Monhocs:", monhocs)  # Debug
    print("ViecCanLams:", vieccanlams)  # Debug

    if request.method == 'POST':
        action = request.POST.get("action")

        # Xử lý thêm việc
        if action == "add":
            ma_mon_hoc = request.POST.get("MaMonHoc")
            ten_mon = ""

            if ma_mon_hoc and user_id:
                mon_hoc = QLMonHoc.collection.find_one(
                    {"MaMonHoc": ma_mon_hoc, "MaNguoiDung": user_id},
                    {"TenMon": 1}
                )
                ten_mon = mon_hoc["TenMon"] if mon_hoc else ""

            payload = {
                "NhacNho": request.POST.get("NhacNho"),
                "GhiChu": request.POST.get("GhiChu"),
                "ThoiHan": request.POST.get("ThoiHan"),
                "MaMonHoc": ma_mon_hoc,
                "TenMon": ten_mon
            }

            response = requests.post("http://localhost:8000/api/vieccanlam/", data=payload, cookies=request.COOKIES)

            if response.status_code == 200:
                return HttpResponseRedirect(reverse('vieccanlam'))
            return HttpResponse("Lỗi khi thêm việc", status=500)

        # Xử lý sửa việc
        elif action == "update":
            ma_viec = request.POST.get("MaViec")
            ma_mon_hoc = request.POST.get("MaMonHoc")
            ten_mon = ""

            if ma_mon_hoc and user_id:
                mon_hoc = QLMonHoc.collection.find_one(
                    {"MaMonHoc": ma_mon_hoc, "MaNguoiDung": user_id},
                    {"TenMon": 1}
                )
                ten_mon = mon_hoc["TenMon"] if mon_hoc else ""

            payload = {
                "NhacNho": request.POST.get("NhacNho"),
                "GhiChu": request.POST.get("GhiChu"),
                "ThoiHan": request.POST.get("ThoiHan"),
                "MaMonHoc": ma_mon_hoc,
                "TenMon": ten_mon,
                "MaViec": ma_viec
            }

            response = requests.put(f"http://localhost:8000/api/vieccanlam/{ma_viec}/", data=payload, cookies=request.COOKIES)

            if response.status_code == 200:
                return HttpResponseRedirect(reverse('vieccanlam'))
            return HttpResponse("Lỗi khi sửa việc", status=500)

        # Xử lý xóa việc
        elif action == "delete":
            ma_viec = request.POST.get("MaViec")
            response = requests.delete(f"http://localhost:8000/api/vieccanlam/{ma_viec}/", cookies=request.COOKIES)

            if response.status_code == 200:
                return HttpResponseRedirect(reverse('vieccanlam'))
            return HttpResponse("Lỗi khi xóa việc", status=500)

        return HttpResponse("Hành động không hợp lệ", status=400)

    return render(request, 'VCL/index.html', {
        'vieccanlams': vieccanlams,
        'monhocs': monhocs
    })