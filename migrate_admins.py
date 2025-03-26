import os
import django

# Thiết lập biến môi trường để Django biết settings nằm ở đâu
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'OSS_Project.settings')  # Đổi 'OSS_Project' nếu tên khác

# Khởi tạo Django
django.setup()

from django.contrib.auth.models import User
from pymongo import MongoClient
from django.conf import settings

# Kết nối MongoDB
mongo_client = MongoClient(settings.MONGO_CLIENT)
mongo_db = mongo_client[settings.MONGO_DB_NAME]
collection = mongo_db["TaiKhoan"]

# Lấy tất cả tài khoản admin từ Django
admins = User.objects.filter(is_superuser=True)

# Di chuyển admin vào MongoDB
for admin in admins:
    collection.insert_one({
        "TaiKhoan": admin.username,
        "Email": admin.email,
        "MatKhauHash": admin.password,
        "Quyen": "Admin",
    })

print("✔ Dữ liệu admin đã được thêm vào MongoDB.")
