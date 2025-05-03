import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Kiểm tra xem đã có thông tin người dùng trong localStorage chưa
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (savedUser) {
      // Nếu có, cập nhật state và context từ localStorage
      setUser(savedUser);
    }
    setLoadingUser(false);  // Không cần phải set lại loadingUser trong else

  }, []);

  // Cập nhật lại LocalStorage khi user thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Hàm để lấy lại thông tin người dùng từ server (sau khi cập nhật thông tin)
  const refreshUser = async () => {
    try {
      const response = await axios.get(`/api/thongtinnguoidung/${user._id}/`);
      setUser(response.data);  // Cập nhật lại user từ server
    } catch (error) {
      console.error('Lỗi khi tải lại thông tin người dùng:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
