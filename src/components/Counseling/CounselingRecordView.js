import React, { useState } from "react";
import { searchRecords } from "../../api/scheduleApi";
import "../../pages/SchedulePage.css";

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
      // 💡 검색 조건이 없을 경우 전체 조회하거나 유효성 검사 추가 가능
      const data = await searchRecords(search);
      setRecords(data);
      if (data.length === 0) {
        alert("검색 결과가 없습니다.");
      }
    } catch (error) {
      alert("검색 실패: " + error.message);
    }
  };

  return (
    // 💡 클래스 적용
    <div className="counseling-record-view">
      <h3 className="view-title">상담 기록 조회</h3>

      {/* 💡 검색 폼 그룹 */}
      <div className="search-form-group">
        <input
          className="search-input"
          placeholder="학생 이름"
          value={search.studentName}
          onChange={(e) =>
            setSearch({ ...search, studentName: e.target.value })
          }
        />
        <input
          className="search-input date-input"
          type="date"
          placeholder="상담 날짜"
          value={search.consultationDate}
          onChange={(e) =>
            setSearch({ ...search, consultationDate: e.target.value })
          }
        />
        <input
          className="search-input"
          placeholder="키워드"
          value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
        />
        <button className="btn-search" onClick={handleSearch}>
          검색
        </button>
      </div>

      {/* 💡 검색 결과 목록 */}
      <ul className="record-list">
        {records.length === 0 && (
          <li className="no-record-found">
            검색 조건 입력 후 [검색] 버튼을 눌러주세요.
          </li>
        )}
        {records.map((r) => (
          <li key={r.id} className="record-item">
            <div className="record-header">
              <span className="student-name">**{r.studentName}**</span>
              <span className="consultation-date">
                {formatDateTime(r.consultationDate)}
              </span>
            </div>
            <div className="record-content">
              <p className="record-notes">{r.notes}</p>
              <p className="record-keywords">
                <strong className="keyword-label">키워드:</strong>
                <span className="keyword-value">{r.keywords}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CounselingRecordView;
