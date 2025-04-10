from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Import từng view theo đúng file chứa nó
from StudyManager.views.qlkq_views import index as ketqua_index
from StudyManager.views.qlmh_views import index as monhoc_index
from StudyManager.views.tk_views import index as taikhoan_index
from StudyManager.views.tkb_views import index as thoikhoabieu_index
from StudyManager.views.ttnd_views import index as thongtinnguoidung_index
from StudyManager.views.qltc_views import index as tinchi_index
from StudyManager.views.vcl_views import index as vieccanlam_index
from StudyManager.views.authentication_views import login_view, register, logout_view

# Import API ViewSet
from StudyManager.views.authentication_api_views import TaiKhoanViewSet
from StudyManager.views.qlmh_api_views import QLMonHocViewSet
from StudyManager.views.qlkq_api_views import QLKetQuaHocViewSet
from StudyManager.views.vcl_api_views import ViecCanLamViewSet
from StudyManager.views.ttnd_api_views import ThongTinNguoiDungViewSet
from StudyManager.views.tkb_api_views import ThoiKhoaBieuViewSet
from StudyManager.views.qltc_api_views import QLTinChiViewSet
from StudyManager.views.tk_api_views import TaiKhoanDisplayViewSet

# API Views đơn lẻ
from StudyManager.views.home_views import home

# 🔹 Router cho ViewSet API
router = DefaultRouter()
router.register(r'taikhoan', TaiKhoanDisplayViewSet, basename='taikhoan')  # Hiển thị tài khoản
router.register(r'monhoc', QLMonHocViewSet, basename='monhoc')
router.register(r'ketqua', QLKetQuaHocViewSet, basename='ketqua')
router.register(r'vieccanlam', ViecCanLamViewSet, basename='vieccanlam')
router.register(r'thongtinnguoidung', ThongTinNguoiDungViewSet, basename='thongtinnguoidung')
router.register(r'thoikhoabieu', ThoiKhoaBieuViewSet, basename='thoikhoabieu')
router.register(r'tinchi', QLTinChiViewSet, basename='tinchi')

# 🔹 URL Patterns
urlpatterns = [
    # --- Trang HTML ---
    path('', home, name='trangchu'),
    path('ketqua/', ketqua_index, name='ketqua'),
    path('monhoc/', monhoc_index, name='monhoc'),
    path('taikhoan/', taikhoan_index, name='taikhoan'),
    path('thoikhoabieu/', thoikhoabieu_index, name='thoikhoabieu'),
    path('thongtinnguoidung/', thongtinnguoidung_index, name='thongtinnguoidung'),
    path('tinchi/', tinchi_index, name='tinchi'),
    path('vieccanlam/', vieccanlam_index, name='vieccanlam'),
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),

    # --- Django Admin ---
    path('admin/', admin.site.urls),

    # --- API ---
    path('api/', include(router.urls)),
]
