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
        diem_giua_ky = float(data.get("DiemGiuaKy", 0))
        diem_cuoi_ky = float(data.get("DiemCuoiKy", 0))

        # Mặc định hệ số là 3-7
        he_so_gk = float(data.get("HeSoGiuaKy", 3))
        he_so_ck = float(data.get("HeSoCuoiKy", 7))
        tong_he_so = he_so_gk + he_so_ck

        # Tính điểm trung bình theo hệ số
        diem_tb = round((diem_giua_ky * he_so_gk + diem_cuoi_ky * he_so_ck) / tong_he_so, 2)

        mon_hoc = db.QLMonHoc.find_one({"MaMonHoc": ma_mon})
        ten_mon = mon_hoc["TenMon"] if mon_hoc else "Không tìm thấy tên môn"

        ma_ket_qua = get_next_id("MAKQH", "MAKQH")

        db.QLKetQuaHoc.insert_one({
            "_id": ma_ket_qua,
            "MaKetQuaHoc": ma_ket_qua,
            "MaMonHoc": ma_mon,
            "TenMonHoc": ten_mon,
            "DiemGiuaKy": diem_giua_ky,
            "DiemCuoiKy": diem_cuoi_ky,
            "HeSoGiuaKy": he_so_gk,
            "HeSoCuoiKy": he_so_ck,
            "DiemTrungBinh": diem_tb,
            "MaNguoiDung": user_id,
        })

        return Response({"message": "Thêm kết quả học thành công!"})


    def update(self, request, pk=None):
        user_id = request.session.get("user_id")
        ketqua = db.QLKetQuaHoc.find_one({"_id": pk, "MaNguoiDung": user_id})
        if not ketqua:
            return Response({"error": "Không tìm thấy hoặc không có quyền sửa."}, status=404)

        data = request.data
        update_data = {}

        diem_gk = float(data.get("DiemGiuaKy", ketqua.get("DiemGiuaKy", 0)))
        diem_ck = float(data.get("DiemCuoiKy", ketqua.get("DiemCuoiKy", 0)))

        he_so_gk = float(data.get("HeSoGiuaKy", ketqua.get("HeSoGiuaKy", 3)))
        he_so_ck = float(data.get("HeSoCuoiKy", ketqua.get("HeSoCuoiKy", 7)))
        tong_he_so = he_so_gk + he_so_ck

        update_data["DiemGiuaKy"] = diem_gk
        update_data["DiemCuoiKy"] = diem_ck
        update_data["HeSoGiuaKy"] = he_so_gk
        update_data["HeSoCuoiKy"] = he_so_ck
        update_data["DiemTrungBinh"] = round((diem_gk * he_so_gk + diem_ck * he_so_ck) / tong_he_so, 2)

        db.QLKetQuaHoc.update_one({"_id": pk, "MaNguoiDung": user_id}, {"$set": update_data})
        return Response({"message": "Kết quả học đã được cập nhật."})

    def destroy(self, request, pk=None):
        user_id = request.session.get("user_id")
        result = db.QLKetQuaHoc.delete_one({"_id": pk, "MaNguoiDung": user_id})
        if result.deleted_count == 0:
            return Response({"error": "Không tìm thấy hoặc không có quyền xóa."}, status=404)
        return Response({"message": "Kết quả học đã được xóa."}, status=204)
