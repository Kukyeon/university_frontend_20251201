import React, { useEffect, useState } from "react";
import { dashboardApi } from "../api/aiApi";

const AdminDashboard = () => {
  const [risks, setRisks] = useState([]);
  const [checkedIds, setCheckedIds] = useState(new Set());

  useEffect(() => {
    dashboardApi
      .getAllRiskList()
      .then((res) => setRisks(res.data))
      .catch(() => alert("데이터 로딩 실패"));
  }, []);

  const handleCheck = (id) => {
    const newChecked = new Set(checkedIds);
    if (newChecked.has(id)) newChecked.delete(id);
    else newChecked.add(id);
    setCheckedIds(newChecked);
  };

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
      await Promise.all(
        Array.from(checkedIds).map((id) => dashboardApi.deleteRisk(id))
      );
      setRisks((prev) => prev.filter((item) => !checkedIds.has(item.id)));
      setCheckedIds(new Set());
      alert("삭제 완료!");
    } catch {
      alert("삭제 중 오류 발생");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>중도이탈 위험학생 전체 리스트</h3>
      <button onClick={handleBulkDelete}>선택 항목 삭제</button>
      <div className="table-wrapper" style={{ overflowX: "auto" }}>
        <table
          className="course-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th></th>
              <th>분석 날짜</th>
              <th>학과</th>
              <th>학번</th>
              <th>이름</th>
              <th>학년</th>
              <th>위험도</th>
              <th>상태</th>
              <th>AI 분석 원인</th>
            </tr>
          </thead>
          <tbody>
            {risks.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              risks.map((risk) => (
                <tr
                  key={risk.id}
                  style={{
                    borderBottom: "1px solid #ccc",
                    verticalAlign: "top",
                  }}
                >
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={checkedIds.has(risk.id)}
                      onChange={() => handleCheck(risk.id)}
                    />
                  </td>
                  <td>{risk.analyzedDate}</td>
                  <td style={{ fontWeight: "bold" }}>{risk.departmentName}</td>
                  <td>{risk.studentId}</td>
                  <td>{risk.studentName}</td>
                  <td>{risk.grade}학년</td>
                  <td>{risk.riskScore}점</td>
                  <td
                    style={{
                      color:
                        risk.riskLevel === "심각"
                          ? "red"
                          : risk.riskLevel === "주의"
                          ? "orange"
                          : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {risk.riskLevel}
                  </td>
                  <td
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      maxWidth: "400px",
                    }}
                  >
                    {risk.reason}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
