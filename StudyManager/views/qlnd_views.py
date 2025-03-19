from django.shortcuts import render
from StudyManager.database import db

def index(request):
    taikhoans = list(db.TaiKhoan.find({}, {"_id": 0}))
    return render(request, 'QLND/index.html', {'taikhoans': taikhoans})
