@echo off

REM Kích hoạt virtual environment
call Backend\venv\Scripts\activate

echo === Starting Django Server ===
start "" /B cmd /C "cd Backend && python manage.py runserver"

echo === Starting React App ===
start "" /B cmd /C "cd frontend && npm start"

echo ✅ Cả hai server đang chạy nền. Nhấn Ctrl+C để dừng nếu cần.
