from django.shortcuts import render
from StudyManager.database import db


def index(request):
    # Truy vấn danh sách tài khoản từ MongoDB
    taikhoans = list(db.TaiKhoan.find({}, {"_id": 0}))  # Không lấy trường "_id"
    return render(request, 'TK/index.html', {'taikhoans': taikhoans})