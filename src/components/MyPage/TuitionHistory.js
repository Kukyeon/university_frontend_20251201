import React from "react";

const TuitionHistory = ({ history }) => {
  return (
    <section className="mypage-card">
      <h3>등록금 내역 조회</h3>
      {history && history.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>등록연도</th>
              <th>등록학기</th>
              <th>장학금 유형</th>
              <th>등록금</th>
              <th>장학금</th>
              <th>납입금</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx}>
                <td>{item.year}</td>
                <td>{item.semester}</td>
                <td>{item.scholarshipType}</td>
                <td>{item.totalFee.toLocaleString()}원</td>
                <td>{item.scholarship.toLocaleString()}원</td>
                <td>{item.paid.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>등록금 납부 내역이 없습니다.</p>
      )}
    </section>
  );
};

export default TuitionHistory;
