from django.shortcuts import render, redirect
from StudyManager.database import db
import requests

def index(request):
    # Lấy user_id từ session
    user_id = request.session.get("user_id")
    if not user_id:
        return redirect("login")  # hoặc xử lý phù hợp nếu chưa đăng nhập

    # Xử lý khi có POST (thêm, xóa, sửa)
    if request.method == "POST":
        action = request.POST.get("action")

        if action == "add":
            data = {
                "MaMonHoc": request.POST.get("MaMonHoc"),
                "DiemGiuaKy": request.POST.get("DiemGiuaKy"),
                "DiemCuoiKy": request.POST.get("DiemCuoiKy"),
            }
            requests.post("http://localhost:8000/api/ketqua/", data=data, cookies=request.COOKIES)

        elif action == "delete":
            makqh = request.POST.get("MaKetQuaHoc")
            requests.delete(f"http://localhost:8000/api/ketqua/{makqh}/", cookies=request.COOKIES)

        elif action == "edit":
            makqh = request.POST.get("MaKetQuaHoc")
            data = {
                "MaMonHoc": request.POST.get("MaMonHoc"),
                "DiemGiuaKy": request.POST.get("DiemGiuaKy"),
                "DiemCuoiKy": request.POST.get("DiemCuoiKy"),
            }
            requests.put(f"http://localhost:8000/api/ketqua/{makqh}/", data=data, cookies=request.COOKIES)

        return redirect("ketqua")  # load lại trang sau khi xử lý

    # GET: lấy danh sách kết quả học
    response = requests.get("http://localhost:8000/api/ketqua/", cookies=request.COOKIES)
    ketquas = response.json() if response.status_code == 200 else []

    # Lấy danh sách môn học cho dropdown
    mon_response = requests.get("http://localhost:8000/api/monhoc/", cookies=request.COOKIES)
    monhocs = mon_response.json() if mon_response.status_code == 200 else []

    return render(request, 'QLKQ/index.html', {
        'ketquas': ketquas,
        'monhocs': monhocs,
    })
