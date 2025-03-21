from .database import db

db["TaiKhoan"].delete_one({"TaiKhoan": "admin"})
