from rest_framework import viewsets
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from StudyManager.database import db
from StudyManager.counter import get_next_id

class TaiKhoanViewSet(viewsets.ViewSet):

    def create(self, request):
        # Đăng ký tài khoản
        tai_khoan = request.data.get('tai_khoan')
        mat_khau = request.data.get('mat_khau')
        ten = request.data.get('ten')
        sdt = request.data.get('sdt', '')
        quyen = request.data.get('quyen', 'User')
        avatar = request.data.get('avatar', 'static/img/default_avatar.png')

        # Kiểm tra tài khoản đã tồn tại
        if db.TaiKhoan.find_one({"TaiKhoan": tai_khoan}):
            return Response({'error': 'Tài khoản đã tồn tại!'}, status=400)

        # Lấy user_id tự động
        user_id = get_next_id("UID", "UID")

        # Hash mật khẩu và lưu vào DB
        mat_khau_hash = make_password(mat_khau)
        db.TaiKhoan.insert_one({
            "_id": user_id,
            "TaiKhoan": tai_khoan,
            "MatKhauHash": mat_khau_hash,
            "Ten": ten,
            "SDT": sdt,
            "Quyen": quyen,
            "Avatar": avatar,
        })

        return Response({"message": "Đăng ký thành công."}, status=201)

    def retrieve(self, request, pk=None):
        # Lấy thông tin người dùng
        user_info = db.TaiKhoan.find_one({"_id": pk}, {"MatKhauHash": 0})
        if user_info:
            return Response(user_info)
        return Response({"error": "Người dùng không tồn tại"}, status=404)

    def update(self, request, pk=None):
        # Cập nhật thông tin người dùng
        ten = request.data.get('ten')
        sdt = request.data.get('sdt')
        avatar = request.data.get('avatar')

        update_data = {}
        if ten:
            update_data["Ten"] = ten
        if sdt:
            update_data["SDT"] = sdt
        if avatar:
            update_data["Avatar"] = avatar

        if update_data:
            db.TaiKhoan.update_one({"_id": pk}, {"$set": update_data})

        return Response({"message": "Cập nhật thông tin người dùng thành công."})

    def destroy(self, request, pk=None):
        # Xóa tài khoản người dùng
        db.TaiKhoan.delete_one({"_id": pk})
        return Response({"message": "Tài khoản đã được xóa."}, status=204)

    def login(self, request):
        # Xác thực tài khoản
        tai_khoan = request.data.get('tai_khoan')
        mat_khau = request.data.get('mat_khau')

        user = db.TaiKhoan.find_one({"TaiKhoan": tai_khoan})
        if user and check_password(mat_khau, user["MatKhauHash"]):
            return Response({'message': 'Đăng nhập thành công', 'user_info': user}, status=200)
        return Response({'error': 'Tài khoản hoặc mật khẩu không đúng!'}, status=400)
