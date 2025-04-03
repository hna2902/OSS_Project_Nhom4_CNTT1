from .database import db

def get_next_id(counter_name, prefix, length=3):
    # Hàm tạo ID tự động, kiểm tra trùng lặp trước khi trả về giá trị
    
    while True:
        result = db["counters"].find_one_and_update(
            {"_id": counter_name},
            {"$inc": {"sequence_value": 1}},
            return_document=True,
            upsert=True  # Thêm upsert để tạo mới nếu không tồn tại
        )

        if result:
            new_id = f"{prefix}{result['sequence_value']:0{length}d}"
            
            # Kiểm tra xem ID đã tồn tại trong collection TaiKhoan chưa
            if db["TaiKhoan"].find_one({"_id": new_id}) is None:
                return new_id  # Trả về ID nếu chưa trùng
