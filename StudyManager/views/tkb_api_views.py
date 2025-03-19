from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db

class ThoiKhoaBieuViewSet(viewsets.ViewSet):
    def list(self, request):
        tkb = list(db.ThoiKhoaBieu.find({}, {"_id": 0}))
        return Response(tkb)

    def retrieve(self, request, pk=None):
        tkb = db.ThoiKhoaBieu.find_one({"MaTKB": pk}, {"_id": 0})
        if tkb:
            return Response(tkb)
        return Response({"error": "Không tìm thấy thời khóa biểu"}, status=404)
