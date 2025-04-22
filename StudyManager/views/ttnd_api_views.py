from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, JSONParser
from StudyManager.database import db
from django.conf import settings
import os
import uuid
from django.contrib.auth.hashers import check_password, make_password

class ThongTinNguoiDungViewSet(viewsets.ViewSet):
    parser_classes = [MultiPartParser, JSONParser]

    def list(self, request):
        users = list(db.TaiKhoan.find({}, {"_id": 0}))
        return Response(users)

    def retrieve(self, request, pk=None):
        user = db.TaiKhoan.find_one({"_id": pk}, {"_id": 0})
        if user:
            return Response(user)
        return Response({"error": "Không tìm thấy người dùng"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'])
    def update_user_info(self, request, pk=None):
        user_data = request.data
        user = db.TaiKhoan.find_one({"_id": pk})
        if not user:
            return Response({"error": "Không tìm thấy người dùng"}, status=status.HTTP_404_NOT_FOUND)

        updated_data = {}
        if 'Ten' in user_data:
            updated_data['Ten'] = user_data['Ten']
        if 'SDT' in user_data:
            updated_data['SDT'] = user_data['SDT']
        if 'Email' in user_data:
            updated_data['Email'] = user_data['Email']
        if 'Avatar' in user_data:
            updated_data['Avatar'] = user_data['Avatar']

        if updated_data:
            db.TaiKhoan.update_one({"_id": pk}, {"$set": updated_data})
            return Response({"message": "Cập nhật thành công!"})
        return Response({"error": "Không có dữ liệu để cập nhật"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_avatar(self, request, pk=None):
        user = db.TaiKhoan.find_one({"_id": pk})
        if not user:
            return Response({"error": "Không tìm thấy người dùng"}, status=status.HTTP_404_NOT_FOUND)

        avatar_file = request.FILES.get('avatar')
        if not avatar_file:
            return Response({"error": "Không có file ảnh được gửi lên"}, status=status.HTTP_400_BAD_REQUEST)

        ext = os.path.splitext(avatar_file.name)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png']:
            return Response({"error": "Chỉ chấp nhận file ảnh .jpg, .jpeg, .png"}, status=status.HTTP_400_BAD_REQUEST)

        filename = f"{uuid.uuid4().hex}{ext}"
        save_dir = os.path.join(settings.BASE_DIR, 'StudyManager', 'static', 'img')
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, filename)
        avatar_url = f"/static/img/{filename}"

        with open(save_path, 'wb+') as f:
            for chunk in avatar_file.chunks():
                f.write(chunk)

        db.TaiKhoan.update_one({"_id": pk}, {"$set": {"Avatar": avatar_url}})

        return Response({
            "message": "Upload thành công!",
            "avatar_url": avatar_url
        })

    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        user = db.TaiKhoan.find_one({"_id": pk})
        if not user:
            return Response({"error": "Không tìm thấy người dùng"}, status=status.HTTP_404_NOT_FOUND)

        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response({"error": "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới"}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra mật khẩu hiện tại
        if not check_password(old_password, user.get('MatKhauHash', '')):
            return Response({"error": "Mật khẩu hiện tại không đúng"}, status=status.HTTP_400_BAD_REQUEST)

        # Hash mật khẩu mới
        hashed_new_password = make_password(new_password)

        # Cập nhật mật khẩu mới vào database
        db.TaiKhoan.update_one({"_id": pk}, {"$set": {"MatKhauHash": hashed_new_password}})

        return Response({"message": "Đổi mật khẩu thành công!"})