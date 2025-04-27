import React, { useState, useEffect } from "react";
import Layout from '../../components/Layout';
import axios from '../../utils/axios'; // Đảm bảo bạn đã cấu hình axios đúng

const QLMH = () => {
  const [monhocs, setMonhocs] = useState([]);
  const [form, setForm] = useState({
    TenMon: "",
    GiangVien: "",
    ThoiGianBatDau: "",
    ThoiGianKetThuc: "",
    SoTinChi: ""
  });

  useEffect(() => {
    // Lấy danh sách môn học
    fetchMonHoc();
  }, []);

  const fetchMonHoc = () => {
    axios.get("/api/monhoc/", { withCredentials: true })
      .then(res => {
        // Debug chi tiết
        console.log("API Response:", {
          status: res.status,
          dataType: Array.isArray(res.data) ? 'array' : typeof res.data,
          data: res.data
        });
  
        // Đảm bảo data là array
        const dataArray = Array.isArray(res.data) ? res.data : [];
        setMonhocs(dataArray);
      })
      .catch(err => {
        console.error("API Error:", {
          message: err.message,
          response: err.response?.data
        });
      });
  };

  const handleInput = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post("/api/monhoc/", form, { withCredentials: true })
      .then(() => {
        fetchMonHoc();
        setForm({ TenMon: "", GiangVien: "", ThoiGianBatDau: "", ThoiGianKetThuc: "", SoTinChi: "" });
      })
      .catch(err => {
        console.error("Error submitting form:", err);
      });
  };

  const handleDelete = id => {
    axios.delete(`/api/monhoc/${id}/`, { withCredentials: true })
      .then(() => fetchMonHoc())
      .catch(err => {
        console.error("Error deleting monhoc:", err);
      });
  };

  return (
    <Layout>
      <h2>Danh sách Môn Học</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input type="text" name="TenMon" placeholder="Tên môn" value={form.TenMon} onChange={handleInput} required />
        <input type="text" name="GiangVien" placeholder="Giảng viên" value={form.GiangVien} onChange={handleInput} required />
        <input type="date" name="ThoiGianBatDau" value={form.ThoiGianBatDau} onChange={handleInput} required />
        <input type="date" name="ThoiGianKetThuc" value={form.ThoiGianKetThuc} onChange={handleInput} required />
        <input type="number" name="SoTinChi" placeholder="Số tín chỉ" value={form.SoTinChi} onChange={handleInput} required min="1" />
        <button type="submit" className="btn btn-primary">Thêm</button>
      </form>

      <table className="table table-bordered table-striped">
        <thead className="table-success">
          <tr>
            <th>Mã Môn</th>
            <th>Tên Môn</th>
            <th>Giảng Viên</th>
            <th>Thời Gian Bắt Đầu</th>
            <th>Thời Gian Kết Thúc</th>
            <th>Số Tín Chỉ</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
  {monhocs.map(mh => (
    <tr key={mh.MaMonHoc}> {/* Sửa từ _id sang MaMonHoc */}
      <td>{mh.MaMonHoc}</td>
      <td>{mh.TenMon}</td>
      <td>{mh.GiangVien}</td>
      <td>{new Date(mh.ThoiGianBatDau).toLocaleDateString()}</td>
      <td>{new Date(mh.ThoiGianKetThuc).toLocaleDateString()}</td>
      <td>{mh.SoTinChi}</td>
      <td>
        <button 
          className="btn btn-danger btn-sm" 
          onClick={() => handleDelete(mh.MaMonHoc)} // Sửa từ _id sang MaMonHoc
        >
          Xoá
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </Layout>
  );
};

export default QLMH;
