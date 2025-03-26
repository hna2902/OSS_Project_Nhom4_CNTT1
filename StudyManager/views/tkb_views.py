from django.shortcuts import render
from StudyManager.database import db
import requests

def index(request):
    response = requests.get("http://127.0.0.1:8000/api/thoikhoabieu/")
    tkbs = response.json() if response.status_code == 200 else []
    print("Dữ liệu API trả về:", tkbs)  # Debug: In dữ liệu trả về

    ds_thu = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
    so_cot = len(ds_thu) + 1  # Thêm 1 cột cho "Thời Gian"
    return render(request, 'TKB/index.html', {'tkbs': tkbs, 'ds_thu': ds_thu, 'so_cot': so_cot})
