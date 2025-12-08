import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const ProfessorList = () => {
  const [professors, setProfessors] = useState([]);
  const [searchDept, setSearchDept] = useState("");
  const [searchId, setSearchId] = useState("");

  const filteredProfessors = professors.filter(
    (p) =>
      (!searchDept || p.departmentNo.toString().includes(searchDept)) &&
      (!searchId || p.id.toString().includes(searchId))
  );
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      const params = {};
      if (searchDept) params.deptId = searchDept;
      if (searchId) params.studentId = searchId;

      const res = await api.get("/staff/list/professor", { params });
      setProfessors(
        res.data.content || (Array.isArray(res.data) ? res.data : [res.data])
      ); // PageResponse 구조면 content 사용
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setProfessors([]);
      alert("교수 목록 조회 실패");
    }
  };
  return (
    <div className="mypage-card">
      <h3>교수 명단 조회</h3>
      <div className="academic-search-wrapper">
        <label className="academic-search-label">
          학과 번호:
          <input
            type="text"
            className="academic-search-input"
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
          />
        </label>
        <label className="academic-search-label">
          사번:
          <input
            type="text"
            className="academic-search-input"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </label>
        <button onClick={getList} className="search-btn">
          조회
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>사번</th>
            <th>이름</th>
            <th>생년월일</th>
            <th>성별</th>
            <th>주소</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>학과번호</th>
            <th>고용일</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfessors.length ? (
            filteredProfessors.map((prof) => (
              <tr key={prof.id}>
                <td>{prof.id}</td>
                <td>{prof.name}</td>
                <td>{prof.birthDate}</td>
                <td>{prof.gender}</td>
                <td>{prof.address}</td>
                <td>{prof.tel}</td>
                <td>{prof.email}</td>
                <td>{prof.department.id}</td>
                <td>{prof.hireDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                조회된 교수가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessorList;
