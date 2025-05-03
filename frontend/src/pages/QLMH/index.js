import React, { useState, useEffect, useContext } from "react";
import Layout from '../../components/Layout';
import axios from '../../utils/axios'; // Đảm bảo bạn đã cấu hình axios đúng
import { UserContext } from "../../contexts/UserContext";

const QLMH = () => {
  const { user, loadingUser } = useContext(UserContext); // Lấy thông tin người dùng từ UserContext
  const [monhocs, setMonhocs] = useState([]);
  const [form, setForm] = useState({
    TenMon: "",
    GiangVien: "",
    ThoiGianBatDau: "",
    ThoiGianKetThuc: "",
    SoTinChi: ""
  });
  const [editMonHoc, setEditMonHoc] = useState(null); // State để lưu môn học cần sửa

  useEffect(() => {
    if (user) {
      // Lấy danh sách môn học khi người dùng đã được tải
      fetchMonHoc();
    }
  }, [user]); // Gọi lại khi user thay đổi

  const fetchMonHoc = () => {
    axios.get("/api/monhoc/", { withCredentials: true })
      .then(res => {
        setMonhocs(res.data);
      })
      .catch(err => {
        console.error("API Error:", err);
      });
  };

  const handleInput = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editMonHoc) {
      // Sửa môn học
      axios.put(`/api/monhoc/${editMonHoc.MaMonHoc}/`, form, { withCredentials: true })
        .then(() => {
          fetchMonHoc();
          setForm({ TenMon: "", GiangVien: "", ThoiGianBatDau: "", ThoiGianKetThuc: "", SoTinChi: "" });
          setEditMonHoc(null); // Reset khi sửa thành công
        })
        .catch(err => {
          console.error("Error submitting form:", err);
        });
    } else {
      // Thêm môn học
      axios.post("/api/monhoc/", form, { withCredentials: true })
        .then(() => {
          fetchMonHoc();
          setForm({ TenMon: "", GiangVien: "", ThoiGianBatDau: "", ThoiGianKetThuc: "", SoTinChi: "" });
        })
        .catch(err => {
          console.error("Error submitting form:", err);
        });
    }
  };

  const handleDelete = id => {
    axios.delete(`/api/monhoc/${id}/`, { withCredentials: true })
      .then(() => fetchMonHoc())
      .catch(err => {
        console.error("Error deleting monhoc:", err);
      });
  };

  const handleEdit = monHoc => {
    setEditMonHoc(monHoc); // Đặt môn học cần sửa vào state
    setForm({
      TenMon: monHoc.TenMon,
      GiangVien: monHoc.GiangVien,
      ThoiGianBatDau: monHoc.ThoiGianBatDau,
      ThoiGianKetThuc: monHoc.ThoiGianKetThuc,
      SoTinChi: monHoc.SoTinChi
    });
  };

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <h2>Danh sách Môn Học</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input type="text" name="TenMon" placeholder="Tên môn" value={form.TenMon} onChange={handleInput} required />
        <input type="text" name="GiangVien" placeholder="Giảng viên" value={form.GiangVien} onChange={handleInput} required />
        <input type="date" name="ThoiGianBatDau" value={form.ThoiGianBatDau} onChange={handleInput} required />
        <input type="date" name="ThoiGianKetThuc" value={form.ThoiGianKetThuc} onChange={handleInput} required />
        <input type="number" name="SoTinChi" placeholder="Số tín chỉ" value={form.SoTinChi} onChange={handleInput} required min="1" />
        <button type="submit" className="btn btn-primary">{editMonHoc ? "Cập Nhật" : "Thêm"}</button>
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
            <tr key={mh.MaMonHoc}>
              <td>{mh.MaMonHoc}</td>
              <td>{mh.TenMon}</td>
              <td>{mh.GiangVien}</td>
              <td>{new Date(mh.ThoiGianBatDau).toLocaleDateString()}</td>
              <td>{new Date(mh.ThoiGianKetThuc).toLocaleDateString()}</td>
              <td>{mh.SoTinChi}</td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(mh)}>
                  Sửa
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(mh.MaMonHoc)}>
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
