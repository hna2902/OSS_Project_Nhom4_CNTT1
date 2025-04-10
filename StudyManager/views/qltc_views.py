from django.shortcuts import render
from StudyManager.database import db
import requests

def index(request):
    response = requests.get("http://localhost:8000/api/tinchi/")
    tinchis = response.json() if response.status_code == 200 else []
    return render(request, 'QLTC/index.html', {'tinchis': tinchis})

from django.shortcuts import redirect
from rest_framework.test import APIRequestFactory
from StudyManager.views.qlmh_api_views import QLMonHocViewSet

def add_subject(request):
    if request.method == "POST":
        factory = APIRequestFactory()
        api_request = factory.post('/api/monhoc/', data={
            "TenMon": request.POST.get("TenMon"),
            "SoTinChi": request.POST.get("SoTinChi"),
            "ThoiGianBatDau": request.POST.get("ThoiGianBatDau"),
            "ThoiGianKetThuc": request.POST.get("ThoiGianKetThuc"),
            "GiangVien": request.POST.get("GiangVien"),
        }, format='json')

        api_request.session = request.session  # Gán session để lấy user_id trong ViewSet
        response = QLMonHocViewSet.as_view({'post': 'create'})(api_request)

        if response.status_code == 201:
            return redirect('/monhoc/')
        else:
            return redirect('/monhoc/?error=1')

    return redirect('/monhoc/')
