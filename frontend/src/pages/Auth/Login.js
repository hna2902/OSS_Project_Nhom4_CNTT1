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
  const [successMessage, setSuccessMessage] = useState('');
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
        setSuccessMessage(response.data.message);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.error);
    }
  };

  return (
    
    <div className={styles.overlay}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Đăng nhập</h2>
        
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="tai_khoan">Tài Khoản</label>
          <input
            type="text"
            id="tai_khoan"
            name="tai_khoan"
            className={styles.formInput}
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
            className={styles.formInput}
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <button type="submit" className={styles.submitButton}>Đăng nhập</button>
          <div className={styles.linkContainer}>
            <center><a href="/register" className={styles.authLink}>Đăng kí tài khoản</a></center>
          </div>
        </div>
        
        {successMessage && <p className={styles.successText}>{successMessage}</p>}
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}

      </form>
    </div>
  );
};

export default Login;