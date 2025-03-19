from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db

class TaiKhoanViewSet(viewsets.ViewSet):
    def list(self, request):
        taikhoans = list(db.TaiKhoan.find({}, {"_id": 0}))
        return Response(taikhoans)

    def retrieve(self, request, pk=None):
        taikhoan = db.TaiKhoan.find_one({"Id": pk}, {"_id": 0})
        if taikhoan:
            return Response(taikhoan)
        return Response({"error": "Không tìm thấy tài khoản"}, status=404)
