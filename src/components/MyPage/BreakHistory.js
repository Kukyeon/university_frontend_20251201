import React from "react";

const BreakHistory = ({ leaveHistory }) => {
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
                <td>{item.applyDate}</td>
                <td>{item.type}</td>
                <td>{item.startSemester}</td>
                <td>{item.endSemester}</td>
                <td>
                  <button onClick={() => alert("신청서 보기")}>Click</button>
                </td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>신청 내역이 없습니다.</p>
      )}
    </section>
  );
};

export default BreakHistory;
