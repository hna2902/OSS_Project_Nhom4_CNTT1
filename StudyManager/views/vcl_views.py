from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from StudyManager.models import QLMonHoc
import requests

def index(request):
    response = requests.get("http://localhost:8000/api/vieccanlam/", cookies=request.COOKIES)
    vieccanlams = response.json() if response.status_code == 200 else []
        # Lấy user_id từ session để lọc môn học
    user_id = request.session.get("user_id")
    monhocs = QLMonHoc.collection.find(
        {"MaNguoiDung": user_id},
        {"_id": 0, "MaMon": 1, "TenMon": 1}
    ) if user_id else []

    return render(request, 'VCL/index.html', {
        'vieccanlams': vieccanlams,
        'monhocs': monhocs
    })

@csrf_exempt
def add_viec(request):
    if request.method == 'POST':
        payload = {
            "NhacNho": request.POST.get("NhacNho"),
            "GhiChu": request.POST.get("GhiChu"),
            "ThoiHan": request.POST.get("ThoiHan"),
            "MaMon": request.POST.get("MaMon"),
        }
        requests.post("http://localhost:8000/api/vieccanlam/", data=payload, cookies=request.COOKIES)
        return HttpResponseRedirect(reverse('vieccanlam'))
    return HttpResponse("Phương thức không hợp lệ", status=405)