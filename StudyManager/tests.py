import sys
import os

# Thêm thư mục gốc của dự án vào sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Import lại module
from StudyManager.models import TaiKhoan


from .database import db
for user in db["TaiKhoan"].find({"userID": {"$exists": False}}):
    new_user_id = TaiKhoan.get_next_user_id()
    db["TaiKhoan"].update_one(
        {"_id": user["_id"]},
        {"$set": {"userID": new_user_id}}
    )
