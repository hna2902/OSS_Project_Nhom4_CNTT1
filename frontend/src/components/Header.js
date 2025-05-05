import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import axios from '../utils/axios';

const Header = ({ toggleSidebar }) => {
  const { user, setUser, loadingUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout/', {}, { withCredentials: true });
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Lỗi đăng xuất:', err);
    }
  };

  if (loadingUser) return null;

  return (
    <header className="d-flex justify-content-between align-items-center px-3 py-2 header-custom">
      {/* Nút toggle hiển thị trên mobile */}
      <button
        className="btn btn-outline-light d-md-none me-2"
        onClick={toggleSidebar}
      >
        <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
      </button>

      <h2 className="mb-0 text-white">Quản Lý Học Tập</h2>

      <div className="d-flex align-items-center text-white">
        {user ? (
          <>
            <img
              src={
                user.Avatar
                  ? `${user.Avatar.startsWith('http') ? '' : 'http://localhost:8000'}${user.Avatar}`
                  : '/static/img/default_avatar.png'
              }
              alt="Avatar"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <span className="me-2">{user.Ten}</span>
            <button className="btn btn-link text-white text-decoration-none" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i> Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-link text-white text-decoration-none" to="/login">
              <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
            </Link>
            <Link className="btn btn-link text-white text-decoration-none ms-2" to="/register">
              <i className="bi bi-person-plus me-1"></i> Đăng ký
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
