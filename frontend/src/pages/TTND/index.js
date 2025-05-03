import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout'; // Đảm bảo import Layout
import axios from '../../utils/axios';
import { UserContext } from '../../contexts/UserContext'; // Import UserContext

const UserInfo = ({ onAvatarUpdate }) => { 
  const { user, setUser, loadingUser } = useContext(UserContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState(null);

  const [formErrors, setFormErrors] = useState({
    SDT: '',
    Email: ''
  });

  if (loadingUser) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  if (!user) {
    return <div className="text-danger">Không tìm thấy thông tin người dùng.</div>;
  }

  const handleEditInfo = async () => {
    if (isEditMode) {
      const phonePattern = /^0\d{9}$/;
      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      let hasError = false;
      let newErrors = {
        SDT: '',
        Email: ''
      };
  
      // Kiểm tra SDT nếu có nhập vào
      if (user.SDT && !phonePattern.test(user.SDT)) {
        newErrors.SDT = 'Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.';
        hasError = true;
      }
  
      // Kiểm tra Email nếu có nhập vào  
      if (user.Email && !emailPattern.test(user.Email)) {
        newErrors.Email = 'Email không hợp lệ. Vui lòng nhập đúng định dạng.';
        hasError = true;
      }
  
      // Cập nhật state errors
      setFormErrors(newErrors);
      
      // Nếu có lỗi thì dừng lại
      if (hasError) {
        return;
      }
  
      // Kiểm tra xem _id có tồn tại trong user không
      if (!user._id) {
        setError("Không tìm thấy ID người dùng.");
        return;
      }
  
      try {
        // Gọi API để cập nhật thông tin người dùng
        const res = await axios.patch(`/api/thongtinnguoidung/${user._id}/update_user_info/`, {
          Ten: user.Ten,
          SDT: user.SDT,
          Email: user.Email,
        });
  
        // Kiểm tra phản hồi từ API PATCH
        if (res.status === 200) {
          // Sau khi cập nhật thành công, lấy lại thông tin người dùng mới nhất từ API
          const updatedUser = await axios.get(`/api/thongtinnguoidung/${user._id}/`);
          setUser(prev => ({
            ...prev,
            ...updatedUser.data
          }));

  
          // Nếu có LocalStorage, xóa nó và lưu lại thông tin mới
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(updatedUser.data));
  
          setIsEditMode(false);
        } else {
          setError("Không thể cập nhật thông tin người dùng.");
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật thông tin:', err);
        setError(err.response?.data?.error || 'Không thể cập nhật thông tin');
      }
    } else {
      setIsEditMode(true);
    }
  };
  
  
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.post(`/api/thongtinnguoidung/${user._id}/upload_avatar/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(prev => ({ ...prev, Avatar: res.data.avatar_url }));
      if (onAvatarUpdate) {
        onAvatarUpdate(res.data.avatar_url);
      }
    } catch (err) {
      console.error('Lỗi khi upload avatar:', err);
      setError(err.response?.data?.error || 'Không thể upload avatar');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng đang sửa trường này
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Thông tin của bạn</h2>
        <div className="card p-4 shadow-sm">
          <div className="row">
            <div className="col-md-3 text-center">
              <img
                src={user?.Avatar || '/static/img/default_avatar.png'}
                alt="Avatar"
                className="rounded-circle mb-2"
                width="100"
                height="100"
                style={{ objectFit: 'cover' }}
              />
              <input
                type="file"
                accept="image/*"
                id="avatar-input"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => document.getElementById('avatar-input').click()}
              >
                Đổi ảnh
              </button>
            </div>

            <div className="col-md-9">
              <div className="row mb-3">
                <div className="col-sm-6">
                  <label className="form-label">Tên của bạn</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.Ten || ''}
                    disabled={!isEditMode}
                    onChange={handleInputChange}
                    name="Ten"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className={`form-control ${formErrors.SDT ? 'is-invalid' : ''}`}
                    value={user?.SDT || ''}
                    disabled={!isEditMode}
                    pattern="^0\d{9}$"
                    title="Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0"
                    placeholder="0123456789"
                    onChange={handleInputChange}
                    name="SDT"
                  />
                  {formErrors.SDT && <div className="invalid-feedback">{formErrors.SDT}</div>}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-6">
                  <label className="form-label">Tài khoản</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.TaiKhoan || ''}
                    disabled
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.Email ? 'is-invalid' : ''}`}
                    value={user?.Email || ''}
                    disabled={!isEditMode}
                    pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                    title="Email không hợp lệ, ví dụ: example@gmail.com"
                    placeholder="example@gmail.com"
                    onChange={handleInputChange}
                    name="Email"
                  />
                  {formErrors.Email && <div className="invalid-feedback">{formErrors.Email}</div>}
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditInfo}
                >
                  {isEditMode ? 'Lưu thông tin' : 'Chỉnh sửa thông tin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserInfo;
