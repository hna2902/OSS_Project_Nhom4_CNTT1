from django.shortcuts import render
from StudyManager.database import db
import requests

def index(request):
    user_id = request.session.get("user_id")
    if not user_id:
        return render(request, 'TTND/index.html', {'user': None})  # hoặc redirect nếu muốn

    url = f"http://localhost:8000/api/thongtinnguoidung/{user_id}/"
    response = requests.get(url)
    user = response.json() if response.status_code == 200 else None

    return render(request, 'TTND/index.html', {'user': user})
