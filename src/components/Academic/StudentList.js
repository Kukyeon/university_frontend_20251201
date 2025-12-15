import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchDept, setSearchDept] = useState("");
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false); // 추가
  const [updateMessage, setUpdateMessage] = useState(""); // 추가

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
  const handleUpdateGrades = async () => {
    setLoading(true);
    setUpdateMessage("");
    try {
      await api.get("/staff/list/student/update"); // 스프링 컨트롤러 매핑
      setUpdateMessage("전체 학생 학년/학기 업데이트 완료!");
      getList(); // 갱신 후 리스트 새로 조회
    } catch (err) {
      console.error(err);
      setUpdateMessage("업데이트 실패!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h3>학생 명단 조회</h3>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleUpdateGrades} disabled={loading}>
          {loading ? "업데이트 중..." : "새학기 적용"}
        </button>
        {updateMessage && (
          <span style={{ marginLeft: "1rem" }}>{updateMessage}</span>
        )}
      </div>
      <div className="filter-container">
        <div className="department-form">
          <label>학과 번호:</label>
          <input
            type="text"
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
          />

          <label>학번:</label>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={getSerchList} className="search-btn">
            조회
          </button>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="course-table">
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
    </>
  );
};

export default StudentList;
