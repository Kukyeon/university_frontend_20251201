import React, { useState, useEffect } from "react";
import { dashboardApi, notiApi } from "../api/aiApi";
import { useNavigate } from "react-router-dom"; // 페이지 이동용
import { useModal } from "../components/ModalContext";

const ProfDashboard = (user) => {
  const navigate = useNavigate();

  const [professorId, setProfessorId] = useState(null);
  const [professorname, setProfessorname] = useState();
  const [risks, setRisks] = useState([]); // 전체 데이터
  const [filteredRisks, setFilteredRisks] = useState([]); // 필터링된 데이터
  const [filterLevel, setFilterLevel] = useState("ALL"); // 필터 상태
  const [checkedIds, setCheckedIds] = useState(new Set()); // 체크된 항목들
  const { showModal } = useModal();
  // 교수 -> 학생 알림
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  // 교수 -> 학생 알림

  // 1. 데이터 로딩
  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setProfessorId(user.id);
    setProfessorname(user.name);
  }, [user, navigate]);

  useEffect(() => {
    loadData();
  }, []);

  // 2. 필터가 바뀌거나 데이터가 바뀌면 화면 갱신
  useEffect(() => {
    if (filterLevel === "ALL") {
      setFilteredRisks(risks);
    } else {
      setFilteredRisks(risks.filter((r) => r.riskLevel === filterLevel));
    }
  }, [filterLevel, risks]);

  const loadData = () => {
    dashboardApi
      .getRiskList(professorId)
      .then((res) => setRisks(res.data))
      .catch((err) => alert("로딩 실패"));
  };

  // 3. 개별 삭제 (조치 완료)
  // const handleDelete = async (id) => {
  //   if (!window.confirm("이 학생을 목록에서 제외하시겠습니까?")) return;
  //   try {
  //     await dashboardApi.deleteRisk(id);
  //     setRisks(prev => prev.filter(item => item.id !== id)); // 화면에서도 즉시 제거
  //     alert("처리되었습니다.");
  //   } catch (err) {
  //     alert("삭제 실패");
  //   }
  // };

  // 4. 일괄 삭제 (선택된 것들)
  const handleBulkDelete = async () => {
    if (checkedIds.size === 0) {
      alert("선택된 학생이 없습니다.");
      return;
    }
    if (
      !window.confirm(
        `선택한 ${checkedIds.size}명을 목록에서 삭제하시겠습니까?`
      )
    )
      return;

    try {
      // 여러 개를 한 번에 삭제 (Promise.all 사용)
      const deletePromises = Array.from(checkedIds).map((id) =>
        dashboardApi.deleteRisk(id)
      );
      await Promise.all(deletePromises);

      // 화면 갱신
      setRisks((prev) => prev.filter((item) => !checkedIds.has(item.id)));
      setCheckedIds(new Set()); // 체크박스 초기화
      alert("삭제 완료!");
    } catch (err) {
      alert("삭제 중 오류 발생");
    }
  };

  // 5. 체크박스 핸들러
  const handleCheck = (id) => {
    const newChecked = new Set(checkedIds);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedIds(newChecked);
  };

  // 교수 -> 학생 알림
  const handleOpenNotificationModal = (risk) => {
    setTargetStudent({
      id: risk.studentId,
      name: risk.studentName,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessageContent("");
    setTargetStudent(null);
  };

  const handleSendNotification = async () => {
    if (!messageContent.trim()) {
      alert("전송할 메세지를 입력해주세요.");
      return;
    }
    if (
      !targetStudent ||
      !window.confirm(
        `${targetStudent.name} 학생에게 메세지를 전송하시겠습니까?`
      )
    ) {
      return;
    }
    try {
      await notiApi.sendDirectMessage(targetStudent.id, messageContent);
      alert(`[${targetStudent.name}] 학생에게 메세지를 보냈습니다.`);
      handleCloseModal();
    } catch (err) {
      alert("메세지 전송에 실패했습니다.");
      console.error(err);
    }
  };
  // 교수 -> 학생 알림

  return (
    <>
      {/* 헤더 & 컨트롤 패널 */}
      <h3>중도이탈 위험학생 리스트</h3>

      <div style={{ display: "flex", gap: "10px" }}>
        {/* 필터링 드롭다운 */}
        {/* <select 
            value={filterLevel} 
            onChange={(e) => setFilterLevel(e.target.value)}
            style={{ padding: "8px", borderRadius: "5px" }}
          >
            <option value="ALL">전체 보기</option>
            <option value="심각">🔴 심각 단계만</option>
            <option value="경고">🟠 경고 단계만</option>
            <option value="주의">🟡 주의 단계만</option>
          </select> */}

        {/* 일괄 삭제 버튼 */}
        <button>선택 항목 삭제</button>
      </div>

      {/* 데이터 테이블 */}
      <div className="table-wrapper" style={{ overflowX: "auto" }}>
        <table
          className="course-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>선택</th>
              <th>분석 날짜</th>
              <th>학번</th>
              <th>이름</th>
              <th>학년</th>
              <th>위험도</th>
              <th>상태</th>
              <th>AI 분석 원인</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredRisks.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              filteredRisks.map((risk) => (
                <tr
                  key={risk.id}
                  style={{
                    borderBottom: "1px solid #ccc",
                    verticalAlign: "top",
                  }}
                >
                  {/* 체크박스 */}
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={checkedIds.has(risk.id)}
                      onChange={() => handleCheck(risk.id)}
                    />
                  </td>
                  {/* 날짜 */}
                  <td>{risk.analyzedDate}</td>
                  {/* <td style={{ fontWeight: 'bold' }}>{risk.departmentName}</td> */}
                  <td>{risk.studentId}</td>
                  <td>{risk.studentName}</td>
                  <td>{risk.grade}</td>
                  {/* 점수 */}
                  <td>{risk.riskScore}점</td>
                  {/* 상태 (색상 강조) */}
                  <td
                    style={{
                      color:
                        risk.riskLevel === "심각"
                          ? "red"
                          : risk.riskLevel === "경고"
                          ? "orange"
                          : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {risk.riskLevel}
                  </td>
                  {/* 원인 (왼쪽 정렬) */}
                  <td
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      maxWidth: "400px",
                    }}
                  >
                    {risk.reason}
                  </td>
                  {/* 버튼 그룹 */}
                  <td>
                    <div>
                      <button
                        onClick={() => navigate("/professor-schedule")}
                        style={{
                          padding: "5px 10px",
                          background: "#4caf50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        상담
                      </button>
                      <button onClick={() => handleOpenNotificationModal(risk)}>
                        메세지
                      </button>
                      {/* <button 
                      onClick={() => handleDelete(risk.id)}
                      style={{ padding: "5px 10px", background: "#9e9e9e", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      완료
                    </button> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/*  메시지 전송 모달  */}
      {isModalOpen && targetStudent && (
        <div>
          <div>
            <h4>{targetStudent.name} 학생에게 메시지 전송</h4>
            <p style={{ fontSize: "14px", color: "#666" }}>
              메시지는 학생의 알림벨로 즉시 전송됩니다.
            </p>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="학생에게 보낼 메시지를 입력하세요. (예: '교수님께 상담 신청해주세요.')"
              rows="4"
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button onClick={handleCloseModal}>취소</button>
              <button onClick={handleSendNotification}>전송</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfDashboard;
