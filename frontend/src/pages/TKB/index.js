import React, { useEffect, useState, useContext } from "react";
import Layout from "../../components/Layout";
import axios from "../../utils/axios";
import { UserContext } from "../../contexts/UserContext";

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const TKB = () => {
  const { user } = useContext(UserContext);
  const [tkbs, setTkbs] = useState([]);
  const [monHocs, setMonHocs] = useState([]);
  const [formData, setFormData] = useState({ Thu: "", MonHoc: "", ThoiGianHoc: "" });
  const [refresh, setRefresh] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const parseStartTime = (str) => {
    if (!str) return 0;
  
    // Trường hợp "7h-8h"
    if (str.includes("h")) {
      const match = str.match(/^(\d{1,2})h/);
      return match ? parseInt(match[1], 10) : 0;
    }
  
    // Trường hợp "08:00 - 10:30"
    const match = str.match(/^(\d{1,2}):(\d{2})/);
    if (match) {
      const [_, hour, minute] = match;
      return parseInt(hour, 10) + parseInt(minute, 10) / 60;
    }
  
    return 0;
  };
  
  const thoiGianSet = [...new Set(tkbs.map(t => t.ThoiGianHoc))].sort(
    (a, b) => parseStartTime(a) - parseStartTime(b)
  );
  
  
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // hoặc 'error'


  useEffect(() => {
    axios.get("/api/thoikhoabieu/")
      .then(res => setTkbs(res.data))
      .catch(err => console.error(err));

    axios.get("/api/monhoc/")
      .then(res => setMonHocs(res.data))
      .catch(err => console.error(err));
  }, [refresh]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = isEditing
      ? axios.put(`/api/thoikhoabieu/${editId}/`, formData)
      : axios.post("/api/thoikhoabieu/", formData);

    request
      .then(res => {
        setMessage(res.data.message);         
        setMessageType("success");           
        resetForm();
        setShowModal(false);
        setRefresh(prev => !prev);
      })
      .catch(err => {
        setMessage(err.response?.data?.error || "Có lỗi xảy ra!");
        setMessageType("error");
      });
  };
  
  

  const resetForm = () => {
    setFormData({ Thu: "", MonHoc: "", ThoiGianHoc: "" });
    setIsEditing(false);
    setEditId(null);
  };

  const handleDeleteMon = (idtkb) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch học này?")) {
      axios.delete(`/api/thoikhoabieu/${idtkb}/`)
        .then(res => {
          setMessage(res.data.message);       // ✅ set thông báo
          setMessageType("success");
          setRefresh(prev => !prev);
        })
        .catch(err => {
          setMessage(err.response?.data?.error || "Xóa thất bại");
          setMessageType("error");
        });
    }
  };
  
  
  

  const handleEditMon = (tkb) => {
    setFormData({
      Thu: tkb.Thu,
      MonHoc: tkb.MonHoc,
      ThoiGianHoc: tkb.ThoiGianHoc,
    });
    setIsEditing(true);
    setEditId(tkb.IDTKB);
    setShowModal(true);
  };
  const handleDeleteAll = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ thời khóa biểu?")) {
      axios.delete("/api/thoikhoabieu/delete_all/")
        .then(res => {
          setMessage(res.data.message);       // ✅ set thông báo
          setMessageType("success");
          setRefresh(prev => !prev);
        })
        .catch(err => {
          setMessage("Xóa thất bại: " + (err.response?.data?.error || "Lỗi không xác định"));
          setMessageType("error");
        });
    }
  };
  return (
    <Layout>
      <center><h2 className="mb-4">Thời Khóa Biểu</h2></center>
      
          {message && (
          <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} mt-2`} role="alert">
            {message}
          </div>
    )}

      <button className="btn btn-success" onClick={() => setShowModal(true)}>
      <i className="bi bi-plus-circle me-2"></i>
        Thêm mới
      </button>
      <button className="btn btn-danger " onClick={handleDeleteAll}>
  Xóa toàn bộ
</button>

      {/* Modal */}
      {showModal && (
         <div
    className="modal d-block"
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    onClick={(e) => {
      if (e.target.classList.contains("modal")) {
        setShowModal(false);
        setFormData({ Thu: "", MonHoc: "", ThoiGianHoc: "" });
        setIsEditing(false);
        setEditId(null);
      }
    }}
  >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? "Chỉnh sửa" : "Thêm mới"} Thời khóa biểu</h5>
                  <button type="button" className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Môn học</label>
                    <select className="form-control" value={formData.MonHoc} onChange={e => setFormData({ ...formData, MonHoc: e.target.value })} required>
                      <option value="">Chọn môn học</option>
                      {monHocs.map(mon => (
                        <option key={mon.MaMonHoc} value={mon.MaMonHoc}>{mon.TenMon}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Thứ</label>
                    <select className="form-control" value={formData.Thu} onChange={e => setFormData({ ...formData, Thu: e.target.value })} required>
                      <option value="">Chọn thứ</option>
                      {days.map(thu => (
                        <option key={thu} value={thu}>{thu}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Thời gian học</label>
                    <input type="text" className="form-control" placeholder="08:00 - 10:00" value={formData.ThoiGianHoc} onChange={e => setFormData({ ...formData, ThoiGianHoc: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className={`btn ${isEditing ? "btn-warning" : "btn-success"}`}>
                    {isEditing ? "Cập nhật" : "Thêm"}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bảng TKB */}
      <table className="table table-bordered table-striped">
        <thead className="table-primary">
          <tr>
            <th>Thời gian</th>
            {days.map(thu => <th key={thu}>{thu}</th>)}
          </tr>
        </thead>
        <tbody>
          {thoiGianSet.map(tg => (
            <tr key={tg}>
              <td className="table-warning">{tg}</td>
              {days.map(thu => {
                const mon = tkbs.find(t => t.Thu === thu && t.ThoiGianHoc === tg);
                return (
                  <td key={thu}>
                    {mon ? (
                      <>
                        <strong>
                          {(monHocs.find(m => m.MaMonHoc === mon.MonHoc) || {}).TenMon || mon.MonHoc}
                        </strong>
                        <div className="mt-1">
                          <button className="btn btn-warning me-2" onClick={() => handleEditMon(mon)} ><i className="bi bi-pencil"></i>  </button>
                          <button className="btn btn-danger" onClick={() => handleDeleteMon(mon.IDTKB)} ><i className="bi bi-trash"></i></button>
                        </div>
                      </>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default TKB;
