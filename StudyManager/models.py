from django.contrib.auth.hashers import make_password, check_password
from .database import db  

class TaiKhoan:
    """ Quản lý tài khoản người dùng """
    collection = db["TaiKhoan"]
    counter_collection = db["counters"]

    @staticmethod
    def get_next_user_id():
        # Tăng giá trị bộ đếm và lấy giá trị mới
        result = TaiKhoan.counter_collection.find_one_and_update(
            {"_id": "userID"},
            {"$inc": {"sequence_value": 1}},
            return_document=True
        )
        new_id = result["sequence_value"]
        return f"UID{new_id:03d}"  # Format UID01, UID02, ...

    @staticmethod
    def insert(tai_khoan, email, mat_khau_hash, quyen):
        new_user_id = TaiKhoan.get_next_user_id()  # Lấy ID mới
        TaiKhoan.collection.insert_one({
            "userID": new_user_id,
            "TaiKhoan": tai_khoan,
            "Email": email,
            "MatKhauHash": mat_khau_hash,
            "Quyen": quyen
        })




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
