'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';

function VCL() {
  const { user, setUser, loadingUser } = useContext(UserContext);

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

  const [tenMonFilter, setTenMonFilter] = useState('');
  const [thoiHanFilter, setThoiHanFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      const modal = bootstrap.Modal.getInstance(modalElement) || bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.hide();
      modal.dispose();
    }
    document.body.classList.remove('modal-open');
    document.body.style = ''; // reset inline style nếu có
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(b => b.remove());
  };

  const handleAddOrUpdateViec = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Kiểm tra dữ liệu bắt buộc trước khi submit
    const { NhacNho, ThoiHan, MaMonHoc } = formData;
    if (!NhacNho || !ThoiHan || !MaMonHoc) {
      setError("Vui lòng nhập đầy đủ Nhắc nhở, Thời hạn và chọn Môn học.");
      setIsLoading(false);
      return;
    }

    try {
      const newViec = { ...formData };
      let response;

      if (selectedViec) {
        response = await axios.put(
          `http://localhost:8000/api/vieccanlam/${selectedViec.MaViec}/`,
          newViec,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          'http://localhost:8000/api/vieccanlam/',
          newViec,
          { withCredentials: true }
        );
      }

      // Hiển thị thông báo từ backend
      setSuccessMessage(response.data.message || 'Thao tác thành công.');
      await fetchData();
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
    setError(null);  // Clear any previous errors
    setSuccessMessage('');  // Clear any previous success message
    try {
      const response = await axios.delete(`http://localhost:8000/api/vieccanlam/${maViec}/`, { withCredentials: true });
      
      // Nhận thông báo từ backend sau khi xóa thành công
      setSuccessMessage(response.data.message || 'Xóa việc thành công.');
  
      // Cập nhật lại danh sách việc cần làm sau khi xóa
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
    // Xóa error cũ khi mở modal mới
    setError(null);
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

  const filterTable = () => {
    const rows = document.querySelectorAll("#viecTable tbody tr");

    rows.forEach(row => {
      const tenMon = row.getAttribute("data-tenmon") ? row.getAttribute("data-tenmon").toLowerCase() : "";
      const thoiHan = row.getAttribute("data-thoihan") || "";
      const tenMonMatch = tenMonFilter === "" || tenMon === tenMonFilter;
      const thoiHanMatch = !thoiHanFilter || new Date(thoiHan) <= new Date(thoiHanFilter);
      if (tenMonMatch && thoiHanMatch) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  };

  const resetFilter = () => {
    setTenMonFilter('');
    setThoiHanFilter('');
    filterTable();
  };

  if (isLoading) return <div className="text-center my-5"><div className="spinner-border" role="status"><span className="visually-hidden">Đang tải...</span></div></div>;
  if (error) return <div className="alert alert-danger">Lỗi: {error}</div>;

  // Cập nhật hàm filter thông báo công việc sắp đến hạn trong 3 ngày
const filterUpcomingTasks = () => {
  const now = new Date();
  const threeDaysLater = new Date(now);
  threeDaysLater.setDate(now.getDate() + 3); // Lấy ngày hiện tại + 3 ngày

  // Lọc các công việc có Thời hạn trong vòng 3 ngày
  return vieccanlam.filter((viec) => {
    const thoiHan = new Date(viec.ThoiHan);
    return thoiHan >= now && thoiHan <= threeDaysLater;
  });
};

const upcomingTasks = filterUpcomingTasks();

return (
  <Layout>
    <div className="container py-4">
      <h2 className="mb-4 text-center">Danh sách việc cần làm</h2>

      {/* Hiển thị bảng thông báo công việc sắp đến hạn */}
      {upcomingTasks.length > 0 && (
        <div className="alert alert-warning alert-dismissible fade show mt-4" role="alert">
          <h4 className="alert-heading">Công việc sắp đến hạn</h4>
          <ul>
            {upcomingTasks.map((viec) => (
              <li key={viec.MaViec}>
                <strong>{viec.TenMon}</strong>: {viec.NhacNho} (Thời hạn: {formatDate(viec.ThoiHan)})
              </li>
            ))}
          </ul>
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      {/* Phần còn lại của code (bảng danh sách công việc) */}
      <button type="button" className="btn btn-success" onClick={handleOpenAddModal}>
        <i className="bi bi-plus-circle me-2"></i>Thêm Việc
      </button>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} aria-label="Close"></button>
        </div>
      )}

      {/* Phần lọc */}
      <div className="d-flex mb-3">
        <select
          id="tenMonFilter"
          className="form-control me-2"
          value={tenMonFilter}
          onChange={(e) => setTenMonFilter(e.target.value)}
        >
          <option value="">Lọc theo môn học</option>
          {monhoc.map(mon => (
            <option key={mon.MaMonHoc} value={mon.TenMon.toLowerCase()}>
              {mon.TenMon}
            </option>
          ))}
        </select>
        <input
          id="thoiHanFilter"
          type="date"
          className="form-control"
          value={thoiHanFilter}
          onChange={(e) => setThoiHanFilter(e.target.value)}
        />
        <button className="btn btn-secondary ms-2" onClick={resetFilter}>Reset</button>
        <button className="btn btn-primary ms-2" onClick={filterTable}>Xác nhận</button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Danh sách công việc</h5>
          </div>
          <div className="table-responsive">
            <table id="viecTable" className="table table-hover table-striped">
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
                    <tr key={viec.MaViec} data-tenmon={viec.TenMon.toLowerCase()} data-thoihan={viec.ThoiHan}>
                      <td>{viec.TenMon}</td>
                      <td>{viec.NhacNho}</td>
                      <td>{viec.GhiChu}</td>
                      <td>{formatDate(viec.ThoiHan)}</td>
                      <td>
                        <button className="btn btn-warning me-2" onClick={() => handleEditViec(viec)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDeleteViec(viec.MaViec)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">Không có công việc nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa việc */}
      <div className="modal fade" id="themViecModal" tabIndex="-1" aria-labelledby="themViecModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="themViecModalLabel">Thêm/Sửa Việc</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Hiển thị lỗi nếu có */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleAddOrUpdateViec}>
                <div className="mb-3">
                  <label htmlFor="NhacNho" className="form-label">Nhắc nhở</label>
                  <input
                    type="text"
                    className="form-control"
                    id="NhacNho"
                    name="NhacNho"
                    value={formData.NhacNho}
                    onChange={handleInputChange} required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="GhiChu" className="form-label">Ghi chú</label>
                  <textarea
                    className="form-control"
                    id="GhiChu"
                    name="GhiChu"
                    value={formData.GhiChu}
                    onChange={handleInputChange} required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="ThoiHan" className="form-label">Thời hạn</label>
                  <input
                    type="date"
                    className="form-control"
                    id="ThoiHan"
                    name="ThoiHan"
                    value={formData.ThoiHan}
                    onChange={handleInputChange} required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="MaMonHoc" className="form-label">Môn học</label>
                  <select
                    className="form-control"
                    id="MaMonHoc"
                    name="MaMonHoc"
                    value={formData.MaMonHoc}
                    onChange={handleInputChange} required
                  >
                    <option value="">Chọn môn học</option>
                    {monhoc.map((mon) => (
                      <option key={mon.MaMonHoc} value={mon.MaMonHoc}>
                        {mon.TenMon}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                  <button type="submit" className="btn btn-primary">{selectedViec ? 'Cập nhật' : 'Thêm'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);
}

export default VCL;
