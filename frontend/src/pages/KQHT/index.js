import React, { useEffect, useState, useContext } from "react";
import Layout from "../../components/Layout";
import axios from '../../utils/axios';
import { UserContext } from "../../contexts/UserContext";

const KQHT = () => {
  const { user, loadingUser } = useContext(UserContext);  // Sử dụng context người dùng
  const [ketqua, setKetqua] = useState([]);
  const [monHocList, setMonHocList] = useState([]);
  const [formData, setFormData] = useState({
    MaMonHoc: "",
    DiemGiuaKy: "",
    DiemCuoiKy: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentKQ, setCurrentKQ] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) { // Đảm bảo rằng user đã được tải thành công
      fetchKetQua();
      fetchMonHocList();
    }
  }, [user]);  // Chỉ gọi lại khi user thay đổi

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
    const { DiemGiuaKy, DiemCuoiKy } = formData;

    // Kiểm tra tính hợp lệ của điểm
    if (DiemGiuaKy < 0 || DiemGiuaKy > 10 || DiemCuoiKy < 0 || DiemCuoiKy > 10) {
      setMessage("Điểm phải nằm trong khoảng từ 0 đến 10.");
      return;
    }

    const payload = {
      ...formData,
      DiemGiuaKy: parseFloat(DiemGiuaKy),
      DiemCuoiKy: parseFloat(DiemCuoiKy),
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
        setMessage(isEditing ? "Cập nhật kết quả thành công!" : "Thêm kết quả thành công!");
      })
      .catch(err => {
        console.error("Error submitting form:", err);
        setMessage("Đã có lỗi xảy ra khi thêm/sửa kết quả.");
      });
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
    if (window.confirm("Bạn có chắc chắn muốn xóa kết quả này?")) {
      axios.delete(`/api/ketqua/${id}/`)
        .then(() => {
          fetchKetQua();
          setMessage("Xóa kết quả thành công!");
        })
        .catch(err => {
          console.error("Error deleting result:", err);
          setMessage("Đã có lỗi xảy ra khi xóa kết quả.");
        });
    }
  };

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <h2 className="mb-4">Kết Quả Học Tập</h2>

      {message && <div className="alert alert-info">{message}</div>}

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
