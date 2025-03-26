from django.shortcuts import render
from StudyManager.database import db
import requests

def index(request):
    response = requests.get("http://localhost:8000/api/thongtinnguoidung/")
    nguoidungs = response.json() if response.status_code == 200 else []
    return render(request, 'TTND/index.html', {'nguoidungs': nguoidungs})