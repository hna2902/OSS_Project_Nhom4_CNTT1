from rest_framework import serializers

class TaiKhoanSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class QLMonHocSerializer(serializers.Serializer):
    ten_mon_hoc = serializers.CharField()
    ma_mon_hoc = serializers.CharField()
    so_tin_chi = serializers.IntegerField()

class QLKetQuaHocSerializer(serializers.Serializer):
    ma_sinh_vien = serializers.CharField()
    ma_mon_hoc = serializers.CharField()
    diem = serializers.FloatField()

class ViecCanLamSerializer(serializers.Serializer):
    ten_cong_viec = serializers.CharField()
    ngay_deadline = serializers.DateField()
    trang_thai = serializers.CharField()

class ThongTinNguoiDungSerializer(serializers.Serializer):
    ho_ten = serializers.CharField()
    ngay_sinh = serializers.DateField()
    dia_chi = serializers.CharField()

class ThoiKhoaBieuSerializer(serializers.Serializer):
    ma_sinh_vien = serializers.CharField()
    danh_sach_mon_hoc = serializers.ListField(child=serializers.CharField())

class QLTinChiSerializer(serializers.Serializer):
    ma_mon_hoc = serializers.CharField()
    so_tin_chi = serializers.IntegerField()
