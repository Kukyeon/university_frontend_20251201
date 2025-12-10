import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import ProfStudentGradeInput from "./ProfStudentGradeInput";

const CourseStudentList = ({ courseId, goBack }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadDummyStudents();
  }, []);

  //   const loadStudents = async () => {
  //     try {
  //       const res = await api.get(`/course/${courseId}/students`);
  //       setStudents(res.data);
  //     } catch (err) {
  //       console.error("학생 불러오기 실패", err);
  //       setStudents([]);
  //     }
  //   };
  const loadDummyStudents = () => {
    const dummy = [
      {
        studentId: "2023000011",
        name: "차은우",
        major: "전자공학과",
        absent: "",
        late: "",
        assignment: "",
        midterm: "",
        final: "",
        total: "",
      },
      {
        studentId: "2023000012",
        name: "박서준",
        major: "전자공학과",
      },
      {
        studentId: "2023000013",
        name: "이도윤",
        major: "전자공학과",
      },
      {
        studentId: "2023000014",
        name: "강민지",
        major: "전자공학과",
      },
      {
        studentId: "2023000015",
        name: "윤진희",
        major: "전자공학과",
      },
    ];

    setStudents(dummy);
  };
  // 🔥 기입 버튼 클릭 시
  const handleInputClick = (stu) => {
    setSelectedStudent(stu);
  };

  // 🔙 성적 입력 → 학생 리스트로 돌아가기
  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  return (
    <div>
      {/* 🔥 성적 기입 화면 */}
      {selectedStudent && (
        <ProfStudentGradeInput
          student={selectedStudent}
          courseId={courseId}
          goBack={handleBackToList}
        />
      )}

      {/* 🔥 학생 리스트 화면 */}
      {!selectedStudent && (
        <div className="student-list-container">
          <h2>학생 리스트 조회</h2>
          <button onClick={goBack}>← 강의 목록으로</button>

          <table className="student-table">
            <thead>
              <tr>
                <th>학생 번호</th>
                <th>이름</th>
                <th>소속</th>
                <th>결석</th>
                <th>지각</th>
                <th>과제점수</th>
                <th>중간시험</th>
                <th>기말시험</th>
                <th>환산점수</th>
                <th>점수 기입</th>
              </tr>
            </thead>

            <tbody>
              {students.map((stu) => (
                <tr key={stu.studentId}>
                  <td>{stu.studentId}</td>
                  <td>{stu.name}</td>
                  <td>{stu.major}</td>
                  <td>{stu.absent ?? ""}</td>
                  <td>{stu.late ?? ""}</td>
                  <td>{stu.assignment ?? ""}</td>
                  <td>{stu.midterm ?? ""}</td>
                  <td>{stu.final ?? ""}</td>
                  <td>{stu.total ?? ""}</td>
                  <td>
                    <button onClick={() => handleInputClick(stu)}>기입</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseStudentList;
