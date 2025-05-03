import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios'; // Dùng axios cấu hình sẵn
import { UserContext } from '../contexts/UserContext';

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // 👉 Thêm dòng này

  useEffect(() => {
    const logout = async () => {
      try {
        // Gọi API backend để xóa session
        await axios.post('/api/logout/', {}); // Không cần localhost ở đây

        // Xóa localStorage + context
        localStorage.removeItem('user');
        setUser(null); // 👉 Cập nhật context

        // Chuyển hướng về login
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    logout();
  }, [navigate, setUser]);

  return (
    <div className="logout-container">
      <h2>Đang đăng xuất...</h2>
    </div>
  );
};

export default Logout;
