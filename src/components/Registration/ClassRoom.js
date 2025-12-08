import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const Classroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [colleges, setColleges] = useState([]);
  const [newCollegeId, setNewCollegeId] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const getColleges = async () => {
    const res = await api.get("/admin/college");
    setColleges(res.data);
  };

  useEffect(() => {
    getList();
    getColleges();
  }, []);

  const getList = async () => {
    try {
      const res = await api.get("/admin/room");
      const data =
        res.data.content || (Array.isArray(res.data) ? res.data : [res.data]);
      setClassrooms(data);
    } catch (err) {
      console.error(err);
      setClassrooms([]);
      alert("강의실 목록 조회 실패");
    }
  };

  const handleAddRoom = async () => {
    if (!newRoom || !newCollegeId)
      return alert("강의실명과 단과대를 선택하세요");
    try {
      await api.post("/admin/room", {
        id: newRoom,
        college: { id: newCollegeId },
      });
      alert(`${newRoom} 등록 완료!`);
      setNewRoom("");
      setNewCollegeId("");
      setShowAddForm(false);
      getList();
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await api.delete(`/admin/room/${id}`);
      alert("삭제 완료!");
      getList();
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  return (
    <div className="mypage-card">
      <h3>강의실 관리</h3>

      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <button onClick={() => setShowAddForm((prev) => !prev)}>등록</button>
      </div>

      {showAddForm && (
        <div className="department-form" style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="강의실을 입력해주세요"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
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
          <button onClick={handleAddRoom}>등록</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>강의실</th>
            <th>단과대ID</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((room) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.college.name}</td>
              <td>
                <button onClick={() => handleDeleteRoom(room.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Classroom;
