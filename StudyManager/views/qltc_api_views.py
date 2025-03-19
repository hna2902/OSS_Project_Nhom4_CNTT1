from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db

class QLTinChiViewSet(viewsets.ViewSet):
    def list(self, request):
        tinchis = list(db.QLTinChi.find({}, {"_id": 0}))
        return Response(tinchis)

    def retrieve(self, request, pk=None):
        tinchi = db.QLTinChi.find_one({"IDTinChi": pk}, {"_id": 0})
        if tinchi:
            return Response(tinchi)
        return Response({"error": "Không tìm thấy tín chỉ"}, status=404)
