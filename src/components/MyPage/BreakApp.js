import React, { useState } from "react";

const BreakApp = ({ user }) => {
  const [leaveType, setLeaveType] = useState("");
  const [startSemester, setStartSemester] = useState("");
  const [endSemester, setEndSemester] = useState("");

  const handleSubmit = () => {
    console.log("휴학 신청:", { leaveType, startSemester, endSemester });
    alert("휴학 신청 완료! (API 연결 전 임시 기능)");
  };

  return (
    <section className="mypage-card leave-form">
      <h3>휴학 신청서</h3>
      <table>
        <tbody>
          <tr>
            <td>단과대</td>
            <td>{user.department.college.name}</td>
            <td>학과</td>
            <td>{user.department.name}</td>
          </tr>
          <tr>
            <td>학번</td>
            <td>{user.id}</td>
            <td>학년</td>
            <td>{user.grade}</td>
          </tr>
          <tr>
            <td>전화번호</td>
            <td>{user.tel}</td>
            <td>성명</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>주소</td>
            <td colSpan="3">{user.address}</td>
          </tr>
          <tr>
            <td>기간</td>
            <td colSpan="3">
              <input
                type="text"
                placeholder="2023년도 1학기부터 2023년도 2학기까지"
                value={`${startSemester || "2023-1"} ~ ${
                  endSemester || "2023-2"
                }`}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>휴학 구분</td>
            <td colSpan={3}>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                {[
                  "일반휴학",
                  "임신·출산·육아휴학",
                  "질병휴학",
                  "창업휴학",
                  "군입대휴학",
                ].map((type) => (
                  <label
                    key={type}
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <input
                      type="radio"
                      name="leaveType"
                      value={type}
                      checked={leaveType === type}
                      onChange={(e) => setLeaveType(e.target.value)}
                      style={{ marginRight: "5px" }}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit}>신청</button>
      </div>

      <p style={{ marginTop: "20px" }}>
        위와 같이 휴학하고자 하오니 허가하여 주시기 바랍니다.
      </p>
      <p style={{ textAlign: "right" }}>2025년 12월 04일</p>
    </section>
  );
};

export default BreakApp;
