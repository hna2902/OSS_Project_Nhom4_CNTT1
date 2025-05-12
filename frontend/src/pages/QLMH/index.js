import React, { useState, useEffect, useContext } from "react";
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import { UserContext } from "../../contexts/UserContext";

const QLMH = () => {
  const { user, loadingUser } = useContext(UserContext);
  const [monhocs, setMonhocs] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  // Thêm hàm lấy các năm học duy nhất
  const uniqueNamHocs = [...new Set(monhocs.map(mh => mh.NamHoc))].sort();

  const [form, setForm] = useState({
    TenMon: "",
    GiangVien: "",
    ThoiGianBatDau: "",
    ThoiGianKetThuc: "",
    NamHoc: "",
    HocKy: ""
  });
  const [editMonHoc, setEditMonHoc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState({ NamHoc: "", HocKy: "" });

  useEffect(() => {
    if (user) fetchMonHoc();
  }, [user]);

  const fetchMonHoc = () => {
    setLoading(true);
    axios.get("/api/monhoc/", { withCredentials: true })
      .then(res => setMonhocs(res.data))
      .catch(err => console.error("API Error:", err))
      .finally(() => setLoading(false));
  };

  const handleInput = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
  
    if (!form.TenMon.trim() || !form.GiangVien.trim() || !form.ThoiGianBatDau || !form.ThoiGianKetThuc || !form.NamHoc.trim() || !form.HocKy) {
      setNotification({ type: "error", message: "Vui lòng điền đầy đủ thông tin!" });
      return;
    }
  
    const start = new Date(form.ThoiGianBatDau);
    const end = new Date(form.ThoiGianKetThuc);
  
    if (start >= end) {
      setNotification({ type: "error", message: "Thời gian bắt đầu phải trước thời gian kết thúc!" });
      return;
    }
  
    const request = editMonHoc
      ? axios.put(`/api/monhoc/${editMonHoc.MaMonHoc}/`, form, { withCredentials: true })
      : axios.post("/api/monhoc/", form, { withCredentials: true });
  
    request.then(res => {
      setNotification({ type: "success", message: res.data.message });
      fetchMonHoc();
      resetForm();
    }).catch(err => {
      const msg = err.response?.data?.error || "Lỗi không xác định!";
      setNotification({ type: "error", message: msg });
    });
  };

  const handleDelete = id => {
    if (window.confirm("Bạn có chắc chắn muốn xóa môn học này?")) {
      axios.delete(`/api/monhoc/${id}/`, { withCredentials: true })
        .then(res => {
          const msg = res.data?.message || "Xóa thành công!";
          setNotification({ type: "success", message: msg });
          fetchMonHoc();
        })
        .catch(err => {
          const msg = err.response?.data?.error || "Không thể xóa môn học!";
          setNotification({ type: "error", message: msg });
        });
    }
  };

  const handleEdit = monHoc => {
    setEditMonHoc(monHoc);
    setForm({
      TenMon: monHoc.TenMon,
      GiangVien: monHoc.GiangVien,
      ThoiGianBatDau: monHoc.ThoiGianBatDau,
      ThoiGianKetThuc: monHoc.ThoiGianKetThuc,
      NamHoc: monHoc.NamHoc,
      HocKy: monHoc.HocKy
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({ TenMon: "", GiangVien: "", ThoiGianBatDau: "", ThoiGianKetThuc: "", NamHoc: "", HocKy: "" });
    setEditMonHoc(null);
    setShowModal(false);
  };

  const filteredMonHocs = monhocs.filter(mh => {
    return (
      (filter.NamHoc ? mh.NamHoc === filter.NamHoc : true) &&
      (filter.HocKy ? mh.HocKy === filter.HocKy : true)
    );
  });
  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setNotification({ type: "error", message: "Vui lòng chọn file CSV!" });
      return;
    }
  
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setNotification({ type: "error", message: "Chỉ hỗ trợ file CSV!" });
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await axios.post("/api/monhoc/upload_csv/", formData, { withCredentials: true });
      setNotification({ type: "success", message: res.data.message });
      fetchMonHoc();
      setFile(null);
    } catch (err) {
      const msg = err.response?.data?.error || "Lỗi khi tải lên. Vui lòng kiểm tra file CSV có đúng định dạng không (TenMon, GiangVien, ThoiGianBatDau, ThoiGianKetThuc, NamHoc, HocKy).";
      setNotification({ type: "error", message: msg });
    }
  };
  

  if (loadingUser) return <div>Loading...</div>;

  return (
    <Layout>
      <center><h2>Danh sách Môn Học</h2></center>

      {notification && (
        <div className={`alert ${notification.type === "error" ? "alert-danger" : "alert-success"}`} role="alert">
          {notification.message}
        </div>
      )}

      {/* Bộ lọc năm học và học kỳ */}
      <div className="d-flex gap-2 my-3">
      <select
          value={filter.NamHoc}
          onChange={(e) => setFilter(prev => ({ ...prev, NamHoc: e.target.value }))}
          className="form-select w-auto"
        >
          <option value="">Tất cả năm học</option>
          {uniqueNamHocs.map(nh => (
            <option key={nh} value={nh}>{nh}</option>
          ))}
        </select>


        <select
          value={filter.HocKy}
          onChange={(e) => setFilter(prev => ({ ...prev, HocKy: e.target.value }))}
          className="form-select w-auto"
        >
          <option value="">Tất cả học kỳ</option>
          <option value="1">Học kỳ 1</option>
          <option value="2">Học kỳ 2</option>
          <option value="3">Học kỳ hè</option>
        </select>
      </div>
      <div className="mb-3">
        <input type="file" onChange={handleFileChange} className="form-control" />
        <button className="btn btn-primary mt-2" onClick={handleFileUpload}>
          Tải lên Môn Học từ File
        </button>
      </div>
      <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>
        <i className="bi bi-plus-circle me-2"></i>
        Thêm Môn Học
      </button>

      <table className="table table-bordered table-striped">
        <thead className="table-success">
          <tr>
            <th>Tên Môn</th>
            <th>Giảng Viên</th>
            <th>Năm Học</th>
            <th>Học Kỳ</th>
            <th>Thời Gian Bắt Đầu</th>
            <th>Thời Gian Kết Thúc</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredMonHocs.map(mh => (
            <tr key={mh.MaMonHoc}>
              <td>{mh.TenMon}</td>
              <td>{mh.GiangVien}</td>
              <td>{mh.NamHoc}</td>
              <td>{mh.HocKy}</td>
              <td>{new Date(mh.ThoiGianBatDau).toLocaleDateString()}</td>
              <td>{new Date(mh.ThoiGianKetThuc).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(mh)}><i className="bi bi-pencil"></i></button>
                <button className="btn btn-danger" onClick={() => handleDelete(mh.MaMonHoc)}><i className="bi bi-trash"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" onClick={resetForm}>
          <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMonHoc ? "Cập Nhật Môn Học" : "Thêm Môn Học"}
                </h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>

              <form onSubmit={handleSubmit}>
              <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Tên môn</label>
                <input type="text" name="TenMon" value={form.TenMon} onChange={handleInput} required className="form-control" />
              </div>

              <div className="mb-2">
                <label className="form-label">Giảng viên</label>
                <input type="text" name="GiangVien" value={form.GiangVien} onChange={handleInput} required className="form-control" />
              </div>

              <div className="mb-2">
                <label className="form-label">Thời gian bắt đầu</label>
                <input type="date" name="ThoiGianBatDau" value={form.ThoiGianBatDau} onChange={handleInput} required className="form-control" />
              </div>

              <div className="mb-2">
                <label className="form-label">Thời gian kết thúc</label>
                <input type="date" name="ThoiGianKetThuc" value={form.ThoiGianKetThuc} onChange={handleInput} required className="form-control" />
              </div>

              <div className="mb-2">
                <label className="form-label">Năm học</label>
                <input
                  type="text"
                  name="NamHoc"
                  value={form.NamHoc}
                  onChange={handleInput}
                  list="namHocOptions"
                  required
                  className="form-control"
                />
                <datalist id="namHocOptions">
                  <option value="2022-2023" />
                  <option value="2023-2024" />
                  <option value="2024-2025" />
                </datalist>
              </div>

              <div className="mb-2">
                <label className="form-label">Học kỳ</label>
                <select name="HocKy" value={form.HocKy} onChange={handleInput} required className="form-control">
                  <option value="">Chọn học kỳ</option>
                  <option value="1">Học kỳ 1</option>
                  <option value="2">Học kỳ 2</option>
                  <option value="3">Học kỳ hè</option>
                </select>
              </div>
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
