const GradeTotal = ({ data }) => {
  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th>연도</th>
          <th>학기</th>
          <th>신청학점</th>
          <th>취득학점</th>
          <th>평점평균</th>
        </tr>
      </thead>

      <tbody>
        {data.mygradeList?.length ? (
          data.mygradeList.map((mg, idx) => (
            <tr key={idx}>
              <td>{mg.subYear}</td>
              <td>{mg.semester}</td>
              <td>{mg.sumGrades}</td>
              <td>{mg.myGrades}</td>
              <td>{mg.averageScore}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="empty-row">
              누계 성적 정보가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default GradeTotal;
