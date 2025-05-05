// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isCollapsed, setIsCollapsed] = useState(false); // Thêm state để kiểm soát sidebar thu nhỏ

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        toggleSidebar(false); // Reset khi quay lại desktop
        setIsCollapsed(false); // Đảm bảo sidebar không bị thu nhỏ khi chuyển sang desktop
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [toggleSidebar]);

  // Hàm thu nhỏ sidebar
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };


  return (
    <div
    id="sidebar"
    className={`${isMobile ? (sidebarOpen ? (isCollapsed ? 'collapsed' : 'open') : 'closed') : 'desktop-sidebar'}`}
  >
    <div className="sidebar-header">
    <div className="sidebar-header">
  <Link to="/" className="sidebar-title">
    QLHT
  </Link>
</div>

      {/* Nút thu nhỏ (chỉ hiển thị khi sidebar mở trên mobile) */}
      {isMobile && sidebarOpen && (
        <button className="sidebar-collapse-btn" onClick={toggleCollapse}>
          {isCollapsed ? '►' : '◄'} {/* Hiển thị biểu tượng thu nhỏ */}
        </button>
      )}
    </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/thongtinnguoidung' ? 'active' : ''}`} to="/thongtinnguoidung">
            <i className="fas fa-address-card"></i>
            <span className="link-text">Thông Tin Người Dùng</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/monhoc' ? 'active' : ''}`} to="/monhoc">
            <i className="fas fa-book-open"></i>
            <span className="link-text">Môn Học</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/kqht' ? 'active' : ''}`} to="/kqht">
            <i className="fas fa-chart-line"></i>
            <span className="link-text">Kết Quả Học Tập</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/vieccanlam' ? 'active' : ''}`} to="/vieccanlam">
            <i className="fas fa-tasks"></i>
            <span className="link-text">Việc Cần Làm</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/thoikhoabieu' ? 'active' : ''}`} to="/thoikhoabieu">
            <i className="fas fa-calendar-alt"></i>
            <span className="link-text">Thời Khóa Biểu</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${location.pathname === '/tinchi' ? 'active' : ''}`} to="/tinchi">
            <i className="fas fa-book"></i>
            <span className="link-text">QL Tín Chỉ</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
