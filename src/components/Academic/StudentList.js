import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchDept, setSearchDept] = useState("");
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    try {
      const res = await api.get("/staff/list/student");
      const data =
        res.data.content || (Array.isArray(res.data) ? res.data : [res.data]);
      setStudents(data);
    } catch (err) {
      console.error(err);
      setStudents([]);
      alert("전체 학생 목록 조회 실패");
    }
  };
  const getSerchList = async () => {
    try {
      const params = {};
      if (searchDept) params.deptId = searchDept;
      if (searchId) params.studentId = searchId;

      const res = await api.get("/staff/list/student", { params });
      setStudents(
        res.data.content || (Array.isArray(res.data) ? res.data : [res.data])
      ); // PageResponse 구조면 content 사용
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setStudents([]);
      alert("학생 목록 조회 실패");
    }
  };
  return (
    <div className="mypage-card">
      <h3>학생 명단 조회</h3>
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
          학번:
          <input
            type="text"
            className="academic-search-input"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </label>
        <button onClick={getSerchList} className="search-btn">
          조회
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>학번</th>
            <th>이름</th>
            <th>생년월일</th>
            <th>성별</th>
            <th>주소</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>학과번호</th>
            <th>학년</th>
            <th>입학일</th>
            <th>졸업일(예정)</th>
          </tr>
        </thead>
        <tbody>
          {students.length ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.birthDate}</td>
                <td>{student.gender}</td>
                <td>{student.address}</td>
                <td>{student.tel}</td>
                <td>{student.email}</td>
                <td>{student.department.id}</td>
                <td>{student.grade}</td>
                <td>{student.entranceDate}</td>
                <td>{student.graduationDate || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" style={{ textAlign: "center" }}>
                조회된 학생이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
