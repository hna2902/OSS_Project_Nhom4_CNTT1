import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import styles from './Auth.module.css';

const Login = () => {
  const [taiKhoan, setTaiKhoan] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        tai_khoan: taiKhoan,
        mat_khau: matKhau,
      }, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.user_info));
        setUser(response.data.user_info);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Tài khoản hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.svgWrapper}>
          <svg className={styles.svgImage} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            {/* SVG code giống như trong HTML */}
          </svg>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>Đăng nhập</h2>
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="tai_khoan">Tài Khoản</label>
            <input
              type="text"
              id="tai_khoan"
              name="tai_khoan"
              className={styles.emailInput}
              maxLength="256"
              value={taiKhoan}
              onChange={(e) => setTaiKhoan(e.target.value)}
              required
            />
            <span className={styles.inputIndicator}></span>
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="mat_khau">Mật khẩu</label>
            <input
              type="password"
              id="mat_khau"
              name="mat_khau"
              className={styles.passwordInput}
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <button type="submit" className={styles.submitButton}>Đăng nhập</button>
            <div className={styles.linkContainer}>
              <a href="/register" className={styles.authLink}>Đăng kí tài khoản</a>
            </div>
          </div>
          
          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;