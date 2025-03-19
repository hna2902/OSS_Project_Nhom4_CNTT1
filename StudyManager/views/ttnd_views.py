from django.shortcuts import render
from StudyManager.database import db

def index(request):
    nguoidungs = list(db.ThongTinNguoiDung.find({}, {"_id": 0}))
    return render(request, 'TTND/index.html', {'nguoidungs': nguoidungs})
