import re
from django.contrib.auth.hashers import make_password, check_password

from StudyManager.counter import get_next_id
from .database import db  

class TaiKhoan:
    # Quản lý tài khoản người dùng
    collection = db["TaiKhoan"]

    @staticmethod
    def get_next_course_id():
        return get_next_id("UID", "UID")

    @staticmethod
    def insert(user_id, tai_khoan, email, mat_khau, quyen, ten, sdt):
        # Kiểm tra tài khoản hoặc email đã tồn tại chưa
        if TaiKhoan.collection.find_one({"$or": [{"TaiKhoan": tai_khoan}, {"Email": email}]}):
            raise ValueError("Tài khoản hoặc email đã tồn tại!")

        # Hash mật khẩu trước khi lưu
        mat_khau_hash = make_password(mat_khau)

        TaiKhoan.collection.insert_one({
            "_id": user_id,  # ID do counter script cấp
            "TaiKhoan": tai_khoan,
            "Email": email,
            "MatKhauHash": mat_khau_hash,
            "Quyen": quyen,
            "Ten": ten,
            "SDT": sdt
        })

    @staticmethod
    def get_user_info(user_id):
        # Lấy thông tin người dùng, ẩn mật khẩu
        return TaiKhoan.collection.find_one({"_id": user_id}, {"MatKhauHash": 0})

    @staticmethod
    def authenticate(tai_khoan, mat_khau):
        # Xác thực đăng nhập
        user = TaiKhoan.collection.find_one({"TaiKhoan": tai_khoan})
        if user and check_password(mat_khau, user["MatKhauHash"]):
            return user  # Trả về thông tin tài khoản nếu đúng mật khẩu
        return None  # Sai tài khoản hoặc mật khẩu

    @staticmethod
    def update_user_info(user_id, ten=None, sdt=None):
        # Cập nhật thông tin cá nhân (tên, số điện thoại)
        update_data = {}
        if ten:
            update_data["Ten"] = ten
        if sdt:
            update_data["SDT"] = sdt

        if update_data:
            TaiKhoan.collection.update_one({"_id": user_id}, {"$set": update_data})


class QLMonHoc:
    collection = db["QLMonHoc"]

    @staticmethod
    def get_next_course_id():
        return get_next_id("monhocID", "MH")

    @staticmethod
    def insert(user_id, ten_mon, so_tin_chi, thoi_gian_bat_dau, thoi_gian_ket_thuc, giang_vien):
        # Kiểm tra tên môn học đã tồn tại chưa (cùng user_id)
        if QLMonHoc.collection.find_one({"MaNguoiDung": user_id, "TenMon": ten_mon}):
            raise ValueError(f"Môn học '{ten_mon}' đã tồn tại!")

        # Kiểm tra thời gian hợp lệ
        if thoi_gian_bat_dau >= thoi_gian_ket_thuc:
            raise ValueError("Thời gian bắt đầu phải trước thời gian kết thúc!")

        # Tạo ID mới
        new_course_id = QLMonHoc.get_next_course_id()

        QLMonHoc.collection.insert_one({
            "_id": new_course_id,
            "MaNguoiDung": user_id,
            "TenMon": ten_mon,
            "SoTinChi": so_tin_chi,
            "ThoiGianBatDau": thoi_gian_bat_dau,
            "ThoiGianKetThuc": thoi_gian_ket_thuc,
            "GiangVien": giang_vien
        })

    @staticmethod
    def get_by_id(course_id):
        # Tìm môn học theo ID
        return QLMonHoc.collection.find_one({"_id": course_id})

    @staticmethod
    def get_all_courses(user_id):
        # Lấy danh sách môn học của người dùng (chỉ lấy _id và tên môn)
        return list(QLMonHoc.collection.find({"MaNguoiDung": user_id}, {"_id": 1, "TenMon": 1}))

    @staticmethod
    def update(course_id, ten_mon=None, so_tin_chi=None, thoi_gian_bat_dau=None, thoi_gian_ket_thuc=None, giang_vien=None):
        update_data = {}
        if ten_mon:
            update_data["TenMon"] = ten_mon
        if so_tin_chi is not None:
            update_data["SoTinChi"] = so_tin_chi
        if thoi_gian_bat_dau and thoi_gian_ket_thuc:
            if thoi_gian_bat_dau >= thoi_gian_ket_thuc:
                raise ValueError("Thời gian bắt đầu phải trước thời gian kết thúc!")
            update_data["ThoiGianBatDau"] = thoi_gian_bat_dau
            update_data["ThoiGianKetThuc"] = thoi_gian_ket_thuc
        if giang_vien:
            update_data["GiangVien"] = giang_vien

        if update_data:
            QLMonHoc.collection.update_one({"_id": course_id}, {"$set": update_data})

    @staticmethod
    def delete(course_id):
        # Xóa môn học theo ID
        QLMonHoc.collection.delete_one({"_id": course_id})


