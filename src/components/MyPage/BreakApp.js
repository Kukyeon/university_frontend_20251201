import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

const BreakApp = ({ user }) => {
  const [leaveType, setLeaveType] = useState("");
  const [startSemester, setStartSemester] = useState("");
  const [endSemester, setEndSemester] = useState("");
  const [endOptions, setEndOptions] = useState([]);

  // 시작 학기 초기화
  useEffect(() => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let sem = month <= 6 ? 1 : 2;
    const start = `${year}-${sem}`;
    setStartSemester(start);

    // 종료 학기 옵션 생성 (최대 4학기 선택 가능)
    const options = [];
    let optYear = year;
    let optSem = sem;
    for (let i = 0; i < 4; i++) {
      options.push(`${optYear}-${optSem}`);
      optSem += 1;
      if (optSem > 2) {
        optSem = 1;
        optYear += 1;
      }
    }
    setEndOptions(options);
    setEndSemester(options[0]); // 기본 종료 학기 첫 옵션으로
  }, []);
  const handleSubmit = async () => {
    if (!leaveType || !endSemester) {
      alert("모든 항목을 선택해주세요.");
      return;
    }
    const [fromYear, fromSem] = startSemester.split("-").map(Number);
    const [toYear, toSem] = endSemester.split("-").map(Number);

    if (toYear < fromYear || (toYear === fromYear && toSem < fromSem)) {
      alert("종료 학기가 시작 학기 이전일 수 없습니다.");
      return;
    }
    try {
      await api.post("/break/app", {
        type: leaveType,
        fromYear,
        fromSemester: fromSem,
        toYear,
        toSemester: toSem,
      });
      alert("휴학 신청 완료!");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "신청 실패");
      } else {
        alert("서버와 통신 중 오류 발생");
      }
    }
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
                value={startSemester}
                readOnly
                style={{ width: "80px", marginRight: "10px" }}
              />
              <select
                value={endSemester}
                onChange={(e) => setEndSemester(e.target.value)}
              >
                {endOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.replace("-", "년도 ")}학기
                  </option>
                ))}
              </select>
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
      <p style={{ textAlign: "right" }}>
        {new Date().getFullYear()}년 {new Date().getMonth() + 1}월{" "}
        {new Date().getDate()}일
      </p>
    </section>
  );
};

export default BreakApp;
