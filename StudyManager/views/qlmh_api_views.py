from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db
from StudyManager.models import QLMonHoc

class QLMonHocViewSet(viewsets.ViewSet):
    
    def list(self, request):
        user_id = request.user.id  
        monhocs = QLMonHoc.get_all_courses(user_id)
        return Response(monhocs)

    def retrieve(self, request, pk=None):
        monhoc = QLMonHoc.get_by_id(pk)
        if monhoc:
            return Response(monhoc)
        return Response({"error": "Không tìm thấy môn học"}, status=404)

    def create(self, request):
        user_id = request.user.id
        ten_mon = request.data.get("TenMon")
        so_tin_chi = request.data.get("SoTinChi")
        thoi_gian_bat_dau = request.data.get("ThoiGianBatDau")
        thoi_gian_ket_thuc = request.data.get("ThoiGianKetThuc")
        giang_vien = request.data.get("GiangVien")

        if db.QLMonHoc.find_one({"MaNguoiDung": user_id, "TenMon": ten_mon}):
            return Response({"error": f"Môn học '{ten_mon}' đã tồn tại!"}, status=400)

        if thoi_gian_bat_dau >= thoi_gian_ket_thuc:
            return Response({"error": "Thời gian bắt đầu phải trước thời gian kết thúc!"}, status=400)

        new_course_id = QLMonHoc.get_next_course_id()

        db.QLMonHoc.insert_one({
            "_id": new_course_id,
            "MaNguoiDung": user_id,
            "TenMon": ten_mon,
            "SoTinChi": so_tin_chi,
            "ThoiGianBatDau": thoi_gian_bat_dau,
            "ThoiGianKetThuc": thoi_gian_ket_thuc,
            "GiangVien": giang_vien
        })

        return Response({"message": "Môn học đã được tạo thành công."}, status=201)

    def update(self, request, pk=None):
        ten_mon = request.data.get("TenMon")
        so_tin_chi = request.data.get("SoTinChi")
        thoi_gian_bat_dau = request.data.get("ThoiGianBatDau")
        thoi_gian_ket_thuc = request.data.get("ThoiGianKetThuc")
        giang_vien = request.data.get("GiangVien")

        update_data = {}
        if ten_mon:
            update_data["TenMon"] = ten_mon
        if so_tin_chi is not None:
            update_data["SoTinChi"] = so_tin_chi
        if thoi_gian_bat_dau and thoi_gian_ket_thuc:
            if thoi_gian_bat_dau >= thoi_gian_ket_thuc:
                return Response({"error": "Thời gian bắt đầu phải trước thời gian kết thúc!"}, status=400)
            update_data["ThoiGianBatDau"] = thoi_gian_bat_dau
            update_data["ThoiGianKetThuc"] = thoi_gian_ket_thuc
        if giang_vien:
            update_data["GiangVien"] = giang_vien

        if update_data:
            db.QLMonHoc.update_one({"_id": pk}, {"$set": update_data})

        return Response({"message": "Môn học đã được cập nhật."})

    def destroy(self, request, pk=None):
        db.QLMonHoc.delete_one({"_id": pk})
        return Response({"message": "Môn học đã được xóa."}, status=204)
