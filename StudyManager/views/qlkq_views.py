from django.shortcuts import render
from StudyManager.database import db
import requests


def index(request):
    response = requests.get("http://localhost:8000/api/ketqua/")
    ketquas = response.json() if response.status_code == 200 else []
    return render(request, 'QLKQ/index.html', {'ketquas': ketquas})
