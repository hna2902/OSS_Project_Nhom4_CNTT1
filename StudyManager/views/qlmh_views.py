from django.shortcuts import render
from StudyManager.database import db

def index(request):
    monhocs = list(db.QLMonHoc.find({}, {"_id": 0}))
    return render(request, 'QLMH/index.html', {'monhocs': monhocs})
