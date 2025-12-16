import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courseApi } from '../api/gradeApi'; // api.js 경로 확인
import api from '../api/axiosConfig';

const CoursePlanPage = ({user, role}) => {
  const { subjectId } = useParams();
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);

  // 수정 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({}); // 입력 폼 데이터
  
  // 로그인한 유저 역할 확인 (수정 버튼 표시용)

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

 useEffect(() => {
    if(!loading && syllabus) {
        console.log("=== 권한 체크 디버깅 ===");
        console.log("받은 role:", role);
        console.log("받은 user:", user);
        console.log("강의 계획서 교수ID:", syllabus.professorId);
    }
  }, [loading, syllabus, user, role]);

 const canEdit = () => {
    // 1. 데이터가 없으면 false
    if (!syllabus || !user) return false;

    // 2. 역할 확인 (props로 받은 role 사용)
    // 문자열 비교 시 공백 제거 및 소문자 변환 등으로 안전하게 비교 추천
    if (String(role).trim() !== 'professor') {
        return false;
    }

    // 3. ID 비교
    // user 객체 구조가 { id: ... } 인지 { user: { id: ... } } 인지에 따라 다름
    // 안전하게 둘 다 체크 (user.id가 없으면 user.user.id 확인)
    const myId = user.id || (user.user && user.user.id);
    const profId = syllabus.professorId; // 혹은 syllabus.professorid (소문자 주의)

    if (!myId || !profId) return false;

    return Number(myId) === Number(profId);
  };

  // 2. 수정 버튼 클릭 시 -> 수정 모드 진입 및 데이터 복사
  const handleEditClick = () => {
    setFormData({
      overview: syllabus.overview || "",
      objective: syllabus.objective || "",
      textbook: syllabus.textbook || "",
      program: syllabus.program || "",
    });
    setIsEditing(true);
  };

  // 3. 취소 버튼 클릭 시 -> 수정 모드 해제
  const handleCancelClick = () => {
    if (window.confirm("수정을 취소하시겠습니까? 작성 중인 내용은 저장되지 않습니다.")) {
      setIsEditing(false);
    }
  };

  // 4. 입력 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 5. 저장 버튼 클릭 시 (API 호출)
  const handleSaveClick = async () => {
    if (!window.confirm("입력한 내용으로 강의계획서를 수정하시겠습니까?")) return;

    try {
      // Backend Controller: @PutMapping("/professor/subject/{subjectId}/syllabus")
      // DTO 구조에 맞춰서 데이터 전송
      await api.put(`/prof/subject/${subjectId}/syllabus`, {
        ...syllabus, // 기존 정보(강의명, 시간 등) 유지
        ...formData  // 수정된 정보(개요, 목표 등) 덮어쓰기
      });

      alert("성공적으로 수정되었습니다.");
      
      // 화면 갱신 (수정된 내용을 syllabus 상태에 반영)
      setSyllabus((prev) => ({ ...prev, ...formData }));
      setIsEditing(false);

    } catch (err) {
      console.error(err);
      // 백엔드에서 보낸 에러 메시지(403 등) 표시
      const msg = err.response?.data || "수정 중 오류가 발생했습니다.";
      alert(msg);
    }
  };

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

        {/* === 테이블 3: 상세 정보 (★ 수정 가능 영역) === */}
        <table border="1" style={styles.syllabusTable}>
          <colgroup>
            <col style={{ width: '14%' }} />
            <col />
          </colgroup>
          <tbody>
            {/* 강의 개요 */}
            <tr>
              <td style={styles.tdLabel}>강의 개요</td>
              <td style={styles.alignLeft}>
                {isEditing ? (
                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    style={styles.textarea}
                  />
                ) : (
                  <div style={{whiteSpace: 'pre-wrap'}}>{syllabus.overview}</div>
                )}
              </td>
            </tr>
            
            {/* 강의 목표 */}
            <tr>
              <td style={styles.tdLabel}>강의 목표</td>
              <td style={styles.alignLeft}>
                {isEditing ? (
                  <textarea
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    style={styles.textarea}
                  />
                ) : (
                  <div style={{whiteSpace: 'pre-wrap'}}>{syllabus.objective}</div>
                )}
              </td>
            </tr>
            
            {/* 교재 정보 */}
            <tr>
              <td style={styles.tdLabel}>교재 정보</td>
              <td style={styles.alignLeft}>
                {isEditing ? (
                  <input
                    type="text"
                    name="textbook"
                    value={formData.textbook}
                    onChange={handleChange}
                    style={styles.input}
                  />
                ) : (
                  syllabus.textbook
                )}
              </td>
            </tr>

            {/* 주간 계획 */}
            <tr>
              <td style={styles.tdLabel}>주간 계획</td>
              <td style={styles.alignLeft}>
                {isEditing ? (
                  <textarea
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    style={styles.textarea}
                  />
                ) : (
                  <div style={{whiteSpace: 'pre-wrap'}}>{syllabus.program}</div>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 교수님일 경우 수정 버튼 표시 */}
      {canEdit() && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            {isEditing ? (
              <>
                <button onClick={handleSaveClick} style={{...styles.button, marginRight: '10px'}}>
                  저장
                </button>
                <button onClick={handleCancelClick} style={{...styles.button, backgroundColor: '#666'}}>
                  취소
                </button>
              </>
            ) : (
              <button onClick={handleEditClick} style={styles.button}>
                수정하기
              </button>
            )}
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