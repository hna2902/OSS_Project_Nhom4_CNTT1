// src/components/Layout.js
import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios'; // Sử dụng instance axios có cấu hình sẵn
import { UserContext } from '../contexts/UserContext'; // 🔥 Dùng context
import './Layout.css';

const Layout = ({ children }) => {
  const { user, setUser } = useContext(UserContext); // 🔥 Lấy từ context
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout/', {}, {
        withCredentials: true,
      });

      localStorage.removeItem('user');
      setUser(null); // 🔥 Cập nhật lại context
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 p-4">
        <Header currentUser={user} onLogout={handleLogout} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
