'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import Layout from '../../components/Layout';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext'; // Import UserContext

function VCL() {
  const { user, setUser, loadingUser } = useContext(UserContext); // Lấy thông tin người dùng từ context

  const [monhoc, setMonhoc] = useState([]);
  const [vieccanlam, setViecCanLam] = useState([]);
  const [selectedViec, setSelectedViec] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    NhacNho: '',
    GhiChu: '',
    ThoiHan: '',
    MaMonHoc: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [monhocRes, vieccanlamRes] = await Promise.all([
        axios.get('http://localhost:8000/api/monhoc/', { withCredentials: true }),
        axios.get('http://localhost:8000/api/vieccanlam/', { withCredentials: true }),
      ]);

      const monhocData = monhocRes.data;
      const vieccanlamData = vieccanlamRes.data;

      const enrichedViecs = vieccanlamData.map(viec => {
        const mon = monhocData.find(m => m.MaMonHoc === viec.MaMonHoc);
        return {
          ...viec,
          TenMon: mon ? mon.TenMon : 'Không xác định',
        };
      });

      setMonhoc(monhocData);
      setViecCanLam(enrichedViecs);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.detail || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModalManually = () => {
    const modalElement = document.getElementById('themViecModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  };

  const handleAddOrUpdateViec = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newViec = { ...formData };
      if (selectedViec) {
        await axios.put(`http://localhost:8000/api/vieccanlam/${selectedViec.MaViec}/`, newViec, { withCredentials: true });
      } else {
        await axios.post('http://localhost:8000/api/vieccanlam/', newViec, { withCredentials: true });
      }
      await fetchData();
      setSelectedViec(null);
      setFormData({ NhacNho: '', GhiChu: '', ThoiHan: '', MaMonHoc: '' });
      closeModalManually();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.detail || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteViec = async (maViec) => {
    if (!window.confirm('Bạn có chắc muốn xóa việc này không?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/vieccanlam/${maViec}/`, { withCredentials: true });
      await fetchData();
      closeModalManually();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.detail || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditViec = (viec) => {
    setSelectedViec(viec);
    setFormData({
      NhacNho: viec.NhacNho || '',
      GhiChu: viec.GhiChu || '',
      ThoiHan: viec.ThoiHan || '',
      MaMonHoc: viec.MaMonHoc || '',
    });
    const modalElement = document.getElementById('themViecModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAddModal = () => {
    setSelectedViec(null);
    setFormData({ NhacNho: '', GhiChu: '', ThoiHan: '', MaMonHoc: '' });
    const modalElement = document.getElementById('themViecModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  if (isLoading) return <div className="text-center my-5"><div className="spinner-border" role="status"><span className="visually-hidden">Đang tải...</span></div></div>;
  if (error) return <div className="alert alert-danger">Lỗi: {error}</div>;

  return (
    <Layout>
      <div className="container py-4">
        <h1 className="mb-4 text-center">Danh sách việc cần làm</h1>
        <button type="button" className="btn btn-success" onClick={handleOpenAddModal}>
                <i className="bi bi-plus-circle me-2"></i>Thêm Việc
              </button>
        <div className="card shadow-sm">
          
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">Danh sách công việc</h5>
              
            </div>
            <div className="table-responsive">
              <table className="table table-hover table-striped">
                <thead className="table-light">
                  <tr>
                    <th>Tên môn</th>
                    <th>Nhắc nhở</th>
                    <th>Ghi chú</th>
                    <th>Thời hạn</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {vieccanlam.length > 0 ? (
                    vieccanlam.map((viec) => (
                      <tr key={viec.MaViec}>
                        <td>{viec.TenMon}</td>
                        <td>{viec.NhacNho}</td>
                        <td>{viec.GhiChu}</td>
                        <td>{formatDate(viec.ThoiHan)}</td>
                        <td className="align-middle">
                          <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-sm btn-warning" onClick={() => handleEditViec(viec)}>
                              <i className="bi bi-pencil"></i> Sửa
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteViec(viec.MaViec)}>
                              <i className="bi bi-trash"></i> Xóa
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">Không có việc cần làm nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal thêm/sửa việc */}
        <div className="modal fade" id="themViecModal" tabIndex="-1" aria-labelledby="themViecLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAddOrUpdateViec}>
                <div className="modal-header">
                  <h5 className="modal-title" id="themViecLabel">
                    {selectedViec ? 'Sửa việc cần làm' : 'Thêm việc cần làm'}
                  </h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nhắc nhở</label>
                    <input
                      type="text"
                      className="form-control"
                      name="NhacNho"
                      value={formData.NhacNho}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ghi chú</label>
                    <textarea
                      className="form-control"
                      name="GhiChu"
                      value={formData.GhiChu}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Thời hạn</label>
                    <input
                      type="date"
                      className="form-control"
                      name="ThoiHan"
                      value={formData.ThoiHan}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Môn học</label>
                    <select
                      className="form-select"
                      name="MaMonHoc"
                      value={formData.MaMonHoc}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Chọn môn học</option>
                      {monhoc.map((mon) => (
                        <option key={mon.MaMonHoc} value={mon.MaMonHoc}>
                          {mon.TenMon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading && <span className="spinner-border spinner-border-sm me-1"></span>}
                    {selectedViec ? 'Cập nhật' : 'Thêm'}
                  </button>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={isLoading}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default VCL;
