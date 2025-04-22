from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from StudyManager.database import db
from django.conf import settings
import os
import uuid

class ThongTinNguoiDungViewSet(viewsets.ViewSet):
    parser_classes = [MultiPartParser]

    def list(self, request):
        users = list(db.TaiKhoan.find({}, {"_id": 0}))
        return Response(users)

    def retrieve(self, request, pk=None):
        user = db.TaiKhoan.find_one({"_id": pk}, {"_id": 0})
        if user:
            return Response(user)
        return Response({"error": "Không tìm thấy người dùng"}, status=404)

    @action(detail=True, methods=['patch'])
    def update_user_info(self, request, pk=None):
        user_data = request.data
        user = db.TaiKhoan.find_one({"_id": pk})
        if not user:
            return Response({"error": "Không tìm thấy người dùng"}, status=404)

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
        return Response({"error": "Không có dữ liệu để cập nhật"}, status=400)

    @action(detail=True, methods=['post'])
    def upload_avatar(self, request, pk=None):
        user = db.TaiKhoan.find_one({"_id": pk})
        if not user:
            return Response({"error": "Không tìm thấy người dùng"}, status=404)

        avatar_file = request.FILES.get('avatar')
        if not avatar_file:
            return Response({"error": "Không có file ảnh được gửi lên"}, status=400)

        # Kiểm tra phần mở rộng hợp lệ (chỉ nhận jpg, png, jpeg)
        ext = os.path.splitext(avatar_file.name)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png']:
            return Response({"error": "Chỉ chấp nhận file ảnh .jpg, .jpeg, .png"}, status=400)

        # Đặt tên file duy nhất
        filename = f"{uuid.uuid4().hex}{ext}"
        save_dir = os.path.join(settings.BASE_DIR, 'StudyManager', 'static', 'img')
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, filename)
        # Đường dẫn public cho frontend
        avatar_url = f"/static/img/{filename}"

        with open(save_path, 'wb+') as f:
            for chunk in avatar_file.chunks():
                f.write(chunk)

        # Cập nhật avatar mới cho người dùng
        db.TaiKhoan.update_one({"_id": pk}, {"$set": {"Avatar": avatar_url}})

        return Response({
            "message": "Upload thành công!",
            "avatar_url": avatar_url
})

