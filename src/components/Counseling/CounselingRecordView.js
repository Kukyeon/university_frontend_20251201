// src/components/CounselingRecord/CounselingRecordView.js

import React, { useState } from "react";
import { searchRecords } from "../../api/scheduleApi";

// 날짜/시간 포맷팅 함수 (MM-DD HH:mm)
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const date = new Date(dateTimeStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}-${day} ${hours}:${minutes}`;
};

const CounselingRecordView = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState({
    studentName: "",
    consultationDate: "", // YYYY-MM-DD
    keyword: "",
  });

  const handleSearch = async () => {
    try {
      const data = await searchRecords(search);
      setRecords(data);
    } catch (error) {
      alert("검색 실패: " + error.message);
    }
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
            **{r.studentName}** | {formatDateTime(r.consultationDate)} |{" "}
            {r.notes} | {r.keywords}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CounselingRecordView;
