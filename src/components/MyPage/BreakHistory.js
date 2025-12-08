import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import BreakAppModal from "./BreakModal";

const BreakHistory = ({ user, role }) => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const res = await api.get("/break/list");
        setLeaveHistory(res.data); // 백엔드에서 내려주는 리스트
      } catch (err) {
        console.error(err);
        alert("휴학 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, [user.id]);
  const handleView = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };
  if (loading) return <p>로딩중...</p>;
  return (
    <section className="mypage-card">
      <h3>휴학 내역 조회</h3>
      {leaveHistory && leaveHistory.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>신청일자</th>
              <th>구분</th>
              <th>시작학기</th>
              <th>종료학기</th>
              <th>신청서 확인</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.map((item, idx) => (
              <tr key={idx}>
                <td>{item.appDate}</td>
                <td>{item.type}</td>
                <td>
                  {item.fromYear}년 {item.fromSemester}학기
                </td>
                <td>
                  {item.toYear}년 {item.toSemester}학기
                </td>
                <td>
                  <button onClick={() => handleView(item)}>보기</button>
                </td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>신청 내역이 없습니다.</p>
      )}
      <BreakAppModal
        show={showModal}
        onClose={() => setShowModal(false)}
        app={selectedApp}
        role={role}
        onDeleted={() => {
          // 취소 후 다시 리스트 갱신
          setLeaveHistory((prev) =>
            prev.filter((item) => item.id !== selectedApp.id)
          );
          setSelectedApp(null);
        }}
      />
    </section>
  );
};

export default BreakHistory;
