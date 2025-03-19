from django.shortcuts import render
from StudyManager.database import db

def index(request):
    ketquas = list(db.QLKetQuaHoc.find({}, {"_id": 0}))
    return render(request, 'QLKQ/index.html', {'ketquas': ketquas})
