from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from StudyManager.database import db
from StudyManager.counter import get_next_id

class ThoiKhoaBieuViewSet(viewsets.ViewSet):

    # Lấy danh sách thời khóa biểu của người dùng
    def list(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response([], status=200)
        data = list(db.ThoiKhoaBieu.find({"MaNguoiDung": user_id}, {"_id": 0}))
        return Response(data)

    # Thêm mới thời khóa biểu
    def create(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        thu = request.data.get("Thu")
        mon = request.data.get("MonHoc")
        time = request.data.get("ThoiGianHoc")

        if not thu or not mon or not time:
            return Response({"error": "Thiếu dữ liệu!"}, status=400)

        tkb_existing = db.ThoiKhoaBieu.find_one({"MaNguoiDung": user_id})
        ma_tkb = get_next_id("MATKB", "MATKB") if not tkb_existing else tkb_existing.get("MaTKB")
        id_tkb = get_next_id("IDTKB", "IDTKB")

        db.ThoiKhoaBieu.insert_one({
            "MaTKB": ma_tkb,
            "IDTKB": id_tkb,
            "Thu": thu,
            "MonHoc": mon,
            "ThoiGianHoc": time,
            "MaNguoiDung": user_id
        })

        return Response({"message": "Đã thêm môn học vào thời khóa biểu!"})

    
   
    # Xóa một môn học khỏi thời khóa biểu theo IDTKB
    def destroy(self, request, pk=None):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        result = db.ThoiKhoaBieu.delete_one({
            "IDTKB": pk,
            "MaNguoiDung": user_id
        })

        if result.deleted_count == 0:
            return Response({"error": "Không tìm thấy môn học hoặc không có quyền xóa."}, status=404)

        return Response({"message": "Môn học đã được xóa khỏi thời khóa biểu!"})


    # Cập nhật môn học theo IDTKB
    def update(self, request, pk=None):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        thu = request.data.get("Thu")
        mon = request.data.get("MonHoc")
        time = request.data.get("ThoiGianHoc")

        if not thu or not mon or not time:
            return Response({"error": "Thiếu dữ liệu!"}, status=400)

        result = db.ThoiKhoaBieu.update_one(
            {"IDTKB": pk, "MaNguoiDung": user_id},
            {"$set": {"Thu": thu, "MonHoc": mon, "ThoiGianHoc": time}}
        )

        if result.matched_count == 0:
            return Response({"error": "Không tìm thấy môn học hoặc không có quyền sửa."}, status=404)

        return Response({"message": "Môn học đã được cập nhật!"})


        
    @action(detail=False, methods=['delete'], url_path='delete_all')
    def delete_all_schedule(self, request):
        user_id = request.session.get("user_id")
        if not user_id:
            return Response({"error": "Bạn chưa đăng nhập!"}, status=401)

        result = db.ThoiKhoaBieu.delete_many({"MaNguoiDung": user_id})
        return Response({"message": f"Đã xóa {result.deleted_count} dòng thời khóa biểu."})