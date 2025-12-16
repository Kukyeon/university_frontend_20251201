import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useModal } from "../ModalContext";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchDept, setSearchDept] = useState("");
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false); // 추가
  const { showModal } = useModal();
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
      setStudents([]);
      showModal({
        type: "alert",
        message: "학생 목록을 불러오는데 실패했습니다.",
      });
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
    } catch (err) {
      setStudents([]);
      showModal({
        type: "alert",
        message: "학생 목록을 불러오는데 실패했습니다.",
      });
    }
  };
  const handleUpdateGrades = async () => {
    setLoading(true);
    try {
      await api.get("/staff/list/student/update"); // 스프링 컨트롤러 매핑
      showModal({
        type: "alert",
        message: "전체 학생 학기 업데이트를 완료하였습니다.",
      });
      getList(); // 갱신 후 리스트 새로 조회
    } catch (err) {
      console.error(err);
      showModal({
        type: "alert",
        message: "학기 업데이트에 실패했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h3>학생 명단 조회</h3>
      <div className="filter-container">
        <div className="form-row">
          <input
            type="text"
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
            placeholder="학과 번호"
          />

          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="학번"
          />
          <button onClick={getSerchList} className="search-btn">
            조회
          </button>
          <button onClick={handleUpdateGrades} disabled={loading}>
            {loading ? "업데이트 중..." : "새학기 적용"}
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
