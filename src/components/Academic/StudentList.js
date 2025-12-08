import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

// const sampleStudents = [
//   {
//     id: "2023000001",
//     name: "박시우",
//     birthDate: "2002-06-19",
//     gender: "남성",
//     address: "부산시 남구",
//     tel: "010-5267-1815",
//     email: "psw@green.com",
//     departmentNo: "101",
//     grade: "1",
//     entranceDate: "2021-03-02",
//     graduationDate: "",
//   },
//   {
//     id: "2023000002",
//     name: "김예준",
//     birthDate: "2002-04-25",
//     gender: "남성",
//     address: "부산시 북구",
//     tel: "010-4152-9963",
//     email: "kyj@green.com",
//     departmentNo: "101",
//     grade: "1",
//     entranceDate: "2021-03-02",
//     graduationDate: "",
//   },
//   // 추가 학생 데이터 필요시 더 넣기
// ];

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchDept, setSearchDept] = useState("");
  const [searchId, setSearchId] = useState("");

  const filteredStudents = students.filter(
    (s) =>
      (!searchDept || s.departmentNo.toString().includes(searchDept)) &&
      (!searchId || s.id.toString().includes(searchId))
  );
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
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
        <button onClick={getList} className="search-btn">
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
          {filteredStudents.length ? (
            filteredStudents.map((student) => (
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
