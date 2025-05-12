from rest_framework import viewsets
from rest_framework.response import Response
from StudyManager.database import db
from StudyManager.counter import get_next_id
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd
from django.core.files.storage import FileSystemStorage
from rest_framework.decorators import action
from datetime import datetime
class QLMonHocViewSet(viewsets.ViewSet):
    def list(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response([], status=200)

        data = list(db.QLMonHoc.find({"MaNguoiDung": user_id}, {"_id": 0}))
        return Response(data)


    def create(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        data = request.data
        ten_mon = data.get("TenMon")
        giang_vien = data.get("GiangVien")
        thoi_gian_bat_dau = data.get("ThoiGianBatDau")
        thoi_gian_ket_thuc = data.get("ThoiGianKetThuc")
        hoc_ky = data.get("HocKy")
        nam_hoc = data.get("NamHoc")

        ma_mon = get_next_id("MAMON", "MAMON")

        db.QLMonHoc.insert_one({
            "_id": ma_mon,
            "MaMonHoc": ma_mon,
            "TenMon": ten_mon,
            "GiangVien": giang_vien,
            "ThoiGianBatDau": thoi_gian_bat_dau,
            "ThoiGianKetThuc": thoi_gian_ket_thuc,
            "HocKy": hoc_ky,
            "NamHoc": nam_hoc,
            "MaNguoiDung": user_id,
        })

        return Response({"message": "Thêm môn học thành công!"})



    def update(self, request, pk=None):
        user_id = request.session.get('user_id')
        monhoc = db.QLMonHoc.find_one({"_id": pk, "MaNguoiDung": user_id})
        if not monhoc:
            return Response({"error": "Không tìm thấy môn học hoặc không có quyền sửa."}, status=404)

        data = request.data
        ten_mon = data.get("TenMon")
        thoi_gian_bat_dau = data.get("ThoiGianBatDau")
        thoi_gian_ket_thuc = data.get("ThoiGianKetThuc")
        giang_vien = data.get("GiangVien")
        hoc_ky = data.get("HocKy")
        nam_hoc = data.get("NamHoc")

        update_data = {}
        if ten_mon:
            update_data["TenMon"] = ten_mon
        if giang_vien:
            update_data["GiangVien"] = giang_vien
        if thoi_gian_bat_dau and thoi_gian_ket_thuc:
            if thoi_gian_bat_dau >= thoi_gian_ket_thuc:
                return Response({"error": "Thời gian bắt đầu phải trước thời gian kết thúc!"}, status=400)
            update_data["ThoiGianBatDau"] = thoi_gian_bat_dau
            update_data["ThoiGianKetThuc"] = thoi_gian_ket_thuc
        if hoc_ky:
            update_data["HocKy"] = hoc_ky
        if nam_hoc:
            update_data["NamHoc"] = nam_hoc

        db.QLMonHoc.update_one({"_id": pk, "MaNguoiDung": user_id}, {"$set": update_data})
        return Response({"message": "Môn học đã được cập nhật."})


    def destroy(self, request, pk=None):
        user_id = request.session.get('user_id')
        result = db.QLMonHoc.delete_one({"_id": pk, "MaNguoiDung": user_id})
        if result.deleted_count == 0:
            return Response({"error": "Không tìm thấy hoặc không có quyền xóa."}, status=404)
        return Response({"message": "Môn học đã được xóa."}, status=204)


     

    # Existing methods (list, create, update, destroy)...
    @action(detail=False, methods=['post'], url_path='upload_csv', parser_classes=[MultiPartParser, FormParser])
    def upload_csv(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        file = request.FILES.get("file")
        if not file:
            return Response({"error": "Không tìm thấy file!"}, status=400)

        try:
            if file.name.endswith(".csv"):
                import csv
                sample = file.read(1024).decode('utf-8')
                file.seek(0)
                sniffer = csv.Sniffer()
                dialect = sniffer.sniff(sample)
                sep = dialect.delimiter
                df = pd.read_csv(file, sep=sep)
            elif file.name.endswith(".xlsx"):
                df = pd.read_excel(file)
            else:
                return Response({"error": "Định dạng file không hợp lệ! Chỉ hỗ trợ .csv hoặc .xlsx"}, status=400)

            required_columns = ["TenMon", "GiangVien", "ThoiGianBatDau", "ThoiGianKetThuc", "HocKy", "NamHoc"]
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                return Response({"error": f"Thiếu cột: {', '.join(missing_columns)}"}, status=400)

            def convert_to_iso(date_str):
                try:
                    # Cố gắng parse theo kiểu Việt Nam trước (DD/MM/YYYY)
                    return datetime.strptime(date_str, "%d/%m/%Y").strftime("%Y-%m-%d")
                except ValueError:
                    try:
                        # Nếu không được, thử ISO sẵn (YYYY-MM-DD)
                        datetime.strptime(date_str, "%Y-%m-%d")
                        return date_str  # Đã chuẩn
                    except ValueError:
                        raise ValueError(f"Ngày không đúng định dạng (DD/MM/YYYY hoặc YYYY-MM-DD): {date_str}")

            inserted_count = 0
            errors = []

            for index, row in df.iterrows():
                try:
                    if any(pd.isna(row[col]) for col in required_columns):
                        errors.append(f"Dòng {index+2} có giá trị trống.")
                        continue

                    thoi_gian_bat_dau = convert_to_iso(str(row["ThoiGianBatDau"]).strip())
                    thoi_gian_ket_thuc = convert_to_iso(str(row["ThoiGianKetThuc"]).strip())

                    ma_mon = get_next_id("MAMON", "MAMON")
                    db.QLMonHoc.insert_one({
                        "_id": ma_mon,
                        "MaMonHoc": ma_mon,
                        "TenMon": str(row["TenMon"]).strip(),
                        "GiangVien": str(row["GiangVien"]).strip(),
                        "ThoiGianBatDau": thoi_gian_bat_dau,
                        "ThoiGianKetThuc": thoi_gian_ket_thuc,
                        "HocKy": str(row["HocKy"]).strip(),
                        "NamHoc": str(row["NamHoc"]).strip(),
                        "MaNguoiDung": user_id,
                    })
                    inserted_count += 1

                except Exception as e:
                    errors.append(f"Dòng {index+2}: {str(e)}")

            if errors:
                return Response({
                    "message": f"Đã thêm {inserted_count} môn học.",
                    "errors": errors
                }, status=207)

            return Response({"message": f"Đã thêm thành công {inserted_count} môn học từ file!"})

        except Exception as e:
            return Response({"error": f"Lỗi xử lý file: {str(e)}"}, status=400)

