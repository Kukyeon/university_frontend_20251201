import React from "react";

const EnrollmentTable = ({
  subjects,
  myEnrolledIds,
  period,
  handleRegister,
}) => {
  return (
    <table className="enrollment-table">
      <thead>
        <tr>
          <th>학과</th>
          <th>학수번호</th>
          <th>구분</th>
          <th>강의명</th>
          <th>교수</th>
          <th>학점</th>
          <th>요일/시간 (강의실)</th>
          {/* 기간에 따라 헤더 이름 변경 */}
          <th>{period === 0 ? "담은인원" : "신청/정원"}</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {subjects.length === 0 ? (
          <tr>
            <td colSpan="9">개설된 강좌가 없습니다.</td>
          </tr>
        ) : (
          subjects.map((sub) => {
            const isApplied = myEnrolledIds.includes(sub.id);
            
            // ★ [변경] 기간 0일 때는 정원 마감 개념이 없음 (무조건 false)
            // 기간 1일 때만 실제 인원(numOfStudent)과 정원(capacity) 비교
            const isFull = period === 1 && (sub.numOfStudent >= sub.capacity);
            const isClosed = isFull; 

            // 버튼 텍스트 및 상태 로직
            let buttonText = "";
            let isDisabled = false;
            let btnStyle = {};

            if (isApplied) {
              buttonText = period === 0 ? "담기완료" : "신청완료";
              isDisabled = true;
              btnStyle = { backgroundColor: "#adb5bd", cursor: "default" };
            } else {
              if (period === 0) {
                // 장바구니 기간: 마감 없음, 무조건 담기 가능
                buttonText = "장바구니";
                btnStyle = { backgroundColor: "#fcc419", color: "#fff", fontWeight: "bold" };
              } else {
                // 본 수강 기간: 마감 시 버튼 비활성화
                buttonText = isClosed ? "마감" : "신청";
                isDisabled = isClosed;
                btnStyle = isClosed 
                  ? { backgroundColor: "#868e96", cursor: "not-allowed" } 
                  : { backgroundColor: "#0d6efd", color: "#fff", fontWeight: "bold" };
              }
            }

            return (
              <tr key={sub.id} style={{ backgroundColor: isApplied ? "#f1f3f5" : "white" }}>
                <td>{sub.department?.name}</td>
                <td>{sub.id}</td>
                <td>{sub.type}</td>
                <td style={{ textAlign: "left", paddingLeft: "15px", fontWeight: "bold" }}>
                  {sub.name}
                </td>
                <td>{sub.professor?.name}</td>
                <td>{sub.grades}</td>
                <td>
                  {sub.subDay} {sub.startTime}~{sub.endTime} ({sub.room.id})
                </td>
                
                {/* ★ [핵심 변경] 인원수 표시 로직 */}
                <td>
                  {period === 0 ? (
                     // 기간 0: 찜한 인원수 표시 (basketCount가 없으면 0 처리)
                    <span style={{ color: "#f08c00", fontWeight: "bold" }}>
                       {sub.basketCount || 0}
                    </span>
                  ) : (
                     // 기간 1: 실제 경쟁률 표시
                    <span style={{ color: isFull ? "red" : "black", fontWeight: isFull ? "bold" : "normal" }}>
                      {sub.numOfStudent} / {sub.capacity}
                    </span>
                  )}
                </td>

                <td>
                  <button
                    onClick={() => handleRegister(sub)}
                    disabled={isDisabled}
                    style={{ border: "none", padding: "5px 10px", borderRadius: "4px", ...btnStyle }}
                  >
                    {buttonText}
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default EnrollmentTable;