import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import BreakAppModal from "../MyPage/BreakModal";

const BreakManagement = ({ role }) => {
  // 예시 신청 내역
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    getLeaveList();
  }, []);

  const getLeaveList = async () => {
    try {
      const res = await api.get("/break/list");
      setLeaveRequests(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("휴학 신청 목록 조회 실패");
    }
  };

  const handleUpdateStatus = async (updatedId) => {
    setLeaveRequests((prev) => prev.filter((req) => req.id !== updatedId));
  };
  return (
    <div className="mypage-card">
      <h3>휴학 처리</h3>
      {leaveRequests.length === 0 ? (
        <p>대기 중인 신청 내역이 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>신청일자</th>
              <th>신청자 학번</th>
              <th>구분</th>
              <th>시작학기</th>
              <th>종료학기</th>
              <th>신청서 확인</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((req, index) => (
              <tr key={req.id}>
                <td>{req.appDate}</td>
                <td>{req.student.id}</td>
                <td>{req.type}</td>
                <td>
                  {req.fromYear}년 {req.fromSemester}학기
                </td>
                <td>
                  {req.toYear}년 {req.toSemester}학기
                </td>
                <td>
                  <button onClick={() => setSelectedRequest(req)}>Click</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* 모달 */}
      <BreakAppModal
        show={!!selectedRequest}
        app={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        handleUpdateStatus={handleUpdateStatus}
        role={role}
        onDeleted={getLeaveList} // 취소 후 리스트 갱신
      />
    </div>
  );
};

export default BreakManagement;
