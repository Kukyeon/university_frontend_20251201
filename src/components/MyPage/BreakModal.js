import React from "react";
import api from "../../api/axiosConfig";

const BreakAppModal = ({
  show,
  onClose,
  app,
  onDeleted,
  role,
  handleUpdateStatus,
}) => {
  // console.log(role);
  if (!show || !app) return null;
  const handleCancel = async () => {
    if (!window.confirm("정말로 휴학 신청을 취소하시겠습니까?")) return;

    try {
      await api.delete(`/break/detail/${app.id}`);
      alert("휴학 신청이 취소되었습니다.");
      onDeleted(); // 부모 컴포넌트에서 리스트 갱신
      onClose();
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "취소 실패");
      } else {
        alert("서버와 통신 중 오류 발생");
      }
    }
  };
  const handleApproveReject = async (status) => {
    if (!window.confirm(`정말로 "${status}" 처리하시겠습니까?`)) return;

    try {
      await api.put(`/break/update/${app.id}`, { status }); // 예: 상태 변경 API
      alert(`휴학 신청이 "${status}" 처리되었습니다.`);
      handleUpdateStatus(app.id);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "처리 실패");
    }
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };
  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={contentStyle}>
        {/* 상단 닫기 버튼 */}
        <button onClick={onClose} style={closeButtonStyle}>
          ×
        </button>
        <h3 style={{ textAlign: "center" }}>휴학 신청서</h3>
        <table style={{ width: "100%", marginTop: "10px" }}>
          <tbody>
            <tr>
              <td>단 과 대</td>
              <td>{app.student.department.college.name}</td>
              <td>학 과</td>
              <td>{app.student.department.name}</td>
            </tr>
            <tr>
              <td>학 번</td>
              <td>{app.student.id}</td>
              <td>학 년</td>
              <td>{app.student.grade}학년</td>
            </tr>
            <tr>
              <td>전 화 번 호</td>
              <td>{app.student.tel}</td>
              <td>성 명</td>
              <td>{app.student.name}</td>
            </tr>
            <tr>
              <td>주 소</td>
              <td colSpan="3">{app.student.address}</td>
            </tr>
            <tr>
              <td>기 간</td>
              <td colSpan="3">
                {app.fromYear}년 {app.fromSemester}학기부터 {app.toYear}년{" "}
                {app.toSemester}
                학기까지
              </td>
            </tr>
            <tr>
              <td>휴 학 구 분</td>
              <td colSpan="3">{app.type}</td>
            </tr>
          </tbody>
        </table>

        <p style={{ marginTop: "20px" }}>
          위와 같이 휴학하고자 하오니 허가하여 주시기 바랍니다.
        </p>
        <p style={{ textAlign: "right" }}>{formatDate(app.appDate)}</p>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {role === "student" && app.status !== "승인" && (
            <button onClick={handleCancel}>취소하기</button>
          )}
          {role === "staff" && (
            <>
              <button
                onClick={() => handleApproveReject("승인")}
                style={{ marginRight: "10px" }}
              >
                승인
              </button>
              <button onClick={() => handleApproveReject("반려")}>반려</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// 간단한 스타일 예시
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000, // 헤더보다 높게
};

const contentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "500px",
  position: "relative",
  zIndex: 1001, // overlay보다 조금 높게
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  border: "none",
  background: "transparent",
  fontSize: "20px",
  cursor: "pointer",
};

export default BreakAppModal;
