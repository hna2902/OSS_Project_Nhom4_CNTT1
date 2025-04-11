from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db
from StudyManager.counter import get_next_id


class ViecCanLamViewSet(viewsets.ViewSet):
    def list(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response([], status=200)

        data = list(db.ViecCanLam.find({"MaNguoiDung": user_id}, {"_id": 0}))
        return Response(data)

    def retrieve(self, request, pk=None):
        user_id = request.session.get("user_id")
        viec = db.ViecCanLam.find_one({"_id": pk, "MaNguoiDung": user_id})
        if viec:
            return Response(viec)
        return Response({"error": "Không tìm thấy việc cần làm"}, status=404)

    def create(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        data = request.data
        nhac_nho = data.get("NhacNho")
        ghi_chu = data.get("GhiChu")
        thoi_han = data.get("ThoiHan")
        ma_mon = data.get("MaMon")

        ma_viec = get_next_id("MAVCL", "MAVCL")

        db.ViecCanLam.insert_one({
            "_id": ma_viec,
            "MaViec": ma_viec,
            "NhacNho": nhac_nho,
            "GhiChu": ghi_chu,
            "ThoiHan": thoi_han,
            "MaMon": ma_mon,
            "MaNguoiDung": user_id,
        })

        return Response({"message": "Thêm việc cần làm thành công!"})

    def update(self, request, pk=None):
        user_id = request.session.get("user_id")
        viec = db.ViecCanLam.find_one({"_id": pk, "MaNguoiDung": user_id})
        if not viec:
            return Response({"error": "Không tìm thấy việc cần làm hoặc không có quyền sửa."}, status=404)

        data = request.data
        update_data = {}
        if data.get("NhacNho"):
            update_data["NhacNho"] = data.get("NhacNho")
        if data.get("GhiChu"):
            update_data["GhiChu"] = data.get("GhiChu")
        if data.get("ThoiHan"):
            update_data["ThoiHan"] = data.get("ThoiHan")
        if data.get("MaMon"):
            update_data["MaMon"] = data.get("MaMon")

        db.ViecCanLam.update_one({"_id": pk, "MaNguoiDung": user_id}, {"$set": update_data})
        return Response({"message": "Cập nhật việc cần làm thành công!"})

    def destroy(self, request, pk=None):
        user_id = request.session.get("user_id")
        result = db.ViecCanLam.delete_one({"_id": pk, "MaNguoiDung": user_id})
        if result.deleted_count == 0:
            return Response({"error": "Không tìm thấy hoặc không có quyền xóa."}, status=404)
        return Response({"message": "Việc cần làm đã được xóa."}, status=204)
