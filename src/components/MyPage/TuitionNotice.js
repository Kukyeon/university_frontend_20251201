import React from "react";

const TuitionNotice = ({ tuition }) => {
  return (
    <section className="mypage-card">
      <h3>등록금 납부 고지서</h3>
      {tuition ? (
        <>
          <p>
            {tuition.year}년도 {tuition.semester}학기
          </p>
          <table>
            <tbody>
              <tr>
                <td>단과대</td>
                <td>{tuition.college}</td>
                <td>학과</td>
                <td>{tuition.department}</td>
              </tr>
              <tr>
                <td>학번</td>
                <td>{tuition.id}</td>
                <td>성명</td>
                <td>{tuition.name}</td>
              </tr>
              <tr>
                <td>장학유형</td>
                <td>{tuition.scholarshipType}</td>
                <td>등록금</td>
                <td>{tuition.totalFee.toLocaleString()}원</td>
              </tr>
              <tr>
                <td>장학금</td>
                <td>{tuition.scholarship.toLocaleString()}원</td>
                <td>납부금</td>
                <td>{tuition.payable.toLocaleString()}원</td>
              </tr>
              <tr>
                <td>납부계좌</td>
                <td colSpan="3">{tuition.account}</td>
              </tr>
              <tr>
                <td>납부기간</td>
                <td colSpan="3">{tuition.period}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }}>
            <button onClick={() => alert("납부 처리 (임시)")}>납부</button>
          </div>
        </>
      ) : (
        <p>등록금 고지서 정보가 없습니다.</p>
      )}
    </section>
  );
};

export default TuitionNotice;
