from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db

class ThongTinNguoiDungViewSet(viewsets.ViewSet):
    def list(self, request):
        # Trả về tất cả tài khoản nếu cần
        users = list(db.TaiKhoan.find({}, {"_id": 0}))
        return Response(users)

    def retrieve(self, request, pk=None):
        # Tìm theo _id
        user = db.TaiKhoan.find_one({"_id": pk}, {"_id": 0})
        if user:
            return Response(user)
        return Response({"error": "Không tìm thấy người dùng"}, status=404)
