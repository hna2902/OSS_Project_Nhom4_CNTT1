import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from '../../utils/axios';

const KQHT = () => {
  const [ketqua, setKetqua] = useState([]);
  const [monHocList, setMonHocList] = useState([]);
  const [formData, setFormData] = useState({
    MaMonHoc: "",
    DiemGiuaKy: "",
    DiemCuoiKy: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentKQ, setCurrentKQ] = useState(null);

  useEffect(() => {
    fetchKetQua();
    fetchMonHocList();
  }, []);

  const fetchKetQua = () => {
    axios.get("/api/ketqua/")
      .then(res => setKetqua(res.data))
      .catch(err => console.error("Error fetching ket qua:", err));
  };

  const fetchMonHocList = () => {
    axios.get("/api/monhoc/")
      .then(res => setMonHocList(res.data))
      .catch(err => console.error("Error fetching mon hoc:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      DiemGiuaKy: parseFloat(formData.DiemGiuaKy),
      DiemCuoiKy: parseFloat(formData.DiemCuoiKy),
    };

    const apiCall = isEditing
      ? axios.put(`/api/ketqua/${currentKQ.MaKetQuaHoc}/`, payload)
      : axios.post("/api/ketqua/", payload);

    apiCall
      .then(() => {
        fetchKetQua();
        setFormData({
          MaMonHoc: "",
          DiemGiuaKy: "",
          DiemCuoiKy: "",
        });
      })
      .catch(err => console.error("Error submitting form:", err));
  };

  const handleEdit = (kq) => {
    setFormData({
      MaMonHoc: kq.MaMonHoc,
      DiemGiuaKy: kq.DiemGiuaKy,
      DiemCuoiKy: kq.DiemCuoiKy,
    });
    setCurrentKQ(kq);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    axios.delete(`/api/ketqua/${id}/`)
      .then(() => fetchKetQua())
      .catch(err => console.error("Error deleting result:", err));
  };

  return (
    <Layout>
      <h2 className="mb-4">Kết Quả Học Tập</h2>

      {/* Form thêm/sửa kết quả học tập */}
      <form onSubmit={handleSubmit} className="row mb-4">
        <div className="col">
          <select className="form-control" value={formData.MaMonHoc} onChange={e => setFormData({ ...formData, MaMonHoc: e.target.value })} required>
            <option value="">Chọn môn học</option>
            {monHocList.map(mon => (
              <option key={mon.MaMonHoc} value={mon.MaMonHoc}>{mon.TenMonHoc}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <input type="number" name="DiemGiuaKy" step="0.1" value={formData.DiemGiuaKy} onChange={e => setFormData({ ...formData, DiemGiuaKy: e.target.value })} className="form-control" placeholder="Điểm giữa kỳ" required />
        </div>
        <div className="col">
          <input type="number" name="DiemCuoiKy" step="0.1" value={formData.DiemCuoiKy} onChange={e => setFormData({ ...formData, DiemCuoiKy: e.target.value })} className="form-control" placeholder="Điểm cuối kỳ" required />
        </div>
        <div className="col">
          <button type="submit" className="btn btn-success">{isEditing ? "Cập Nhật" : "Thêm"}</button>
        </div>
      </form>

      {/* Bảng kết quả học tập */}
      <table className="table table-bordered table-striped">
        <thead className="table-primary">
          <tr>
            <th>Môn Học</th>
            <th>Điểm Giữa Kỳ</th>
            <th>Điểm Cuối Kỳ</th>
            <th>Điểm Trung Bình</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {ketqua.length > 0 ? ketqua.map((kq, index) => (
            <tr key={index}>
              <td>{kq.TenMonHoc}</td>
              <td>{kq.DiemGiuaKy}</td>
              <td>{kq.DiemCuoiKy}</td>
              <td>{kq.DiemTrungBinh}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(kq)}>Sửa</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(kq.MaKetQuaHoc)}>Xóa</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">Không có kết quả học tập nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
};

export default KQHT;
