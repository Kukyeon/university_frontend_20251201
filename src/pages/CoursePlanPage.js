import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseApi } from '../api/gradeApi'; // api.js 경로 확인

const CoursePlanPage = () => {
  const { subjectId } = useParams();
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 로그인한 유저 역할 확인 (수정 버튼 표시용)
  // 실제로는 JWT 토큰 파싱이나 Context에서 가져오는 것이 좋음
  const userRole = localStorage.getItem("userRole"); // "PROFESSOR" or "STUDENT"

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await courseApi.getSyllabus(subjectId);
        setSyllabus(res.data);
      } catch (err) {
        alert("강의계획서 정보를 불러오지 못했습니다.");
        window.close();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [subjectId]);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>로딩중...</div>;
  if (!syllabus) return <div style={{textAlign:'center', marginTop:'50px'}}>데이터가 없습니다.</div>;

  return (
    <div style={styles.container}>
      {/* 헤더 탑 (남색 바) */}
      <header>
        <div style={styles.headerTop}></div>
      </header>

      <section style={{ padding: '20px' }}>
        <div style={styles.sectionHeader}>
          <h2>강의 계획서 조회</h2>
          <br />
        </div>

        {/* === 테이블 1: 교과목 정보 === */}
        <table border="1" style={styles.syllabusTable}>
          <colgroup>
            <col style={styles.col1} />
            <col style={styles.col2} />
            <col style={styles.col3} />
            <col style={styles.col4} />
            <col style={styles.col5} />
          </colgroup>
          <tbody>
            <tr>
              <td rowSpan="4" style={styles.tdHead}>교과목 정보</td>
              <td style={styles.tdLabel}>수업 번호</td>
              <td style={styles.tdContent}>{syllabus.subjectId}</td>
              <td style={styles.tdLabel}>교과목 명</td>
              <td style={styles.tdContent}>{syllabus.name}</td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>수업 연도</td>
              <td style={styles.tdContent}>{syllabus.subYear}</td>
              <td style={styles.tdLabel}>수업 학기</td>
              <td style={styles.tdContent}>{syllabus.semester}</td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>학점</td>
              <td style={styles.tdContent}>{syllabus.grades}</td>
              <td style={styles.tdLabel}>이수 구분</td>
              <td style={styles.tdContent}>{syllabus.type}</td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>강의 시간</td>
              <td style={styles.tdContent}>
                {syllabus.subDay} {syllabus.startTime}:00 - {syllabus.endTime}:00
              </td>
              <td style={styles.tdLabel}>강의실</td>
              <td style={styles.tdContent}>
                {syllabus.roomId} ({syllabus.collegeName})
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        {/* === 테이블 2: 교강사 정보 === */}
        <table border="1" style={styles.syllabusTable}>
          <colgroup>
            <col style={styles.col1} />
            <col style={styles.col2} />
            <col style={styles.col3} />
            <col style={styles.col4} />
            <col style={styles.col5} />
          </colgroup>
          <tbody>
            <tr>
              <td rowSpan="2" style={styles.tdHead}>교강사 정보</td>
              <td style={styles.tdLabel}>소속</td>
              <td style={styles.tdContent}>{syllabus.deptName}</td>
              <td style={styles.tdLabel}>성명</td>
              <td style={styles.tdContent}>{syllabus.professorName}</td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>연락처</td>
              <td style={styles.tdContent}>{syllabus.tel || "-"}</td>
              <td style={styles.tdLabel}>email</td>
              <td style={styles.tdContent}>{syllabus.email || "-"}</td>
            </tr>
          </tbody>
        </table>
        <br />

        {/* === 테이블 3: 상세 정보 === */}
        <table border="1" style={styles.syllabusTable}>
          <colgroup>
            <col style={{ width: '14%' }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td style={styles.tdLabel}>강의 개요</td>
              <td style={styles.alignLeft}>
                 {/* 줄바꿈 처리를 위해 pre-wrap 사용 */}
                 <div style={{whiteSpace: 'pre-wrap'}}>{syllabus.overview}</div>
              </td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>강의 목표</td>
              <td style={styles.alignLeft}>
                 <div style={{whiteSpace: 'pre-wrap'}}>{syllabus.objective}</div>
              </td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>교재 정보</td>
              <td style={styles.alignLeft}>{syllabus.textbook}</td>
            </tr>
            <tr>
              <td style={styles.tdLabel}>주간 계획</td>
              <td style={styles.alignLeft}>
                 <div style={{whiteSpace: 'pre-wrap'}}>{syllabus.program}</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* 교수님일 경우 수정 버튼 표시 */}
        {userRole === 'PROFESSOR' && (
          <div style={{ marginTop: '10px', textAlign: 'right', width: '800px', margin: '10px auto' }}>
            <button onClick={() => alert("수정 페이지로 이동")} style={styles.button}>
              수정하기
            </button>
          </div>
        )}

      </section>
    </div>
  );
};

// === CSS Styles (JSP의 style 태그 내용을 JS 객체로 변환) ===
const styles = {
  container: {
    fontFamily: "'Noto Sans KR', sans-serif",
    margin: '0 auto',
    padding: '0 auto',
  },
  headerTop: {
    width: '100%',
    height: '40px',
    backgroundColor: '#031734',
  },
  sectionHeader: {
    textAlign: 'center',
    marginTop: '20px',
  },
  syllabusTable: {
    width: '800px',
    borderCollapse: 'collapse',
    border: '1px solid black',
    margin: '0 auto', // 가운데 정렬
  },
  tdHead: {
    padding: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
  },
  tdLabel: {
    padding: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#fdfdfd',
  },
  tdContent: {
    padding: '4px',
    textAlign: 'center',
  },
  alignLeft: {
    textAlign: 'left',
    padding: '10px',
    verticalAlign: 'top',
    minHeight: '50px'
  },
  // 컬럼 너비
  col1: { width: '14%' },
  col2: { width: '13%' },
  col3: { width: '30%' },
  col4: { width: '13%' },
  col5: { width: '30%' },
  
  button: {
    padding: '5px 15px',
    background: '#031734',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default CoursePlanPage;