from django.shortcuts import render
from StudyManager.database import db

def index(request):
    vieccanlams = list(db.ViecCanLam.find({}, {"_id": 0}))
    return render(request, 'QLNN/index.html', {'vieccanlams': vieccanlams})
