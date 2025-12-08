import React, { useState } from "react";

const CoursePeriod = () => {
  const [status, setStatus] = useState("예비"); // 예비, 진행, 종료

  const handleStart = () => {
    setStatus("진행");
    alert("이번 학기 수강 신청 기간이 시작되었습니다.");
  };

  const handleEnd = () => {
    setStatus("종료");
    alert("이번 학기 수강 신청 기간이 종료되었습니다.");
  };

  return (
    <div className="mypage-card">
      <h3>수강 신청 기간 설정</h3>
      {status === "예비" && (
        <>
          <p>현재 예비 수강 신청 기간입니다.</p>
          <button onClick={handleStart}>시작</button>
        </>
      )}
      {status === "진행" && (
        <>
          <p>현재 수강 신청 기간이 진행 중입니다.</p>
          <button onClick={handleEnd}>종료</button>
        </>
      )}
      {status === "종료" && <p>이번 학기 수강 신청 기간이 종료되었습니다.</p>}
    </div>
  );
};

export default CoursePeriod;
