# StudyManager/context_processors.py
from StudyManager.database import db

def current_user(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return {}
    # Lấy thông tin user, ẩn MatKhauHash
    user = db.TaiKhoan.find_one({"_id": user_id}, {"MatKhauHash": 0})
    return {'current_user': user}
