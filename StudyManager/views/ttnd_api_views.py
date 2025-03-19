from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db

class ThongTinNguoiDungViewSet(viewsets.ViewSet):
    def list(self, request):
        users = list(db.ThongTinNguoiDung.find({}, {"_id": 0}))
        return Response(users)

    def retrieve(self, request, pk=None):
        user = db.ThongTinNguoiDung.find_one({"MaNguoiDung": pk}, {"_id": 0})
        if user:
            return Response(user)
        return Response({"error": "Không tìm thấy người dùng"}, status=404)
