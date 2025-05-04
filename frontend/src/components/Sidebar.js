import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div id="sidebar">
      <Link className="nav-link" to="/">
        <h3 className="text-center mb-4">QLHT</h3>
      </Link>
      
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link
            className={`nav-link ${location.pathname === '/thongtinnguoidung' ? 'active' : ''}`}
            to="/thongtinnguoidung"
          >
            <i className="fas fa-address-card me-2"></i> Thông Tin Người Dùng
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            className={`nav-link ${location.pathname === '/monhoc' ? 'active' : ''}`}
            to="/monhoc"
          >
            <i className="fas fa-book-open me-2"></i> Môn Học
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            className={`nav-link ${location.pathname === '/kqht' ? 'active' : ''}`}
            to="/kqht"
          >
            <i className="fas fa-chart-line me-2"></i> Kết Quả Học Tập
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            className={`nav-link ${location.pathname === '/vieccanlam' ? 'active' : ''}`}
            to="/vieccanlam"
          >
            <i className="fas fa-tasks me-2"></i> Việc Cần Làm
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            className={`nav-link ${location.pathname === '/thoikhoabieu' ? 'active' : ''}`}
            to="/thoikhoabieu"
          >
            <i className="fas fa-calendar-alt me-2"></i> Thời Khóa Biểu
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            className={`nav-link ${location.pathname === '/tinchi' ? 'active' : ''}`}
            to="/tinchi"
          >
            <i className="fas fa-book me-2"></i> QL Tín Chỉ
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;