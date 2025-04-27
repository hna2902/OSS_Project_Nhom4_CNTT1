// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/user', { withCredentials: true })
      .then(response => {
        setUser(response.data); // Cập nhật state với thông tin người dùng
      })
      .catch(error => {
        console.error("Có lỗi xảy ra khi lấy thông tin người dùng:", error);
      });
  }, []);

  return (
    <Layout currentUser={user}>
      <p className="text-muted">Chào mừng đến với hệ thống Quản Lý Học Tập.</p>
    </Layout>
  );
};

export default Home;
