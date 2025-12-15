import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState("");
  const [newCollegeId, setNewCollegeId] = useState("");
  const [editDeptId, setEditDeptId] = useState("");
  const [editDeptName, setEditDeptName] = useState("");
  const [colleges, setColleges] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    getColleges();
    getList();
  }, []);

  const getColleges = async () => {
    const res = await api.get("/admin/college");
    setColleges(res.data);
  };
  useEffect(() => {
    getColleges();
  }, []);
  const getList = async () => {
    try {
      const res = await api.get("/admin/department");
      const data =
        res.data.content || (Array.isArray(res.data) ? res.data : [res.data]);
      setDepartments(data);
    } catch (err) {
      console.error(err);
      setDepartments([]);
      alert("단과대학 목록 조회 실패");
    }
  };
  const handleAddDepartment = async () => {
    if (!newDeptName) return;
    try {
      const res = await api.post("/admin/department", {
        name: newDeptName,
        college: { id: Number(newCollegeId) },
      });
      alert(`${newDeptName} 등록 완료!`);
      setNewDeptName("");
      setNewCollegeId("");
      setShowAddForm(false);
      getList(); // 등록 후 리스트 갱신
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await api.delete(`/admin/department/${id}`);
      alert("삭제 완료!");
      getList(); // 삭제 후 리스트 갱신
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };
  const handleEditDepartment = async () => {
    if (!editDeptId || !editDeptName)
      return alert("변경할 학과명을 입력해주세요");
    try {
      await api.put(`/admin/department/${editDeptId}`, { name: editDeptName });
      alert("수정 완료!");
      setEditDeptId("");
      setEditDeptName("");
      setShowEditForm(false);
      getList();
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };
  return (
    <>
      <h3>학과 관리</h3>
      {/* 버튼 */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <button
          onClick={() => {
            setShowAddForm((prev) => !prev);
            setShowEditForm(false); // 수정 폼은 닫음
          }}
        >
          등록
        </button>
        <button
          onClick={() => {
            setShowEditForm((prev) => !prev);
            setShowAddForm(false); // 등록 폼은 닫음
          }}
        >
          수정
        </button>
      </div>
      {/* 등록 폼 */}
      {showAddForm && (
        <div className="department-form" style={{ marginBottom: "15px" }}>
          등록하기
          <input
            type="text"
            placeholder="학과를 입력해주세요"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
          />
          <select
            value={newCollegeId}
            onChange={(e) => setNewCollegeId(e.target.value)}
          >
            <option value="">단과대 선택</option>
            {colleges.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddDepartment}>등록</button>
        </div>
      )}

      {/* 수정 폼 */}
      {showEditForm && (
        <div className="department-form" style={{ marginBottom: "15px" }}>
          수정하기
          <select
            value={editDeptId}
            onChange={(e) => setEditDeptId(e.target.value)}
          >
            <option value="">수정할 학과 선택</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name} ({dept.college.name})
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="변경할 학과명을 입력하세요"
            value={editDeptName}
            onChange={(e) => setEditDeptName(e.target.value)}
          />
          <button onClick={handleEditDepartment}>수정</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>학과명</th>
            <th>단과대ID</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              <td>{dept.id}</td>
              <td>{dept.name}</td>
              <td>{dept.college.name}</td>
              <td>
                <button onClick={() => handleDeleteDepartment(dept.id)}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Department;
