import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";

const Course = () => {
  const [subjects, setSubjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // 입력 폼 state
  const [form, setForm] = useState({
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getSubjects();
  }, []);

  const getSubjects = async () => {
    try {
      const res = await api.get("/admin/subject");
      const data = Array.isArray(res.data) ? res.data : res.data.content;
      setSubjects(data || []);
    } catch (err) {
      console.log(err);
      alert("강의 목록 조회 실패");
    }
  };

  const handleAdd = async () => {
    try {
      await api.post("/admin/subject", form);
      alert("강의 등록 완료");
      setShowAddForm(false);
      setForm({
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
      getSubjects(); // 삭제 후 리스트 갱신
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };
  const handleEdit = async (id) => {
    if (!form.id) {
      alert("수정할 강의를 선택해주세요");
      return;
    }
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
  const selectSubjectToEdit = (sub) => {
    setForm({
      id: sub.id,
      name: sub.name,
      professorId: sub.professorId,
      roomId: sub.roomId,
      deptId: sub.deptId,
      type: sub.type,
      subYear: sub.subYear,
      semester: sub.semester,
      subDay: sub.subDay,
      startTime: sub.startTime,
      endTime: sub.endTime,
      grades: sub.grades,
      capacity: sub.capacity,
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };
  console.log(subjects);
  return (
    <div className="mypage-card course-form">
      <h2>강의 관리</h2>

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
        <div style={{ marginBottom: "20px" }}>
          <div className="form-row">
            <input name="name" placeholder="강의명" onChange={handleChange} />
            <input
              name="professorId"
              placeholder="교수 ID"
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              name="roomId"
              placeholder="강의실 ID"
              onChange={handleChange}
            />
            <input
              name="deptId"
              placeholder="학과 ID"
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <select name="type" onChange={handleChange}>
              <option value="">구분</option>
              <option value="전공">전공</option>
              <option value="교양">교양</option>
            </select>
            <input name="subYear" placeholder="연도" onChange={handleChange} />
            <input name="semester" placeholder="학기" onChange={handleChange} />
          </div>
          <div className="form-row time-row">
            <select
              name="subDay"
              onChange={handleChange}
              value={form.subDay || ""}
            >
              <option value="">요일 선택</option>
              <option value="월">월</option>
              <option value="화">화</option>
              <option value="수">수</option>
              <option value="목">목</option>
              <option value="금">금</option>
            </select>
            <input
              name="startTime"
              type="number"
              placeholder="시작 시간 (9~18)"
              min="9"
              max="18"
              value={form.startTime || ""}
              onChange={handleChange}
            />
            <input
              name="endTime"
              type="number"
              placeholder="종료 시간 (9~18)"
              min="9"
              max="18"
              value={form.endTime || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              name="grades"
              placeholder="이수학점"
              onChange={handleChange}
            />
            <input name="capacity" placeholder="정원" onChange={handleChange} />
          </div>
          <button onClick={handleAdd}>등록</button>
        </div>
      )}
      {/* 수정 폼 */}
      {showEditForm && (
        <div style={{ marginBottom: "20px" }}>
          <div className="form-row">
            <select
              value={form.id}
              onChange={(e) =>
                selectSubjectToEdit(
                  subjects.find((s) => s.id === e.target.value)
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
              name="startTime"
              type="number"
              min="9"
              max="18"
              placeholder="시작 시간"
              value={form.startTime}
              onChange={handleChange}
            />
            <input
              name="endTime"
              type="number"
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
          <button onClick={handleEdit}>수정</button>
        </div>
      )}
      {/* 테이블 */}
      <table>
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
            <tr key={sub?.id}>
              <td>{sub?.id}</td>
              <td>{sub?.name}</td>
              <td>{sub?.professorId}</td>
              <td>{sub?.roomId}</td>
              <td>{sub?.deptId}</td>
              <td>{sub?.type}</td>
              <td>{sub?.subYear}</td>
              <td>{sub?.semester}</td>
              <td>
                {sub.subDay} {sub.startTime}
                {":00 ~ "}
                {sub.endTime}
                {":00"}
              </td>
              <td>{sub.grades}</td>
              <td>{sub.capacity}</td>
              <td>{sub.numOfStudent}</td>
              <td>
                <button onClick={() => handleDelete(sub.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Course;