class QLKetQuaHoc:
    # Quản lý kết quả học tập
    collection = db["QLKetQuaHoc"]

    @staticmethod
    def get_next_course_id():
        return get_next_id("ketquaID", "KQ")

    @staticmethod
    def insert(user_id, ma_mon, diem_he_10, diem_he_4):
        #Thêm kết quả học tập mới

        # Kiểm tra điểm hợp lệ
        if not (0 <= diem_he_10 <= 10):
            raise ValueError("Điểm hệ 10 phải nằm trong khoảng 0 - 10!")
        if not (0 <= diem_he_4 <= 4):
            raise ValueError("Điểm hệ 4 phải nằm trong khoảng 0 - 4!")

        # Kiểm tra đã có kết quả của môn này chưa (1 môn chỉ có 1 kết quả)
        if QLKetQuaHoc.collection.find_one({"MaNguoiDung": user_id, "MaMon": ma_mon}):
            raise ValueError(f"Kết quả của môn '{ma_mon}' đã tồn tại!")

        new_result_id = QLKetQuaHoc.get_next_result_id()

        QLKetQuaHoc.collection.insert_one({
            "_id": new_result_id,  # ID tự động
            "MaNguoiDung": user_id,  # Người dùng đang đăng nhập
            "MaMon": ma_mon,  # Môn học đã chọn
            "DiemHe10": diem_he_10,
            "DiemHe4": diem_he_4
        })

    @staticmethod
    def get_by_user(user_id):
        #Lấy danh sách kết quả học tập của người dùng
        return list(QLKetQuaHoc.collection.find({"MaNguoiDung": user_id}))

    @staticmethod
    def update(result_id, diem_he_10=None, diem_he_4=None):
        #Cập nhật điểm số
        update_data = {}

        if diem_he_10 is not None:
            if not (0 <= diem_he_10 <= 10):
                raise ValueError("Điểm hệ 10 phải nằm trong khoảng 0 - 10!")
            update_data["DiemHe10"] = diem_he_10

        if diem_he_4 is not None:
            if not (0 <= diem_he_4 <= 4):
                raise ValueError("Điểm hệ 4 phải nằm trong khoảng 0 - 4!")
            update_data["DiemHe4"] = diem_he_4

        if update_data:
            QLKetQuaHoc.collection.update_one({"_id": result_id}, {"$set": update_data})

    @staticmethod
    def delete(result_id):
        #Xóa kết quả học tập
        QLKetQuaHoc.collection.delete_one({"_id": result_id})





class ViecCanLam:
    # Quản lý việc cần làm
    collection = db["ViecCanLam"]

    @staticmethod
    def get_next_course_id():
        return get_next_id("vieccanlamID", "VCL")

    @staticmethod
    def insert(user_id, nhac_nho, ghi_chu, thoi_han, ma_mon):
        # Thêm việc cần làm mới
        new_task_id = ViecCanLam.get_next_task_id()  # Tạo ID mới

        # Kiểm tra nếu `thoi_han` có định dạng hợp lệ (YYYY-MM-DD)
        if thoi_han and not re.match(r"\d{4}-\d{2}-\d{2}", thoi_han):
            raise ValueError("Thời hạn không hợp lệ! Định dạng phải là YYYY-MM-DD.")

        ViecCanLam.collection.insert_one({
            "_id": new_task_id,  # ID tự động
            "MaNguoiDung": user_id,  # Người dùng đang đăng nhập
            "NhacNho": nhac_nho,
            "GhiChu": ghi_chu,
            "ThoiHan": thoi_han,
            "MaMon": ma_mon  # Lưu theo mã môn học
        })

    @staticmethod
    def get_by_user(user_id):
        # Lấy danh sách việc cần làm của người dùng
        return list(ViecCanLam.collection.find({"MaNguoiDung": user_id}))

    @staticmethod
    def update(task_id, nhac_nho=None, ghi_chu=None, thoi_han=None, ma_mon=None):
        # Cập nhật thông tin việc cần làm
        update_data = {}

        if nhac_nho is not None:
            update_data["NhacNho"] = nhac_nho

        if ghi_chu is not None:
            update_data["GhiChu"] = ghi_chu

        if thoi_han is not None:
            if not re.match(r"\d{4}-\d{2}-\d{2}", thoi_han):
                raise ValueError("Thời hạn không hợp lệ! Định dạng phải là YYYY-MM-DD.")
            update_data["ThoiHan"] = thoi_han

        if ma_mon is not None:
            update_data["MaMon"] = ma_mon

        if update_data:
            ViecCanLam.collection.update_one({"_id": task_id}, {"$set": update_data})

    @staticmethod
    def delete(task_id):
        # Xóa việc cần làm
        ViecCanLam.collection.delete_one({"_id": task_id})



import re

