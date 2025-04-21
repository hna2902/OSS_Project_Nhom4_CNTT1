from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db
from rest_framework.decorators import action

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
    
    @action(detail=True, methods=['patch'])
    def update_user_info(self, request, pk=None):  # Đổi tên phương thức
        user_data = request.data
        user = db.TaiKhoan.find_one({"_id": pk})

        if not user:
            return Response({"error": "Không tìm thấy người dùng"}, status=404)
        
        # Cập nhật thông tin người dùng (Tên, SĐT, Email, Avatar)
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
