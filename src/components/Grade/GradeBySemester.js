const GradeBySemester = ({ data }) => {
  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th>연도</th>
          <th>학기</th>
          <th>과목명</th>
          <th>구분</th>
          <th>학점</th>
          <th>성적</th>
        </tr>
      </thead>

      <tbody>
        {data.gradeList?.length ? (
          data.gradeList.map((g, idx) => (
            <tr key={idx}>
              <td>{g.subYear}</td>
              <td>{g.semester}</td>
              <td>{g.name}</td>
              <td>{g.type}</td>
              <td>{g.grades}</td>
              <td>{g.grade}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="empty-row">
              성적 데이터가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default GradeBySemester;
