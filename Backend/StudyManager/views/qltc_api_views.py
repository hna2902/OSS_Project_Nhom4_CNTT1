from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db
from StudyManager.counter import get_next_id

class QLTinChiViewSet(viewsets.ViewSet):
    def list(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response([], status=200)

        tinchis = list(db.QLTinChi.find({"MaNguoiDung": user_id}, {"_id": 0}))
        return Response(tinchis)

    def create(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        data = request.data
        ma_mon = data.get("MaMon")
        ten_mon = data.get("TenMon")

        # Nếu backend nhận được rỗng, tự tìm từ QLMonHoc
        if ma_mon and not ten_mon:
            mon_hoc = db.QLMonHoc.find_one({"MaMonHoc": ma_mon, "MaNguoiDung": user_id}, {"TenMon": 1})
            ten_mon = mon_hoc["TenMon"] if mon_hoc else ""

        id_tin_chi = get_next_id("IDTC", "IDTC")

        db.QLTinChi.insert_one({
            "IDTinChi": id_tin_chi,
            "TongTinChi": int(data.get("TongTinChi")),
            "SoChiDat": int(data.get("SoChiDat")),
            "SoChiNo": int(data.get("SoChiNo")),
            "MaMon": ma_mon,
            "TenMon": ten_mon,
            "MaNguoiDung": user_id
        })

        return Response({"message": "Thêm tín chỉ thành công!"})

    def update(self, request, pk=None):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        tinchi = db.QLTinChi.find_one({"IDTinChi": pk, "MaNguoiDung": user_id})
        if not tinchi:
            return Response({"error": "Không tìm thấy tín chỉ"}, status=404)

        data = request.data
        ma_mon = data.get("MaMon")
        ten_mon = data.get("TenMon")

        if ma_mon and not ten_mon:
            mon_hoc = db.QLMonHoc.find_one({"MaMonHoc": ma_mon, "MaNguoiDung": user_id}, {"TenMon": 1})
            ten_mon = mon_hoc["TenMon"] if mon_hoc else ""

        db.QLTinChi.update_one(
            {"IDTinChi": pk, "MaNguoiDung": user_id},
            {"$set": {
                "TongTinChi": int(data.get("TongTinChi")),
                "SoChiDat": int(data.get("SoChiDat")),
                "SoChiNo": int(data.get("SoChiNo")),
                "MaMon": ma_mon,
                "TenMon": ten_mon
            }}
        )

        return Response({"message": "Sửa tín chỉ thành công!"})

    def destroy(self, request, pk=None):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        result = db.QLTinChi.delete_one({"IDTinChi": pk, "MaNguoiDung": user_id})
        if result.deleted_count == 0:
            return Response({"error": "Không tìm thấy tín chỉ"}, status=404)

        return Response({"message": "Xóa tín chỉ thành công!"})