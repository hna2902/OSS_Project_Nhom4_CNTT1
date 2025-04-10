from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db
from StudyManager.counter import get_next_id

class QLMonHocViewSet(viewsets.ViewSet):
    def list(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response([], status=200)

        data = list(db.QLMonHoc.find({"MaNguoiDung": user_id}, {"_id": 0}))
        return Response(data)


    def retrieve(self, request, pk=None):
        user_id = request.session.get('user_id')
        monhoc = db.QLMonHoc.find_one({"_id": pk, "MaNguoiDung": user_id})
        if monhoc:
            return Response(monhoc)
        return Response({"error": "Không tìm thấy môn học"}, status=404)

    def create(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        data = request.data
        ten_mon = data.get("TenMon")
        giang_vien = data.get("GiangVien")
        thoi_gian_bat_dau = data.get("ThoiGianBatDau")
        thoi_gian_ket_thuc = data.get("ThoiGianKetThuc")
        so_tin_chi = data.get("SoTinChi")

        ma_mon = get_next_id("MAMON", "MAMON")

        db.QLMonHoc.insert_one({
            "_id": ma_mon,  # 👈 thêm dòng này để đồng nhất kiểu _id
            "MaMonHoc": ma_mon,
            "TenMon": ten_mon,
            "GiangVien": giang_vien,
            "ThoiGianBatDau": thoi_gian_bat_dau,
            "ThoiGianKetThuc": thoi_gian_ket_thuc,
            "SoTinChi": int(so_tin_chi),
            "MaNguoiDung": user_id,
        })

        return Response({"message": "Thêm môn học thành công!"})


    def update(self, request, pk=None):
        user_id = request.session.get('user_id')
        monhoc = db.QLMonHoc.find_one({"_id": pk, "MaNguoiDung": user_id})
        if not monhoc:
            return Response({"error": "Không tìm thấy môn học hoặc không có quyền sửa."}, status=404)

        ten_mon = request.data.get("TenMon")
        so_tin_chi = request.data.get("SoTinChi")
        thoi_gian_bat_dau = request.data.get("ThoiGianBatDau")
        thoi_gian_ket_thuc = request.data.get("ThoiGianKetThuc")
        giang_vien = request.data.get("GiangVien")

        update_data = {}
        if ten_mon:
            update_data["TenMon"] = ten_mon
        if so_tin_chi:
            update_data["SoTinChi"] = int(so_tin_chi)
        if thoi_gian_bat_dau and thoi_gian_ket_thuc:
            if thoi_gian_bat_dau >= thoi_gian_ket_thuc:
                return Response({"error": "Thời gian bắt đầu phải trước thời gian kết thúc!"}, status=400)
            update_data["ThoiGianBatDau"] = thoi_gian_bat_dau
            update_data["ThoiGianKetThuc"] = thoi_gian_ket_thuc
        if giang_vien:
            update_data["GiangVien"] = giang_vien

        db.QLMonHoc.update_one({"_id": pk, "MaNguoiDung": user_id}, {"$set": update_data})
        return Response({"message": "Môn học đã được cập nhật."})

    def destroy(self, request, pk=None):
        user_id = request.session.get('user_id')
        result = db.QLMonHoc.delete_one({"_id": pk, "MaNguoiDung": user_id})
        if result.deleted_count == 0:
            return Response({"error": "Không tìm thấy hoặc không có quyền xóa."}, status=404)
        return Response({"message": "Môn học đã được xóa."}, status=204)
