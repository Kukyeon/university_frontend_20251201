import React, { useState } from "react";
import { searchRecords } from "../../api/scheduleApi";

const CounselingRecordView = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState({
    studentName: "",
    consultationDate: "",
    keyword: "",
  });

  const handleSearch = async () => {
    const data = await searchRecords(search);
    setRecords(data);
  };

  return (
    <div>
      <h3>상담 기록 조회</h3>
      <input
        placeholder="학생 이름"
        value={search.studentName}
        onChange={(e) => setSearch({ ...search, studentName: e.target.value })}
      />
      <input
        type="date"
        placeholder="상담 날짜"
        value={search.consultationDate}
        onChange={(e) =>
          setSearch({ ...search, consultationDate: e.target.value })
        }
      />
      <input
        placeholder="키워드"
        value={search.keyword}
        onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
      />
      <button onClick={handleSearch}>검색</button>
      <ul>
        {records.map((r) => (
          <li key={r.id}>
            {r.studentName} | {r.consultationDate} | {r.notes} | {r.keywords}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CounselingRecordView;
