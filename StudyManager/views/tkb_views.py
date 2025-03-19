from django.shortcuts import render
from StudyManager.database import db

def index(request):
    tkbs = list(db.ThoiKhoaBieu.find({}, {"_id": 0}))
    return render(request, 'TKB/index.html', {'tkbs': tkbs})
