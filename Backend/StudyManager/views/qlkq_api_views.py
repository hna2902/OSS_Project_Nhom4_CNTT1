from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db

class QLKetQuaHocViewSet(viewsets.ViewSet):
    def list(self, request):
        ketquas = list(db.QLKetQuaHoc.find({}, {"_id": 0}))
        return Response(ketquas)

    def retrieve(self, request, pk=None):
        ketqua = db.QLKetQuaHoc.find_one({"MaKetQuaHoc": pk}, {"_id": 0})
        if ketqua:
            return Response(ketqua)
        return Response({"error": "Không tìm thấy kết quả học"}, status=404)
