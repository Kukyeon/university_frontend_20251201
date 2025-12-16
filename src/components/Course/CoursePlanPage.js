import React, { useState, useEffect } from "react";
import { courseApi } from "../../api/gradeApi";

const CoursePlanPage = ({ role, show, onClose, subjectId }) => {
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);

  // 로그인한 유저 역할 확인 (수정 버튼 표시용)
  // 실제로는 JWT 토큰 파싱이나 Context에서 가져오는 것이 좋음
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await courseApi.getSyllabus(subjectId);
        setSyllabus(res.data);
      } catch (err) {
        setSyllabus(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [subjectId]);

  if (!show) return null;

  if (loading) {
    return (
      <div className="break-modal-overlay">
        <div className="break-modal-content">로딩중...</div>
      </div>
    );
  }

  if (!syllabus) return null;

  return (
    <div className="break-modal-overlay">
      <div className="break-modal-content">
        <button className="break-modal-close" onClick={onClose}>
          ×
        </button>
        <h3>강의 계획서 조회</h3>
        <table className="break-modal-table">
          <tbody>
            <tr>
              <td>수업 번호</td>
              <td>{syllabus.subjectId}</td>
              <td>교과목 명</td>
              <td>{syllabus.name}</td>
            </tr>
            <tr>
              <td>수업 연도</td>
              <td>{syllabus.subYear}</td>
              <td>수업 학기</td>
              <td>{syllabus.semester}</td>
            </tr>
            <tr>
              <td>학점</td>
              <td>{syllabus.grades}</td>
              <td>이수 구분</td>
              <td>{syllabus.type}</td>
            </tr>
            <tr>
              <td>강의 시간</td>
              <td>
                {syllabus.subDay} {syllabus.startTime}:00 - {syllabus.endTime}
                :00
              </td>
              <td>강의실</td>
              <td>
                {syllabus.roomId} ({syllabus.collegeName})
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        {/* === 테이블 2: 교강사 정보 === */}
        <table>
          <tbody>
            <tr>
              <td>소속</td>
              <td>{syllabus.deptName}</td>
              <td>성명</td>
              <td>{syllabus.professorName}</td>
            </tr>
            <tr>
              <td>연락처</td>
              <td>{syllabus.tel || "-"}</td>
              <td>email</td>
              <td>{syllabus.email || "-"}</td>
            </tr>
          </tbody>
        </table>
        <br />

        {/* === 테이블 3: 상세 정보 === */}
        <table>
          <tbody>
            <tr>
              <td>강의 개요</td>
              <td>
                {/* 줄바꿈 처리를 위해 pre-wrap 사용 */}
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {syllabus.overview}
                </div>
              </td>
            </tr>
            <tr>
              <td>강의 목표</td>
              <td>
                <div>{syllabus.objective}</div>
              </td>
            </tr>
            <tr>
              <td>교재 정보</td>
              <td>{syllabus.textbook}</td>
            </tr>
            <tr>
              <td>주간 계획</td>
              <td>
                <div>{syllabus.program}</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 교수님일 경우 수정 버튼 표시 */}
        {role === "professor" && (
          <div>
            <button onClick={() => alert("수정 페이지로 이동")}>
              수정하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlanPage;
