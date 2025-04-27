import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";

const KQHT = () => {
  const [user, setUser] = useState(null);
  const [ketqua, setKetqua] = useState([]);

  useEffect(() => {
    // Lấy user
    axios.get("/api/user", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => console.log(err));

    // Lấy dữ liệu kết quả học tập
    fetchKetQua();
  }, []);

  const fetchKetQua = () => {
    axios.get("/api/ketqua/", { withCredentials: true })
      .then(res => setKetqua(res.data))
      .catch(err => console.error(err));
  };

  return (
    <Layout currentUser={user}>
      <h2 className="mb-3">Danh sách Kết Quả Học Tập</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-primary">
          <tr>
            <th>Mã Người Dùng</th>
            <th>Mã Kết Quả</th>
            <th>Mã Môn</th>
            <th>Tên Môn</th>
            <th>Điểm Hệ 10</th>
            <th>Điểm Hệ 4</th>
          </tr>
        </thead>
        <tbody>
          {ketqua.length > 0 ? ketqua.map((kq, index) => (
            <tr key={index}>
              <td>{kq.MaNguoiDung}</td>
              <td>{kq.MaKetQuaHoc}</td>
              <td>{kq.MaMon}</td>
              <td>{kq.TenMon}</td>
              <td>{kq.DiemHe10}</td>
              <td>{kq.DiemHe4}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">Không có kết quả học tập nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
};

export default KQHT;
