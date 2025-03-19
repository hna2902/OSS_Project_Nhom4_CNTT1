from django.shortcuts import render
from StudyManager.database import db

def index(request):
    vieccanlams = list(db.ViecCanLam.find({}, {"_id": 0}))
    return render(request, 'VCL/index.html', {'vieccanlams': vieccanlams})
