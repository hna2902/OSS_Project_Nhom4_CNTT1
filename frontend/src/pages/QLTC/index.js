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
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/tinchi/', { withCredentials: true })
      .then(res => settinchi(res.data))
      .catch(err => console.error("Lỗi khi lấy dữ liệu tín chỉ:", err));

    axios.get('http://localhost:8000/api/monhoc/', { withCredentials: true })
      .then(res => setmonhoc(res.data))
      .catch(err => console.error("Lỗi khi lấy dữ liệu môn học:", err));
  }, [refresh]);

  const openModal = (tc = null) => {
    if (tc) {
      setFormData({
        MaMon: tc.MaMon || "",
        TongTinChi: tc.TongTinChi,
        SoChiDat: tc.SoChiDat,
        SoChiNo: tc.SoChiNo,
      });
      setEditingId(tc.IDTinChi);
    } else {
      setFormData({ MaMon: "", TongTinChi: "", SoChiDat: "", SoChiNo: "" });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ MaMon: "", TongTinChi: "", SoChiDat: "", SoChiNo: "" });
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const tongTC = parseInt(formData.TongTinChi, 10);
    const soDat = parseInt(formData.SoChiDat, 10);
    const soNo = parseInt(formData.SoChiNo, 10);
  
    if (soDat + soNo > tongTC) {
      alert("Tổng Số chỉ đạt và Số chỉ nợ không được vượt quá Tổng tín chỉ!");
      return;
    }
  
    const url = editingId
      ? `http://localhost:8000/api/tinchi/${editingId}/`
      : 'http://localhost:8000/api/tinchi/';
    const method = editingId ? axios.put : axios.post;
  
    method(url, formData, { withCredentials: true })
    .then(res => {
      setMessage(res.data.message || "Thao tác thành công");
      setMessageType("success");
      setRefresh(prev => !prev);
      closeModal();
    })
    .catch(err => {
      const errorMsg = err.response?.data?.error || "Thao tác thất bại!";
      setMessage(errorMsg);
      setMessageType("error");
    });
  
  };
  const [message, setMessage] = useState(null);  // message nội dung
  const [messageType, setMessageType] = useState(null);  // "success" hoặc "error"
  

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tín chỉ này?")) {
      axios.delete(`http://localhost:8000/api/tinchi/${id}/`, { withCredentials: true })
        .then(res => {
          setMessage(res.data.message || "Xóa thành công");
          setMessageType("success");
          setRefresh(prev => !prev);
        })
        .catch(err => {
          const errorMsg = err.response?.data?.error || "Xóa thất bại!";
          setMessage(errorMsg);
          setMessageType("error");
        });

    }
  };

  return (
    <Layout>
 
        <center><h2>Quản lý Tín Chỉ</h2></center>
        {message && (
  <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} alert-dismissible fade show`} role="alert">
    {message}
    <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
  </div>
)}


      <button className="btn btn-success" onClick={() => openModal()}>
      <i className="bi bi-plus-circle me-2"></i>Thêm Tín Chỉ</button>
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
                <td>{monhoc.find(mon => mon.MaMonHoc === tc.MaMon)?.TenMon || "Không rõ"}</td>
                <td>{tc.TongTinChi}</td>
                <td>{tc.SoChiDat}</td>
                <td>{tc.SoChiNo}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => openModal(tc)}><i className="bi bi-pencil"></i> </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(tc.IDTinChi)}><i className="bi bi-trash"></i></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted py-4">Không có tín chỉ nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Bootstrap đơn giản */}
      {showModal && (
        <div
        className="modal show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={(e) => {
          if (e.target.classList.contains("modal")) {
            closeModal();
          }
        }}
      >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? "Chỉnh sửa Tín Chỉ" : "Thêm Tín Chỉ"}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Môn học</label>
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
                  <div className="col-md-6">
                    <label className="form-label">Tổng tín chỉ</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.TongTinChi}
                      onChange={e => setFormData({ ...formData, TongTinChi: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số chỉ đạt</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.SoChiDat}
                      onChange={e => setFormData({ ...formData, SoChiDat: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số chỉ nợ</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.SoChiNo}
                      onChange={e => setFormData({ ...formData, SoChiNo: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    {editingId ? "Lưu thay đổi" : "Thêm"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Hủy</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default QLTC;
