import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import axios from '../utils/axios';

const Header = () => {
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
    <header className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="text-primary">Quản Lý Học Tập</h2>
      <div className="d-flex align-items-center">
        {user ? (
          <>
            <img
              src={user.Avatar ? `${user.Avatar.startsWith('http') ? '' : 'http://localhost:8000'}${user.Avatar}` : '/static/img/default_avatar.png'}
              alt="Avatar"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <span className="me-2">{user.Ten}</span>
            <button className="btn btn-link" onClick={handleLogout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link className="btn btn-link" to="/login">Đăng nhập</Link>
            <Link className="btn btn-link ms-2" to="/register">Đăng ký</Link> {/* ✅ Thêm link đăng ký */}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
