from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db

class QLMonHocViewSet(viewsets.ViewSet):
    def list(self, request):
        monhocs = list(db.QLMonHoc.find({}, {"_id": 0}))
        return Response(monhocs)

    def retrieve(self, request, pk=None):
        monhoc = db.QLMonHoc.find_one({"IDMonHoc": pk}, {"_id": 0})
        if monhoc:
            return Response(monhoc)
        return Response({"error": "Không tìm thấy môn học"}, status=404)
