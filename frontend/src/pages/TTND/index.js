import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  useEffect(() => {
    if (!userId) {
      setError('Không tìm thấy người dùng!');
      setLoading(false);
      return;
    }

    axios.get(`/api/thongtinnguoidung/${userId}/`)
      .then(res => setUser(res.data))
      .catch(err => {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
        setError(err.response?.data?.error || 'Không thể lấy thông tin người dùng');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const handleEditInfo = async () => {
    if (!userId) return;

    if (isEditMode) {
      try {
        const res = await axios.patch(`/api/thongtinnguoidung/${userId}/update_user_info/`, {
          Ten: user.Ten,
          SDT: user.SDT,
          Email: user.Email,
        });
        setUser(prev => ({ ...prev, ...res.data }));
        setIsEditMode(false);
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
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await axios.post(`/api/thongtinnguoidung/${userId}/upload_avatar/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(prev => ({ ...prev, Avatar: res.data.avatar_url }));
    } catch (err) {
      console.error('Lỗi khi upload avatar:', err);
      setError(err.response?.data?.error || 'Không thể upload avatar');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div>Đang tải thông tin người dùng...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-danger">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-4">
        <h2>Thông tin của bạn</h2>
        <div className="card p-4 shadow-sm">
          <div className="row">
            <div className="col-md-3 text-center">
              <img
                src={user.Avatar || '/static/img/default_avatar.png'}
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
                    value={user.Ten || ''}
                    disabled={!isEditMode}
                    onChange={(e) => setUser({ ...user, Ten: e.target.value })}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={user.SDT || ''}
                    disabled={!isEditMode}
                    pattern="^0\d{9}$"
                    title="Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0"
                    placeholder="0123456789"
                    onChange={(e) => setUser({ ...user, SDT: e.target.value })}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-6">
                  <label className="form-label">Tài khoản</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.TaiKhoan || ''}
                    disabled
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user.Email || ''}
                    disabled={!isEditMode}
                    pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                    title="Email không hợp lệ, ví dụ: example@gmail.com"
                    placeholder="example@gmail.com"
                    onChange={(e) => setUser({ ...user, Email: e.target.value })}
                  />
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
