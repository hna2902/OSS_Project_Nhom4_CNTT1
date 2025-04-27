import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import QLMH from './pages/QLMH/index';
import KQHT from './pages/KQHT';
import TKB from './pages/TKB';
import UserInfo from './pages/TTND/index'; // Import UserInfo component
import VCL from './pages/VCL'; // Import "Việc Cần Làm" component
import QLTC from './pages/QLTC'; // Import quản lý tín chỉ component (mới thêm)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/monhoc" element={<QLMH />} />
        <Route path="/kqht" element={<KQHT />} />
        <Route path="/thoikhoabieu" element={<TKB />} />
        <Route path="/thongtinnguoidung" element={<UserInfo />} />
        <Route path="/vieccanlam" element={<VCL />} />
        <Route path="/tinchi" element={<QLTC />} /> {/* Thêm route cho quản lý tín chỉ */}
      </Routes>
    </Router>
  );
}

export default App;
