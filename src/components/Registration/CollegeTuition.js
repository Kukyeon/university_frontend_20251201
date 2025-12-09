import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";

const CollegeTuition = () => {
  const [colleges, setColleges] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [form, setForm] = useState({
    collegeId: "",
    amount: "",
  });

  useEffect(() => {
    getColleges();
  }, []);

  const getColleges = async () => {
    try {
      const res = await api.get("/admin/tuition");
      console.log(res);
      setColleges(res.data || []);
    } catch (err) {
      console.log(err);
      alert("단과대 목록 조회 실패");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      await api.post("/admin/tuition", form);
      alert("등록금 등록 완료");
      setShowAddForm(false);
      setForm({ collegeId: "", amount: "" });
      getColleges();
    } catch (err) {
      console.log(err);
      alert("등록 실패");
    }
  };

  const handleEdit = async () => {
    if (!form.collegeId) {
      alert("수정할 항목을 선택해주세요");
      return;
    }
    try {
      await api.put(`/admin/tuition`, form);
      alert("수정 완료");
      setShowEditForm(false);
      getColleges();
    } catch (err) {
      console.log(err);
      alert("수정 실패");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/tuition/${id}`);
      alert("삭제 완료");
      getColleges();
    } catch (err) {
      console.log(err);
      alert("삭제 실패");
    }
  };

  const selectToEdit = (item) => {
    if (!item) return;
    setForm({
      collegeId: Number(item.collegeId),
      amount: item.amount || "",
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  return (
    <div className="mypage-card course-form">
      <h2>단대별 등록금 관리</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setShowEditForm(false);
          }}
        >
          등록
        </button>
        <button
          onClick={() => {
            setShowEditForm(!showEditForm);
            setShowAddForm(false);
          }}
        >
          수정
        </button>
      </div>

      {/* 등록 폼 */}
      {showAddForm && (
        <div className="form-row">
          <select
            name="collegeId"
            value={form.collegeId}
            onChange={handleChange}
          >
            <option value="">단과대 선택</option>
            {colleges.map((d) => (
              <option key={d.collegeId} value={d.collegeId}>
                {d.collegeName} {d.amount == null ? "(미등록)" : ""}
              </option>
            ))}
          </select>
          <input
            name="amount"
            placeholder="등록금 입력"
            value={form.amount}
            onChange={handleChange}
          />
          <button onClick={handleAdd}>등록</button>
        </div>
      )}

      {/* 수정 폼 */}
      {showEditForm && (
        <div className="form-row">
          <select
            value={form.collegeId || ""}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedCollege = colleges.find(
                (d) => d.collegeId === selectedId
              );
              if (selectedCollege) selectToEdit(selectedCollege);
            }}
          >
            <option value="">항목 선택</option>
            {colleges.map((d) => (
              <option key={d.collegeId} value={d.collegeId}>
                {d.collegeId} - {d.collegeName}
              </option>
            ))}
          </select>

          <input name="amount" value={form.amount} onChange={handleChange} />
          <button onClick={handleEdit}>수정</button>
        </div>
      )}

      {/* 테이블 */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>단과대</th>
            <th>등록금</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {colleges.map((d) => (
            <tr key={d.collegeId}>
              <td>{d.collegeId}</td>
              <td>{d.collegeName}</td>
              <td>
                {d.amount != null ? d.amount.toLocaleString() + "원" : "미등록"}
              </td>
              <td>
                {d.amount && (
                  <button onClick={() => handleDelete(d.collegeId)}>
                    삭제
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeTuition;
