import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "../../utils/axios";

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const TKB = () => {
  const [tkbs, setTkbs] = useState([]);
  const [monHocs, setMonHocs] = useState([]);
  const [formData, setFormData] = useState({ Thu: "", MonHoc: "", ThoiGianHoc: "" });
  const [refresh, setRefresh] = useState(false);

  const thoiGianSet = [...new Set(tkbs.map(t => t.ThoiGianHoc))].sort();

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
    axios.post("/api/thoikhoabieu/", formData)
      .then(() => {
        setFormData({ Thu: "", MonHoc: "", ThoiGianHoc: "" });
        setRefresh(prev => !prev);
      })
      .catch(err => alert(err.response?.data?.error || "Có lỗi xảy ra!"));
  };

  const handleDeleteMon = (idtkb) => {
    axios.delete(`/api/thoikhoabieu/${idtkb}/delete_subject/`)
      .then(() => setRefresh(prev => !prev))
      .catch(err => alert("Xóa thất bại"));
  };

  return (
    <Layout>
      <h2 className="mb-4">Thời Khóa Biểu</h2>

      {/* Form thêm */}
      <form onSubmit={handleSubmit} className="row mb-4">
        <div className="col">
          <select className="form-control" value={formData.MonHoc} onChange={e => setFormData({ ...formData, MonHoc: e.target.value })} required>
            <option value="">Chọn môn học</option>
            {monHocs.map(mon => (
              <option key={mon.TenMon} value={mon.TenMon}>{mon.TenMon}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <select className="form-control" value={formData.Thu} onChange={e => setFormData({ ...formData, Thu: e.target.value })} required>
            <option value="">Chọn thứ</option>
            {days.map(thu => (
              <option key={thu} value={thu}>{thu}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <input type="text" className="form-control" placeholder="08:00 - 10:00" value={formData.ThoiGianHoc} onChange={e => setFormData({ ...formData, ThoiGianHoc: e.target.value })} required />
        </div>
        <div className="col">
          <button type="submit" className="btn btn-success">Thêm</button>
        </div>
      </form>

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
                        {mon.MonHoc}
                        <button onClick={() => handleDeleteMon(mon.IDTKB)} className="btn btn-sm btn-danger ml-2">Xóa</button>
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
