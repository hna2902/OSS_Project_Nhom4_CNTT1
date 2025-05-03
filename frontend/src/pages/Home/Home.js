import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import { UserContext } from '../../contexts/UserContext'; // Import UserContext

const Home = () => {
  // Lấy thông tin người dùng từ context
  const { user } = useContext(UserContext);

  return (
    <Layout currentUser={user}>
      <p className="text-muted">Chào mừng đến với hệ thống Quản Lý Học Tập.</p>
    </Layout>
  );
};

export default Home;
