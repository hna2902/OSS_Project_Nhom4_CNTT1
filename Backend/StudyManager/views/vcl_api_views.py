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
        viec = db.ViecCanLam.find_one({"MaViec": pk, "MaNguoiDung": user_id})
        if viec:
            return Response(viec)
        return Response({"error": "Không tìm thấy việc cần làm"}, status=404)

    def create(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        data = request.data
        ma_mon_hoc = data.get("MaMonHoc")
        ten_mon = data.get("TenMon")

        if ma_mon_hoc and not ten_mon:
            mon_hoc = db.QLMonHoc.find_one({"MaMonHoc": ma_mon_hoc, "MaNguoiDung": user_id}, {"TenMon": 1})
            ten_mon = mon_hoc["TenMon"] if mon_hoc else ""

        ma_viec = get_next_id("MAVCL", "MAVCL")

        db.ViecCanLam.insert_one({
            "MaViec": ma_viec,
            "NhacNho": data.get("NhacNho"),
            "GhiChu": data.get("GhiChu"),
            "ThoiHan": data.get("ThoiHan"),
            "MaMonHoc": ma_mon_hoc,
            "TenMon": ten_mon,
            "MaNguoiDung": user_id
        })

        return Response({"message": "Thêm việc cần làm thành công!"})

    def update(self, request, pk=None):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        viec = db.ViecCanLam.find_one({"MaViec": pk, "MaNguoiDung": user_id})
        if not viec:
            return Response({"error": "Không tìm thấy việc cần làm"}, status=404)

        data = request.data
        ma_mon_hoc = data.get("MaMonHoc")
        ten_mon = data.get("TenMon")

        if ma_mon_hoc and not ten_mon:
            mon_hoc = db.QLMonHoc.find_one({"MaMonHoc": ma_mon_hoc, "MaNguoiDung": user_id}, {"TenMon": 1})
            ten_mon = mon_hoc["TenMon"] if mon_hoc else ""

        db.ViecCanLam.update_one(
            {"MaViec": pk, "MaNguoiDung": user_id},
            {"$set": {
                "NhacNho": data.get("NhacNho"),
                "GhiChu": data.get("GhiChu"),
                "ThoiHan": data.get("ThoiHan"),
                "MaMonHoc": ma_mon_hoc,
                "TenMon": ten_mon
            }}
        )

        return Response({"message": "Sửa việc cần làm thành công!"})

    def destroy(self, request, pk=None):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        result = db.ViecCanLam.delete_one({"MaViec": pk, "MaNguoiDung": user_id})
        if result.deleted_count == 0:
            return Response({"error": "Không tìm thấy việc cần làm"}, status=404)

        return Response({"message": "Xóa việc cần làm thành công!"})