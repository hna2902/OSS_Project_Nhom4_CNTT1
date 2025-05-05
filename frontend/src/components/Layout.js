// src/components/Layout.js
import React, { useContext, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { UserContext } from '../contexts/UserContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Đưa state sidebarOpen vào Layout
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle trạng thái sidebar
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout/', {}, {
        withCredentials: true,
      });

      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="layout-wrapper d-flex">
      {/* Truyền sidebarOpen và toggleSidebar cho Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="main-content">
        <Header currentUser={user} onLogout={handleLogout} toggleSidebar={toggleSidebar} />
        <div className="content-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
