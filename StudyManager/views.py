# from django.contrib import admin
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import (
#     # Views cho giao diện HTML
#     trangchu_view, ketqua_view, monhoc_view, taikhoan_view, 
#     thoikhoabieu_view, thongtinnguoidung_view, tinchi_view, vieccanlam_view, 

#     # API Views
#     home, get_data_api, create_data_api,
    
#     # ViewSets
#     TaiKhoanViewSet, QLMonHocViewSet, QLKetQuaHocViewSet, ViecCanLamViewSet, 
#     ThongTinNguoiDungViewSet, ThoiKhoaBieuViewSet, QLTinChiViewSet
# )

# # 🔹 Router cho ViewSet API
# router = DefaultRouter()
# router.register(r'taikhoan', TaiKhoanViewSet, basename='taikhoan')
# router.register(r'monhoc', QLMonHocViewSet, basename='monhoc')
# router.register(r'ketqua', QLKetQuaHocViewSet, basename='ketqua')
# router.register(r'vieccanlam', ViecCanLamViewSet, basename='vieccanlam')
# router.register(r'thongtinnguoidung', ThongTinNguoiDungViewSet, basename='thongtinnguoidung')
# router.register(r'thoikhoabieu', ThoiKhoaBieuViewSet, basename='thoikhoabieu')
# router.register(r'tinchi', QLTinChiViewSet, basename='tinchi')

# # 🔹 URL Patterns
# urlpatterns = [
#     # --- Trang HTML ---
#     path('', trangchu_view, name='trangchu'),
#     path('ketqua/', ketqua_view, name='ketqua'),
#     path('monhoc/', monhoc_view, name='monhoc'),
#     path('taikhoan/', taikhoan_view, name='taikhoan'),
#     path('thoikhoabieu/', thoikhoabieu_view, name='thoikhoabieu'),
#     path('thongtinnguoidung/', thongtinnguoidung_view, name='thongtinnguoidung'),
#     path('tinchi/', tinchi_view, name='tinchi'),
#     path('vieccanlam/', vieccanlam_view, name='vieccanlam'),

#     # --- Django Admin ---
#     path('admin/', admin.site.urls),

#     # --- API ---
#     path('api/', include(router.urls)),  # API sử dụng ViewSet
#     path('api/data/<str:collection_name>/get/', get_data_api, name='get_data_api'),
#     path('api/data/<str:collection_name>/create/', create_data_api, name='create_data_api'),
# ]
