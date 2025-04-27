import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [taiKhoan, setTaiKhoan] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        tai_khoan: taiKhoan,
        mat_khau: matKhau,
      }, {
        withCredentials: true,  // <<< Thêm dòng này để gửi & nhận cookie
      });

      if (response.status === 200) {
        // Không cần lưu user vào localStorage nữa nếu bạn dùng cookie
        // Nếu muốn lưu lại user info cho tiện thì vẫn có thể
        localStorage.setItem('user', JSON.stringify(response.data.user_info));

        navigate('/');  // Điều hướng về trang chủ sau khi đăng nhập thành công
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Tài khoản hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tài khoản</label>
          <input
            type="text"
            value={taiKhoan}
            onChange={(e) => setTaiKhoan(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mật khẩu</label>
          <input
            type="password"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
