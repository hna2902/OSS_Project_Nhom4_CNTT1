from .database import db

def get_next_id(counter_name, prefix, length=3):

    # Hàm tạo ID tự động dựa vào counter_name.
    
    # - `counter_name`: Tên của counter trong collection `counters`
    # - `prefix`: Tiền tố của ID (ví dụ: 'MH' cho môn học, 'KQ' cho kết quả học tập)
    # - `length`: Độ dài của số thứ tự, mặc định là 3 (ví dụ: 001, 002, ...)
    
    result = db["QLHT"].find_one_and_update(
        {"_id": counter_name},
        {"$inc": {"sequence_value": 1}},
        return_document=True
    )
    new_id = result["sequence_value"]
    return f"{prefix}{new_id:0{length}d}"  # Ví dụ: MH001, KQ002
print("Đang chạy counter.py")

