import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const College = () => {
  const [colleges, setColleges] = useState([]);
  const [newCollegeName, setNewCollegeName] = useState("");
  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    try {
      const res = await api.get("/admin/college");
      const data =
        res.data.content || (Array.isArray(res.data) ? res.data : [res.data]);
      setColleges(data);
    } catch (err) {
      console.error(err);
      setColleges([]);
      alert("단과대학 목록 조회 실패");
    }
  };
  const handleAddCollege = async () => {
    if (!newCollegeName) return;
    try {
      const res = await api.post("/admin/college", { name: newCollegeName });
      alert(`${newCollegeName} 등록 완료!`);
      setNewCollegeName("");
      getList(); // 등록 후 리스트 갱신
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };

  const handleDeleteCollege = async (id) => {
    try {
      await api.delete(`/admin/college/${id}`);
      alert("삭제 완료!");
      getList(); // 삭제 후 리스트 갱신
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  return (
    <div className="mypage-card">
      <h3>단과대학 관리</h3>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="신규 단과대학 이름"
          value={newCollegeName}
          onChange={(e) => setNewCollegeName(e.target.value)}
          style={{ width: "200px", marginRight: "8px" }}
        />
        <button onClick={handleAddCollege}>등록</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {colleges.map((college) => (
            <tr key={college.id}>
              <td>{college.id}</td>
              <td>{college.name}</td>
              <td>
                <button onClick={() => handleDeleteCollege(college.id)}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default College;
