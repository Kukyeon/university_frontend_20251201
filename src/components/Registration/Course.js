import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";

const Course = () => {
  const [subjects, setSubjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    professorId: "",
    roomId: "",
    deptId: "",
    type: "",
    subYear: "",
    semester: "",
    subDay: "",
    startTime: "",
    endTime: "",
    grades: "",
    capacity: "",
  });

  useEffect(() => {
    getSubjects();
  }, []);

  const getSubjects = async () => {
    try {
      const res = await api.get("/admin/subject");
      const data = Array.isArray(res.data) ? res.data : res.data.content;
      setSubjects(data || []);
    } catch (err) {
      console.error(err);
      alert("강의 목록 조회 실패");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      await api.post("/admin/subject", form);
      alert("강의 등록 완료");
      setShowAddForm(false);
      setForm({
        id: "",
        name: "",
        professorId: "",
        roomId: "",
        deptId: "",
        type: "",
        subYear: "",
        semester: "",
        subDay: "",
        startTime: "",
        endTime: "",
        grades: "",
        capacity: "",
      });
      getSubjects();
    } catch (err) {
      alert("등록 실패");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/subject/${id}`);
      alert("삭제 완료!");
      getSubjects();
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  const selectSubjectToEdit = (sub) => {
    setForm({ ...sub });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleEdit = async () => {
    try {
      await api.put(`/admin/subject/${form.id}`, form);
      alert("수정 완료!");
      setShowEditForm(false);
      getSubjects();
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

  return (
    <div>
      <h3>강의 관리</h3>

      <div className="form-actions" style={{ marginBottom: "15px" }}>
        <button
          className="primary-btn"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setShowEditForm(false);
          }}
        >
          등록
        </button>
        <button
          className="primary-btn"
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
        <div className="course-form">
          <div className="form-row">
            <input
              name="name"
              placeholder="강의명"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="professorId"
              placeholder="교수 ID"
              value={form.professorId}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              name="roomId"
              placeholder="강의실 ID"
              value={form.roomId}
              onChange={handleChange}
            />
            <input
              name="deptId"
              placeholder="학과 ID"
              value={form.deptId}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="">구분</option>
              <option value="전공">전공</option>
              <option value="교양">교양</option>
            </select>
            <input
              name="subYear"
              placeholder="연도"
              value={form.subYear}
              onChange={handleChange}
            />
            <input
              name="semester"
              placeholder="학기"
              value={form.semester}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <select name="subDay" value={form.subDay} onChange={handleChange}>
              <option value="">요일 선택</option>
              <option value="월">월</option>
              <option value="화">화</option>
              <option value="수">수</option>
              <option value="목">목</option>
              <option value="금">금</option>
            </select>
            <input
              type="number"
              name="startTime"
              min="9"
              max="18"
              placeholder="시작 시간"
              value={form.startTime}
              onChange={handleChange}
            />
            <input
              type="number"
              name="endTime"
              min="9"
              max="18"
              placeholder="종료 시간"
              value={form.endTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              name="grades"
              placeholder="이수학점"
              value={form.grades}
              onChange={handleChange}
            />
            <input
              name="capacity"
              placeholder="정원"
              value={form.capacity}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button className="primary-btn" onClick={handleAdd}>
              등록
            </button>
          </div>
        </div>
      )}

      {/* 수정 폼 */}
      {showEditForm && (
        <div className="course-form">
          <div className="form-row">
            <select
              value={form.id}
              onChange={(e) =>
                selectSubjectToEdit(
                  subjects.find((s) => s.id === Number(e.target.value))
                )
              }
            >
              <option value="">강의 선택</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.id} - {sub.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <input
              name="name"
              placeholder="강의명"
              value={form.name}
              onChange={handleChange}
            />
            <input
              name="roomId"
              placeholder="강의실 ID"
              value={form.roomId}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <select name="subDay" value={form.subDay} onChange={handleChange}>
              <option value="">요일 선택</option>
              <option value="월">월</option>
              <option value="화">화</option>
              <option value="수">수</option>
              <option value="목">목</option>
              <option value="금">금</option>
            </select>
            <input
              type="number"
              name="startTime"
              min="9"
              max="18"
              placeholder="시작 시간"
              value={form.startTime}
              onChange={handleChange}
            />
            <input
              type="number"
              name="endTime"
              min="9"
              max="18"
              placeholder="종료 시간"
              value={form.endTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              name="capacity"
              placeholder="정원"
              value={form.capacity}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button className="primary-btn" onClick={handleEdit}>
              수정
            </button>
          </div>
        </div>
      )}

      {/* 테이블 */}
      <div className="table-wrapper">
        <table className="course-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>강의명</th>
              <th>교수</th>
              <th>강의실</th>
              <th>학과</th>
              <th>구분</th>
              <th>연도</th>
              <th>학기</th>
              <th>시간</th>
              <th>학점</th>
              <th>정원</th>
              <th>신청인원</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.id}</td>
                <td>{sub.name}</td>
                <td>{sub.professorId}</td>
                <td>{sub.roomId}</td>
                <td>{sub.deptId}</td>
                <td>{sub.type}</td>
                <td>{sub.subYear}</td>
                <td>{sub.semester}</td>
                <td>
                  {sub.subDay} {sub.startTime}:00 ~ {sub.endTime}:00
                </td>
                <td>{sub.grades}</td>
                <td>{sub.capacity}</td>
                <td>{sub.numOfStudent}</td>
                <td>
                  <button
                    className="primary-btn"
                    onClick={() => handleDelete(sub.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Course;
