import React, { useState, useEffect, useContext } from "react";
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import { UserContext } from "../../contexts/UserContext";

const QLMH = () => {
  const { user, loadingUser } = useContext(UserContext);
  const [monhocs, setMonhocs] = useState([]);
  const [form, setForm] = useState({
    TenMon: "",
    GiangVien: "",
    ThoiGianBatDau: "",
    ThoiGianKetThuc: "",
  });
  const [editMonHoc, setEditMonHoc] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMonHoc();
    }
  }, [user]);

  const fetchMonHoc = () => {
    axios.get("/api/monhoc/", { withCredentials: true })
      .then(res => setMonhocs(res.data))
      .catch(err => console.error("API Error:", err));
  };

  const handleInput = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editMonHoc) {
      axios.put(`/api/monhoc/${editMonHoc.MaMonHoc}/`, form, { withCredentials: true })
        .then(() => {
          fetchMonHoc();
          resetForm();
        })
        .catch(err => console.error("Error submitting form:", err));
    } else {
      axios.post("/api/monhoc/", form, { withCredentials: true })
        .then(() => {
          fetchMonHoc();
          resetForm();
        })
        .catch(err => console.error("Error submitting form:", err));
    }
  };

  const handleDelete = id => {
    if (window.confirm("Bạn có chắc chắn muốn xóa môn học này?")) {
      axios.delete(`/api/monhoc/${id}/`, { withCredentials: true })
        .then(() => fetchMonHoc())
        .catch(err => console.error("Error deleting monhoc:", err));
    }
  };
  

  const handleEdit = monHoc => {
    setEditMonHoc(monHoc);
    setForm({
      TenMon: monHoc.TenMon,
      GiangVien: monHoc.GiangVien,
      ThoiGianBatDau: monHoc.ThoiGianBatDau,
      ThoiGianKetThuc: monHoc.ThoiGianKetThuc,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ TenMon: "", GiangVien: "", ThoiGianBatDau: "", ThoiGianKetThuc: "" });
    setEditMonHoc(null);
    setShowModal(false);
  };

  if (loadingUser) return <div>Loading...</div>;

  return (
    <Layout>
      <center><h2>Danh sách Môn Học</h2></center>

      <button className="btn btn-success" onClick={() => setShowModal(true)}>
      <i className="bi bi-plus-circle me-2"></i>
        Thêm Môn Học
      </button>

      <table className="table table-bordered table-striped">
        <thead className="table-success">
          <tr>
            <th>Mã Môn</th>
            <th>Tên Môn</th>
            <th>Giảng Viên</th>
            <th>Thời Gian Bắt Đầu</th>
            <th>Thời Gian Kết Thúc</th>
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
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(mh)}><i className="bi bi-pencil"></i> </button>
                <button className="btn btn-danger" onClick={() => handleDelete(mh.MaMonHoc)}><i className="bi bi-trash"></i>  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     {/* Modal Form */}
{showModal && (
  <div 
    className="modal show fade d-block" 
    tabIndex="-1" 
    role="dialog"
    onClick={resetForm} // Đóng modal khi click vào nền
  >
    <div 
      className="modal-dialog" 
      role="document"
      onClick={(e) => e.stopPropagation()} // Ngừng sự kiện click từ modal content
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {editMonHoc ? "Cập Nhật Môn Học" : "Thêm Môn Học"}
          </h5>
          <button type="button" className="btn-close" onClick={resetForm}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <input 
              type="text" 
              name="TenMon" 
              placeholder="Tên môn" 
              value={form.TenMon} 
              onChange={handleInput} 
              required 
              className="form-control mb-2" 
            />
            <input 
              type="text" 
              name="GiangVien" 
              placeholder="Giảng viên" 
              value={form.GiangVien} 
              onChange={handleInput} 
              required 
              className="form-control mb-2" 
            />
            <input 
              type="date" 
              name="ThoiGianBatDau" 
              value={form.ThoiGianBatDau} 
              onChange={handleInput} 
              required 
              className="form-control mb-2" 
            />
            <input 
              type="date" 
              name="ThoiGianKetThuc" 
              value={form.ThoiGianKetThuc} 
              onChange={handleInput} 
              required 
              className="form-control mb-2" 
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Đóng</button>
            <button type="submit" className="btn btn-primary">
              {editMonHoc ? "Cập Nhật" : "Thêm"}
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
)}

      
    </Layout>
  );
};

export default QLMH;
