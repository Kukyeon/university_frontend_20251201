import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import BreakAppModal from "./BreakModal";
import { useModal } from "../ModalContext";

const BreakHistory = ({ user, role }) => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showModal } = useModal();
  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const res = await api.get("/break/list");
        setLeaveHistory(res.data);
      } catch (err) {
        showModal({
          type: "alert",
          message: "휴학 내역을 불러오는 중 오류가 발생했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, [user.id]);

  const handleView = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  if (loading) return <p>로딩중...</p>;

  return (
    <>
      <h3>휴학 내역 조회</h3>
      {leaveHistory.length > 0 ? (
        <div className="table-wrapper">
          <table className="course-table">
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
              {leaveHistory.map((item) => (
                <tr key={item.id}>
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
        </div>
      ) : (
        <p>신청 내역이 없습니다.</p>
      )}

      <BreakAppModal
        show={showModal}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApp(null);
        }}
        app={selectedApp}
        role={role}
        onDeleted={() => {
          setLeaveHistory((prev) =>
            prev.filter((item) => item.id !== selectedApp.id)
          );
          setSelectedApp(null);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default BreakHistory;
