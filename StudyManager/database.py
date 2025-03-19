from pymongo import MongoClient

# Kết nối tới MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["QLHT"]  # Thay "study_management" bằng tên database của bạn
