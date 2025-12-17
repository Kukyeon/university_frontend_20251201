import React, { useState, useEffect } from "react";
import { dashboardApi } from "../api/aiApi";
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
  // 1. 데이터 로딩
  useEffect(() => {
    if (!user) {
      showModal({
        type: "alert",
        message: "로그인이 필요합니다.",
      });
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
      .catch((err) =>
        showModal({
          type: "alert",
          message: "학생 목록을 불러오는데 실패했습니다.",
        })
      );
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
      showModal({
        type: "alert",
        message: "선택된 학생이 없습니다.",
      });
      return;
    }
    showModal({
      type: "confirm",
      message: `선택한 ${checkedIds.size}명을 목록에서 삭제하시겠습니까?`,
      onConfirm: async () => {
        try {
          const deletePromises = Array.from(checkedIds).map((id) =>
            dashboardApi.deleteRisk(id)
          );
          await Promise.all(deletePromises);
          setRisks((prev) => prev.filter((item) => !checkedIds.has(item.id)));
          setCheckedIds(new Set());
          showModal({
            type: "alert",
            message: "삭제 완료하였습니다.",
          });
        } catch (err) {
          showModal({
            type: "alert",
            message: "삭제에 실패하였습니다.",
          });
        }
      },
    });
  };

  // 5. 체크박스 핸들러
  const handleCheck = (id) => {
    const newChecked = new Set(checkedIds);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedIds(newChecked);
  };

  return (
    <>
      {/* 헤더 & 컨트롤 패널 */}
      <h3>중도이탈 위험학생 리스트</h3>

      <div>
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
      <div className="table-wrapper">
        <table className="course-table">
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
                <td>데이터가 없습니다.</td>
              </tr>
            ) : (
              filteredRisks.map((risk) => (
                <tr key={risk.id}>
                  {/* 체크박스 */}
                  <td>
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
                    }}
                  >
                    {risk.reason}
                  </td>
                  {/* 버튼 그룹 */}
                  <td>
                    <div>
                      <button
                        onClick={() =>
                          navigate(
                            `/professor/counseling/write?studentId=${risk.studentId}`
                          )
                        }
                      >
                        상담
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProfDashboard;
