// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Gọi API logout backend
      await axios.post('/api/logout/', {}, { withCredentials: true }); // Cần withCredentials để gửi session cookie

      // Xóa user ở frontend
      onLogout();

      // Điều hướng về trang đăng nhập
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="text-primary">Quản Lý Học Tập</h2>
      <div className="d-flex align-items-center">
        {currentUser ? (
          <>
            <img
              src={currentUser.Avatar || '/default_avatar.png'}
              alt="Avatar"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <span className="me-2">{currentUser.Ten}</span>
            <button className="btn btn-link" onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          <Link className="btn btn-link" to="/login">Đăng nhập</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
