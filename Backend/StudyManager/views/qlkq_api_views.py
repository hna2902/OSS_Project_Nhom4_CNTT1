from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db
from StudyManager.counter import get_next_id

class QLKetQuaHocViewSet(viewsets.ViewSet):
    def list(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response([], status=200)

        ketquas = list(db.QLKetQuaHoc.find({"MaNguoiDung": user_id}, {"_id": 0}))
        return Response(ketquas)

    def create(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        data = request.data
        ma_mon = data.get("MaMonHoc")
        diem_giua_ky = data.get("DiemGiuaKy")
        diem_cuoi_ky = data.get("DiemCuoiKy")

        # Truy vấn tên môn học từ bảng QLMonHoc
        mon_hoc = db.QLMonHoc.find_one({"MaMonHoc": ma_mon})
        ten_mon = mon_hoc["TenMon"] if mon_hoc else "Không tìm thấy tên môn"

        ma_ket_qua = get_next_id("MAKQH", "MAKQH")
        diem_tb = (float(diem_giua_ky) + float(diem_cuoi_ky)) / 2

        # Thêm kết quả học vào cơ sở dữ liệu
        db.QLKetQuaHoc.insert_one({
            "_id": ma_ket_qua,
            "MaKetQuaHoc": ma_ket_qua,
            "MaMonHoc": ma_mon,
            "TenMonHoc": ten_mon,  # Thêm tên môn vào dữ liệu
            "DiemGiuaKy": float(diem_giua_ky),
            "DiemCuoiKy": float(diem_cuoi_ky),
            "DiemTrungBinh": round(diem_tb, 2),
            "MaNguoiDung": user_id,
        })

        return Response({"message": "Thêm kết quả học thành công!"})

    def update(self, request, pk=None):
        user_id = request.session.get("user_id")
        ketqua = db.QLKetQuaHoc.find_one({"_id": pk, "MaNguoiDung": user_id})
        if not ketqua:
            return Response({"error": "Không tìm thấy hoặc không có quyền sửa."}, status=404)

        diem_giua_ky = request.data.get("DiemGiuaKy")
        diem_cuoi_ky = request.data.get("DiemCuoiKy")
        ma_mon = request.data.get("MaMonHoc")

        update_data = {}

        if diem_giua_ky is not None:
            update_data["DiemGiuaKy"] = float(diem_giua_ky)
        if diem_cuoi_ky is not None:
            update_data["DiemCuoiKy"] = float(diem_cuoi_ky)
        if ma_mon:
            update_data["MaMonHoc"] = ma_mon

        # Cập nhật DiemTrungBinh nếu có đủ điểm
        if "DiemGiuaKy" in update_data or "DiemCuoiKy" in update_data:
            diem1 = update_data.get("DiemGiuaKy", ketqua.get("DiemGiuaKy", 0))
            diem2 = update_data.get("DiemCuoiKy", ketqua.get("DiemCuoiKy", 0))
            update_data["DiemTrungBinh"] = round((diem1 + diem2) / 2, 2)

        db.QLKetQuaHoc.update_one({"_id": pk, "MaNguoiDung": user_id}, {"$set": update_data})
        return Response({"message": "Kết quả học đã được cập nhật."})

    def destroy(self, request, pk=None):
        user_id = request.session.get("user_id")
        result = db.QLKetQuaHoc.delete_one({"_id": pk, "MaNguoiDung": user_id})
        if result.deleted_count == 0:
            return Response({"error": "Không tìm thấy hoặc không có quyền xóa."}, status=404)
        return Response({"message": "Kết quả học đã được xóa."}, status=204)
