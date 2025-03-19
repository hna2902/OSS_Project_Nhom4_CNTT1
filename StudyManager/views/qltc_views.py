from django.shortcuts import render
from StudyManager.database import db

def index(request):
    tinchis = list(db.QLTinChi.find({}, {"_id": 0}))
    return render(request, 'QLTC/index.html', {'tinchis': tinchis})
