from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db

class ViecCanLamViewSet(viewsets.ViewSet):
    def list(self, request):
        vieccanlam = list(db.ViecCanLam.find({}, {"_id": 0}))
        return Response(vieccanlam)

    def retrieve(self, request, pk=None):
        vcl = db.ViecCanLam.find_one({"MaVCL": pk}, {"_id": 0})
        if vcl:
            return Response(vcl)
        return Response({"error": "Không tìm thấy việc cần làm"}, status=404)
