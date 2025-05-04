import React, { useEffect, useState, useContext } from "react";
import Layout from "../../components/Layout";
import axios from '../../utils/axios';
import { UserContext } from "../../contexts/UserContext";

const KQHT = () => {
  const { user, loadingUser } = useContext(UserContext);
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
    const { DiemGiuaKy, DiemCuoiKy } = formData;

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
        setFormData({ MaMonHoc: "", DiemGiuaKy: "", DiemCuoiKy: "" });
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
    });
    setCurrentKQ(kq);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setFormData({ MaMonHoc: "", DiemGiuaKy: "", DiemCuoiKy: "" });
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

  if (loadingUser) return <div>Loading...</div>;

  return (
    <Layout>
      <center><h2>Kết Quả Học Tập</h2></center>

      {message && <div className="alert alert-info">{message}</div>}

      <button className="btn btn-primary mb-3" onClick={handleAddNew}>Thêm Kết Quả</button>

      {/* Modal popup */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? "Cập Nhật Kết Quả" : "Thêm Kết Quả"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body row">
                  <div className="col-12 mb-2">
                    <select className="form-control" value={formData.MaMonHoc} onChange={e => setFormData({ ...formData, MaMonHoc: e.target.value })} required>
                      <option value="">Chọn môn học</option>
                      {monHocList.map(mon => (
                        <option key={mon.MaMonHoc} value={mon.MaMonHoc}>{mon.TenMon}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-2">
                    <input type="number" step="0.1" className="form-control" placeholder="Điểm giữa kỳ" value={formData.DiemGiuaKy} onChange={e => setFormData({ ...formData, DiemGiuaKy: e.target.value })} required />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input type="number" step="0.1" className="form-control" placeholder="Điểm cuối kỳ" value={formData.DiemCuoiKy} onChange={e => setFormData({ ...formData, DiemCuoiKy: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-success">{isEditing ? "Cập Nhật" : "Thêm"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
              <td>{monHocList.find(mon => mon.MaMonHoc === kq.MaMonHoc)?.TenMon || "(Không tìm thấy)"}</td>
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
