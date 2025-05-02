// src/components/Layout.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';    // 🔥 Thêm axios để gọi API
import './Layout.css';

const Layout = ({ currentUser: propUser, children }) => {
  const [currentUser, setCurrentUser] = useState(propUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!propUser) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, [propUser]);

  // 🔥 Hàm đăng xuất đầy đủ: gọi API + xóa localStorage + điều hướng
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout/', {}, {
        withCredentials: true, // Bắt buộc để gửi session cookie qua
      });
      

      // Xóa thông tin user local
      localStorage.removeItem('user');
      setCurrentUser(null);

      // Chuyển hướng về trang đăng nhập
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {/* Header */}
        <Header currentUser={currentUser} onLogout={handleLogout} />

        {/* Nội dung chính */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
