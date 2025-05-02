'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../../components/Layout';

const QLTC = () => {
  const [tinchi, settinchi] = useState([]);
  const [monhoc, setmonhoc] = useState([]);
  const [formData, setFormData] = useState({ MaMon: "", TongTinChi: "", SoChiDat: "", SoChiNo: "" });
  const [refresh, setRefresh] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID tín chỉ đang sửa

  // Lấy dữ liệu
  useEffect(() => {
    axios.get('http://localhost:8000/api/tinchi/', { withCredentials: true })
      .then(res => settinchi(res.data))
      .catch(err => console.error("Lỗi khi lấy dữ liệu tín chỉ:", err));

    axios.get('http://localhost:8000/api/monhoc/', { withCredentials: true })
      .then(res => setmonhoc(res.data))
      .catch(err => console.error("Lỗi khi lấy dữ liệu môn học:", err));
  }, [refresh]);

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Nếu đang chỉnh sửa
      axios.put(`http://localhost:8000/api/tinchi/${editingId}/`, formData, { withCredentials: true })
        .then(() => {
          setFormData({ MaMon: "", TongTinChi: "", SoChiDat: "", SoChiNo: "" });
          setEditingId(null);
          setRefresh(prev => !prev);
        })
        .catch(err => alert(err.response?.data?.error || "Cập nhật thất bại!"));
    } else {
      // Thêm mới
      axios.post('http://localhost:8000/api/tinchi/', formData, { withCredentials: true })
        .then(() => {
          setFormData({ MaMon: "", TongTinChi: "", SoChiDat: "", SoChiNo: "" });
          setRefresh(prev => !prev);
        })
        .catch(err => alert(err.response?.data?.error || "Thêm mới thất bại!"));
    }
  };

  // Xóa tín chỉ
  const handleDeleteTinChi = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tín chỉ này?")) {
      axios.delete(`http://localhost:8000/api/tinchi/${id}/`, { withCredentials: true })
        .then(() => setRefresh(prev => !prev))
        .catch(err => alert("Xóa thất bại"));
    }
  };

  // Chọn để chỉnh sửa
 // Chọn để chỉnh sửa
 const handleEditTinChi = (tc) => {
  setFormData({
    MaMon: tc.MaMon || "", // sửa ở đây
    TongTinChi: tc.TongTinChi,
    SoChiDat: tc.SoChiDat,
    SoChiNo: tc.SoChiNo,
  });
  setEditingId(tc.IDTinChi);
};




  // Huỷ chỉnh sửa
  const handleCancelEdit = () => {
    setFormData({ MaMon: "", TongTinChi: "", SoChiDat: "", SoChiNo: "" });
    setEditingId(null);
  };

  return (
    <Layout>
      <h2 className="mb-4">Quản lý Tín Chỉ</h2>

      {/* Form thêm/sửa tín chỉ */}
      <form onSubmit={handleSubmit} className="row mb-4">
        <div className="col">
          <select
            className="form-control"
            value={formData.MaMon}
            onChange={e => setFormData({ ...formData, MaMon: e.target.value })}
            required
          >
            <option value="">Chọn môn học</option>
            {monhoc.map(mon => (
              <option key={mon.MaMonHoc} value={mon.MaMonHoc}>{mon.TenMon}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <input
            type="number"
            className="form-control"
            placeholder="Tổng tín chỉ"
            value={formData.TongTinChi}
            onChange={e => setFormData({ ...formData, TongTinChi: e.target.value })}
            required
          />
        </div>
        <div className="col">
          <input
            type="number"
            className="form-control"
            placeholder="Số chỉ đạt"
            value={formData.SoChiDat}
            onChange={e => setFormData({ ...formData, SoChiDat: e.target.value })}
            required
          />
        </div>
        <div className="col">
          <input
            type="number"
            className="form-control"
            placeholder="Số chỉ nợ"
            value={formData.SoChiNo}
            onChange={e => setFormData({ ...formData, SoChiNo: e.target.value })}
            required
          />
        </div>
        <div className="col">
          <button type="submit" className="btn btn-success">
            {editingId ? "Cập nhật" : "Thêm"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary ms-2" onClick={handleCancelEdit}>
              Huỷ
            </button>
          )}
        </div>
      </form>

      {/* Bảng tín chỉ */}
      <table className="table table-bordered table-striped">
        <thead className="table-primary">
          <tr>
            <th>Môn học</th>
            <th>Tổng tín chỉ</th>
            <th>Số chỉ đạt</th>
            <th>Số chỉ nợ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {tinchi.length > 0 ? (
            tinchi.map((tc) => (
              <tr key={tc.IDTinChi}>
                <td>{tc.TenMon}</td>
                <td>{tc.TongTinChi}</td>
                <td>{tc.SoChiDat}</td>
                <td>{tc.SoChiNo}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditTinChi(tc)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteTinChi(tc.IDTinChi)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted py-4">
                Không có tín chỉ nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
};

export default QLTC;
