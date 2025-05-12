import React, { useEffect, useState, useContext } from "react";
import Layout from "../../components/Layout";
import axios from '../../utils/axios';
import { UserContext } from "../../contexts/UserContext";

// ... các import như cũ
const KQHT = () => {
  const { user, loadingUser } = useContext(UserContext);
  const [ketqua, setKetqua] = useState([]);
  const [monHocList, setMonHocList] = useState([]);
  const [formData, setFormData] = useState({
    MaMonHoc: "",
    DiemGiuaKy: "",
    DiemCuoiKy: "",
    HeSoGiuaKy: 3,
    HeSoCuoiKy: 7,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentKQ, setCurrentKQ] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchKetQua();
      fetchMonHocList();
    }
  }, [user]);

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
    const { DiemGiuaKy, DiemCuoiKy, HeSoGiuaKy, HeSoCuoiKy } = formData;

    if (DiemGiuaKy < 0 || DiemGiuaKy > 10 || DiemCuoiKy < 0 || DiemCuoiKy > 10) {
      window.alert("Điểm phải nằm trong khoảng từ 0 đến 10.");
      return;
    }

    const payload = {
      ...formData,
      DiemGiuaKy: parseFloat(DiemGiuaKy),
      DiemCuoiKy: parseFloat(DiemCuoiKy),
      HeSoGiuaKy: parseFloat(HeSoGiuaKy),
      HeSoCuoiKy: parseFloat(HeSoCuoiKy),
    };

    const apiCall = isEditing
      ? axios.put(`/api/ketqua/${currentKQ.MaKetQuaHoc}/`, payload)
      : axios.post("/api/ketqua/", payload);

    apiCall
      .then(() => {
        fetchKetQua();
        setFormData({ MaMonHoc: "", DiemGiuaKy: "", DiemCuoiKy: "", HeSoGiuaKy: 3, HeSoCuoiKy: 7 });
        setMessage(isEditing ? "Cập nhật kết quả thành công!" : "Thêm kết quả thành công!");
        setShowModal(false);
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
      HeSoGiuaKy: kq.HeSoGiuaKy || 3,
      HeSoCuoiKy: kq.HeSoCuoiKy || 7,
    });
    setCurrentKQ(kq);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setFormData({ MaMonHoc: "", DiemGiuaKy: "", DiemCuoiKy: "", HeSoGiuaKy: 3, HeSoCuoiKy: 7 });
    setIsEditing(false);
    setCurrentKQ(null);
    setShowModal(true);
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

  const handleCloseModal = () => setShowModal(false);
  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) handleCloseModal();
  };

  if (loadingUser) return <div>Loading...</div>;

  return (
    <Layout>
      <center><h2>Kết Quả Học Tập</h2></center>
      {message && <div className="alert alert-info">{message}</div>}
      <button className="btn btn-success" onClick={handleAddNew}><i className="bi bi-plus-circle me-2"></i>Thêm Kết Quả</button>

{/* Modal popup */}
{showModal && (
  <div
    className="modal d-block"
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    onClick={handleModalClick}
  >
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{isEditing ? "Cập Nhật Kết Quả" : "Thêm Kết Quả"}</h5>
          <button type="button" className="btn-close" onClick={handleCloseModal}></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body row">

            <div className="col-md-6 mb-2">
              <label className="form-label">Hệ số giữa kỳ</label>
              <input
                type="number"
                className="form-control"
                placeholder="Hệ số giữa kỳ (mặc định 3)"
                value={formData.HeSoGiuaKy || 3}
                onChange={e => setFormData({ ...formData, HeSoGiuaKy: e.target.value })}
                min={0}
                max={10}
              />
            </div>

            <div className="col-md-6 mb-2">
              <label className="form-label">Hệ số cuối kỳ</label>
              <input
                type="number"
                className="form-control"
                placeholder="Hệ số cuối kỳ (mặc định 7)"
                value={formData.HeSoCuoiKy || 7}
                onChange={e => setFormData({ ...formData, HeSoCuoiKy: e.target.value })}
                min={0}
                max={10}
              />
            </div>

            <div className="col-12 mb-2">
              <label className="form-label">Môn học</label>
              <select
                className="form-control"
                value={formData.MaMonHoc}
                onChange={e => setFormData({ ...formData, MaMonHoc: e.target.value })}
                required
              >
                <option value="">Chọn môn học</option>
                {monHocList.map(mon => (
                  <option key={mon.MaMonHoc} value={mon.MaMonHoc}>{mon.TenMon}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-2">
              <label className="form-label">Điểm giữa kỳ</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                placeholder="Nhập điểm giữa kỳ"
                value={formData.DiemGiuaKy}
                onChange={e => setFormData({ ...formData, DiemGiuaKy: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6 mb-2">
              <label className="form-label">Điểm cuối kỳ</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                placeholder="Nhập điểm cuối kỳ"
                value={formData.DiemCuoiKy}
                onChange={e => setFormData({ ...formData, DiemCuoiKy: e.target.value })}
                required
              />
            </div>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Hủy</button>
            <button type="submit" className="btn btn-success">{isEditing ? "Cập Nhật" : "Thêm"}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}


      <table className="table table-bordered table-striped mt-3">
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
          {ketqua.length > 0 ? ketqua.map((kq, index) => {
            const hsgk = kq.HeSoGiuaKy ?? 3;
            const hscuoi = kq.HeSoCuoiKy ?? 7;
            const dtb = ((kq.DiemGiuaKy * hsgk + kq.DiemCuoiKy * hscuoi) / (hsgk + hscuoi)).toFixed(2);
            return (
              <tr key={index}>
                <td>{monHocList.find(mon => mon.MaMonHoc === kq.MaMonHoc)?.TenMon || "(Không tìm thấy)"}</td>
                <td>{kq.DiemGiuaKy}</td>
                <td>{kq.DiemCuoiKy}</td>
                <td>{dtb}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => handleEdit(kq)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(kq.MaKetQuaHoc)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            );
          }) : (
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
