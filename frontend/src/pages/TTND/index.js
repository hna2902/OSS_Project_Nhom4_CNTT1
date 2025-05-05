import React, { useState, useContext } from 'react';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import { UserContext } from '../../contexts/UserContext';

const UserInfo = ({ onAvatarUpdate }) => {
  const { user, setUser, loadingUser } = useContext(UserContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordChangeMode, setIsPasswordChangeMode] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    SDT: '',
    Email: '',
    oldPassword: '',
    newPassword: ''
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
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

      if (user.SDT && !phonePattern.test(user.SDT)) {
        newErrors.SDT = 'Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng.';
        hasError = true;
      }

      if (user.Email && !emailPattern.test(user.Email)) {
        newErrors.Email = 'Email không hợp lệ. Vui lòng nhập đúng định dạng.';
        hasError = true;
      }

      setFormErrors(newErrors);

      if (hasError) {
        return;
      }

      if (!user._id) {
        setError("Không tìm thấy ID người dùng.");
        return;
      }

      try {
        const res = await axios.patch(`/api/thongtinnguoidung/${user._id}/update_user_info/`, {
          Ten: user.Ten,
          SDT: user.SDT,
          Email: user.Email,
        });

        if (res.status === 200) {
          const updatedUser = await axios.get(`/api/thongtinnguoidung/${user._id}/`);
          setUser(prev => ({
            ...prev,
            ...updatedUser.data
          }));

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

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword } = passwords;

    if (!oldPassword || !newPassword) {
      setError("Vui lòng nhập mật khẩu cũ và mật khẩu mới.");
      return;
    }

    try {
      const res = await axios.post(`/api/thongtinnguoidung/${user._id}/change_password/`, {
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (res.status === 200) {
        setIsPasswordChangeMode(false);
        setPasswords({ oldPassword: '', newPassword: '' });
        alert("Đổi mật khẩu thành công!");
      } else {
        setError(res.data.error || "Không thể đổi mật khẩu");
      }
    } catch (err) {
      console.error('Lỗi khi đổi mật khẩu:', err);
      setError(err.response?.data?.error || 'Không thể đổi mật khẩu');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <center><h2>Thông tin của bạn</h2></center>
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

              <div className="d-flex justify-content-center mt-4 gap-3">
                              {isPasswordChangeMode ? (
                  <div className="w-100">
                    <h3>Đổi mật khẩu</h3>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Mật khẩu cũ</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwords.oldPassword}
                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Mật khẩu mới</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-success me-2"
                      onClick={handlePasswordChange}
                    >
                      Đổi mật khẩu
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsPasswordChangeMode(false)}
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-warning flex-fill"
                      style={{ maxWidth: '200px' }}
                      onClick={() => setIsPasswordChangeMode(true)}
                    >
                      Thay đổi mật khẩu
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary flex-fill"
                      style={{ maxWidth: '200px' }}
                      onClick={handleEditInfo}
                    >
                      {isEditMode ? 'Lưu thông tin' : 'Chỉnh sửa thông tin'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserInfo;