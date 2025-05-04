import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import styles from './Auth.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tai_khoan: '',
    mat_khau: '',
    ten: '',
    sdt: '',
    quyen: 'User',
    avatar: 'static/img/default_avatar.png'
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/register/', formData);
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi khi đăng ký');
    } finally {
      setLoading(false);
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

        <form className={styles.authForm} onSubmit={handleRegister}>
          <h2 className={styles.formTitle}>Đăng ký tài khoản</h2>
          
          {error && <p className={styles.errorText}>{error}</p>}
          
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="reg_tai_khoan">Tài khoản</label>
            <input
              type="text"
              id="reg_tai_khoan"
              name="tai_khoan"
              className={styles.formInput}
              value={formData.tai_khoan}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="reg_mat_khau">Mật khẩu</label>
            <input
              type="password"
              id="reg_mat_khau"
              name="mat_khau"
              className={styles.formInput}
              value={formData.mat_khau}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="reg_ten">Tên</label>
            <input
              type="text"
              id="reg_ten"
              name="ten"
              className={styles.formInput}
              value={formData.ten}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="reg_sdt">Số điện thoại</label>
            <input
              type="tel"
              id="reg_sdt"
              name="sdt"
              className={styles.formInput}
              value={formData.sdt}
              onChange={handleInputChange}
              required
              pattern="^0\d{9}$"
              title="Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0"
            />
          </div>

          <div className={styles.inputGroup}>
            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
            <div className={styles.linkContainer}>
              <a href="/login" className={styles.authLink}>Đã có tài khoản? Đăng nhập</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;