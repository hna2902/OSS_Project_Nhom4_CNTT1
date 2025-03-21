from django.contrib.auth.hashers import make_password, check_password
from .database import db  # Import kết nối MongoDB

class TaiKhoan:
    """ Quản lý tài khoản người dùng """
    collection = db["TaiKhoan"]

    @staticmethod
    def insert(tai_khoan, email, mat_khau, quyen="User"):
        """ Thêm tài khoản mới với mật khẩu đã hash """
        TaiKhoan.collection.insert_one({
            "TaiKhoan": tai_khoan,
            "Email": email,
            "MatKhauHash": make_password(mat_khau),  # Hash mật khẩu
            "Quyen": quyen  # "Admin" hoặc "User"
        })

    @staticmethod
    def get_by_tai_khoan(tai_khoan):
        """ Lấy thông tin tài khoản theo username """
        return TaiKhoan.collection.find_one({"TaiKhoan": tai_khoan})

    @staticmethod
    def check_password(tai_khoan, mat_khau):
        """ Kiểm tra mật khẩu nhập vào có đúng không """
        user = TaiKhoan.get_by_tai_khoan(tai_khoan)
        if user:
            return check_password(mat_khau, user["MatKhauHash"])
        return False

    @staticmethod
    def update_mat_khau(tai_khoan, new_password):
        """ Cập nhật mật khẩu mới (có hash) """
        TaiKhoan.collection.update_one(
            {"TaiKhoan": tai_khoan},
            {"$set": {"MatKhauHash": make_password(new_password)}}
        )

    @staticmethod
    def delete(tai_khoan):
        """ Xóa tài khoản """
        TaiKhoan.collection.delete_one({"TaiKhoan": tai_khoan})



class QLMonHoc:
    """ Quản lý môn học """
    collection = db["QLMonHoc"]

    @staticmethod
    def insert(ma_nguoi_dung, id_mon_hoc, ma_mon, ten_mon, thoi_gian_bat_dau, thoi_gian_ket_thuc, giang_vien):
        QLMonHoc.collection.insert_one({
            "MaNguoiDung": ma_nguoi_dung,
            "IDMonHoc": id_mon_hoc,
            "MaMon": ma_mon,
            "TenMon": ten_mon,
            "ThoiGianBatDau": thoi_gian_bat_dau,
            "ThoiGianKetThuc": thoi_gian_ket_thuc,
            "GiangVien": giang_vien
        })

    @staticmethod
    def get_by_id(id_mon_hoc):
        return QLMonHoc.collection.find_one({"IDMonHoc": id_mon_hoc})


class QLKetQuaHoc:
    """ Quản lý kết quả học tập """
    collection = db["QLKetQuaHoc"]

    @staticmethod
    def insert(ma_nguoi_dung, ma_ket_qua_hoc, ma_mon, ten_mon, diem_he_10, diem_he_4):
        QLKetQuaHoc.collection.insert_one({
            "MaNguoiDung": ma_nguoi_dung,
            "MaKetQuaHoc": ma_ket_qua_hoc,
            "MaMon": ma_mon,
            "TenMon": ten_mon,
            "DiemHe10": diem_he_10,
            "DiemHe4": diem_he_4
        })


class ViecCanLam:
    """ Quản lý việc cần làm """
    collection = db["ViecCanLam"]

    @staticmethod
    def insert(ma_nguoi_dung, ma_vcl, nhac_nho, ghi_chu, thoi_han, ten_mon):
        ViecCanLam.collection.insert_one({
            "MaNguoiDung": ma_nguoi_dung,
            "MaVCL": ma_vcl,
            "NhacNho": nhac_nho,
            "GhiChu": ghi_chu,
            "ThoiHan": thoi_han,
            "TenMon": ten_mon
        })


class ThongTinNguoiDung:
    """ Quản lý thông tin người dùng """
    collection = db["ThongTinNguoiDung"]

    @staticmethod
    def insert(ma_nguoi_dung, tai_khoan, mat_khau, ten, email, sdt):
        ThongTinNguoiDung.collection.insert_one({
            "MaNguoiDung": ma_nguoi_dung,
            "TaiKhoan": tai_khoan,
            "MatKhau": mat_khau,
            "Ten": ten,
            "Email": email,
            "SDT": sdt
        })


class ThoiKhoaBieu:
    """ Quản lý thời khóa biểu """
    collection = db["ThoiKhoaBieu"]

    @staticmethod
    def insert(ma_nguoi_dung, ma_tkb, mon_hoc, thu, thoi_gian_hoc):
        ThoiKhoaBieu.collection.insert_one({
            "MaNguoiDung": ma_nguoi_dung,
            "MaTKB": ma_tkb,
            "MonHoc": mon_hoc,
            "Thu": thu,
            "ThoiGianHoc": thoi_gian_hoc
        })


class QLTinChi:
    """ Quản lý tín chỉ """
    collection = db["QLTinChi"]

    @staticmethod
    def insert(ma_nguoi_dung, id_tin_chi, ma_mon, so_chi_da_dat, so_chi_no, tong_tin_chi):
        QLTinChi.collection.insert_one({
            "MaNguoiDung": ma_nguoi_dung,
            "IDTinChi": id_tin_chi,
            "MaMon": ma_mon,
            "SoChiDaDat": so_chi_da_dat,
            "SoChiNo": so_chi_no,
            "TongTinChi": tong_tin_chi
        })
