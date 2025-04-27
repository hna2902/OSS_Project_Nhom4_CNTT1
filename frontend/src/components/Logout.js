import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Gọi API backend để xóa session
        await axios.post('http://localhost:8000/api/logout/', {}, {
          withCredentials: true, // Gửi cookie để logout đúng session
        });

        // Xóa user ở localStorage
        localStorage.removeItem('user');

        // Chuyển hướng về trang đăng nhập
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="logout-container">
      <h2>Đang đăng xuất...</h2>
    </div>
  );
};

export default Logout;