class ThoiKhoaBieu:
    # Quản lý thời khóa biểu
    collection = db["ThoiKhoaBieu"]

    @staticmethod
    def get_next_course_id():
        return get_next_id("thoikhoabieuID", "TKB")

    @staticmethod
    def insert(user_id, ma_mon, thu, thoi_gian_hoc):
        """Thêm thời khóa biểu mới"""
        new_tkb_id = ThoiKhoaBieu.get_next_tkb_id()  # Tạo ID mới

        # Kiểm tra thứ hợp lệ (2 - 8, tương ứng Thứ Hai - Chủ Nhật)
        if thu not in range(2, 9):
            raise ValueError("Thứ không hợp lệ! Phải từ 2 (Thứ Hai) đến 8 (Chủ Nhật).")

        # Kiểm tra định dạng thời gian học (HH:MM)
        if not re.match(r"^\d{2}:\d{2}$", thoi_gian_hoc):
            raise ValueError("Thời gian học không hợp lệ! Định dạng phải là HH:MM.")

        ThoiKhoaBieu.collection.insert_one({
            "_id": new_tkb_id,  # ID tự động theo format TKBID
            "MaNguoiDung": user_id,
            "MaMon": ma_mon,  # Lưu theo mã môn học
            "Thu": thu,
            "ThoiGianHoc": thoi_gian_hoc
        })

    @staticmethod
    def get_by_user(user_id):
        """Lấy danh sách thời khóa biểu của người dùng"""
        return list(ThoiKhoaBieu.collection.find({"MaNguoiDung": user_id}))

    @staticmethod
    def update(tkb_id, ma_mon=None, thu=None, thoi_gian_hoc=None):
        """Cập nhật thời khóa biểu"""
        update_data = {}

        if ma_mon is not None:
            update_data["MaMon"] = ma_mon

        if thu is not None:
            if thu not in range(2, 9):
                raise ValueError("Thứ không hợp lệ! Phải từ 2 (Thứ Hai) đến 8 (Chủ Nhật).")
            update_data["Thu"] = thu

        if thoi_gian_hoc is not None:
            if not re.match(r"^\d{2}:\d{2}$", thoi_gian_hoc):
                raise ValueError("Thời gian học không hợp lệ! Định dạng phải là HH:MM.")
            update_data["ThoiGianHoc"] = thoi_gian_hoc

        if update_data:
            ThoiKhoaBieu.collection.update_one({"_id": tkb_id}, {"$set": update_data})

    @staticmethod
    def delete(tkb_id):
        """Xóa thời khóa biểu"""
        ThoiKhoaBieu.collection.delete_one({"_id": tkb_id})



class QLTinChi:
    # Quản lý tín chỉ
    collection = db["QLTinChi"]

    @staticmethod
    def get_next_course_id():
        return get_next_id("tinchiID", "TC")

    @staticmethod
    def insert(user_id, ma_mon, so_chi_da_dat, so_chi_no):
        #Thêm tín chỉ mới vào MongoDB

        # Kiểm tra giá trị hợp lệ
        if so_chi_da_dat < 0 or so_chi_no < 0:
            raise ValueError("Số tín chỉ đã đạt và số tín chỉ nợ phải >= 0!")
        
        tong_tin_chi = so_chi_da_dat + so_chi_no
        if tong_tin_chi < 0:
            raise ValueError("Tổng số tín chỉ không thể âm!")

        new_credit_id = QLTinChi.get_next_credit_id()  # Tạo ID mới

        QLTinChi.collection.insert_one({
            "_id": new_credit_id,  # ID tự động
            "MaNguoiDung": user_id,
            "MaMon": ma_mon,  # Chọn từ dropdown
            "SoChiDaDat": so_chi_da_dat,
            "SoChiNo": so_chi_no,
            "TongTinChi": tong_tin_chi
        })

    @staticmethod
    def get_by_user(user_id):
        #Lấy danh sách tín chỉ của người dùng
        return list(QLTinChi.collection.find({"MaNguoiDung": user_id}))

    @staticmethod
    def update(credit_id, so_chi_da_dat=None, so_chi_no=None):
        #Cập nhật tín chỉ
        update_data = {}

        if so_chi_da_dat is not None:
            if so_chi_da_dat < 0:
                raise ValueError("Số tín chỉ đã đạt phải >= 0!")
            update_data["SoChiDaDat"] = so_chi_da_dat

        if so_chi_no is not None:
            if so_chi_no < 0:
                raise ValueError("Số tín chỉ nợ phải >= 0!")
            update_data["SoChiNo"] = so_chi_no

        if update_data:
            update_data["TongTinChi"] = update_data.get("SoChiDaDat", 0) + update_data.get("SoChiNo", 0)
            QLTinChi.collection.update_one({"_id": credit_id}, {"$set": update_data})

    @staticmethod
    def delete(credit_id):
        #Xóa tín chỉ
        QLTinChi.collection.delete_one({"_id": credit_id})


