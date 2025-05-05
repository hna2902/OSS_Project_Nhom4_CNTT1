import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // ✅ Import provider
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register'; // ✅ Import trang đăng ký
import QLMH from './pages/QLMH/index';
import KQHT from './pages/KQHT';
import TKB from './pages/TKB';
import UserInfo from './pages/TTND/index';
import VCL from './pages/VCL';
import QLTC from './pages/QLTC';

function App() {
  return (
    <UserProvider> {/* ✅ Bọc toàn app */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* ✅ Thêm route đăng ký */}
          <Route path="/monhoc" element={<QLMH />} />
          <Route path="/kqht" element={<KQHT />} />
          <Route path="/thoikhoabieu" element={<TKB />} />
          <Route path="/thongtinnguoidung" element={<UserInfo />} />
          <Route path="/vieccanlam" element={<VCL />} />
          <Route path="/tinchi" element={<QLTC />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
