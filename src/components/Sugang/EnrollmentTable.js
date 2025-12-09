// EnrollmentTable.js
const EnrollmentTable = ({
  subjects,
  myEnrolledIds,
  period,
  handleRegister,
}) => {
  const getButtonLabel = (sub) => {
    if (myEnrolledIds.includes(sub.id)) return "신청완료";
    if (period === 1 && sub.numOfStudent >= sub.capacity) return "마감";
    if (period === 0) return "예비 신청";
    return "신청";
  };

  return (
    <table>
      <thead>
        <tr>
          <th>학과</th>
          <th>학수번호</th>
          <th>구분</th>
          <th>강의명</th>
          <th>교수</th>
          <th>학점</th>
          <th>요일/시간</th>
          <th>인원</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((sub) => {
          const isApplied = myEnrolledIds.includes(sub.id);
          const isFull = sub.numOfStudent >= sub.capacity;
          const isClosed = period === 1 && isFull;

          return (
            <tr key={sub.id}>
              <td>{sub.department?.name}</td>
              <td>{sub.id}</td>
              <td>{sub.type}</td>
              <td>{sub.name}</td>
              <td>{sub.professor?.name}</td>
              <td>{sub.grades}</td>
              <td>
                {sub.subDay} {sub.startTime}:00 ~ {sub.endTime}:00
              </td>
              <td style={{ color: isClosed ? "red" : "black" }}>
                {sub.numOfStudent}/{sub.capacity}
              </td>
              <td>
                <button
                  onClick={() => handleRegister(sub)}
                  disabled={isClosed || isApplied}
                >
                  {getButtonLabel(sub)}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default EnrollmentTable;
