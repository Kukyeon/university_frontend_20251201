import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { saveRecord, getCounselingRecord } from "../../api/scheduleApi";
import "../../pages/SchedulePage.css";

const CounselingRecordForm = () => {
  const { scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const studentId = new URLSearchParams(location.search).get("studentId");

  const [notes, setNotes] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scheduleId && studentId) {
      const fetchExistingRecord = async () => {
        try {
          const existingRecord = await getCounselingRecord(
            scheduleId,
            studentId
          );
          // 기존 기록이 있으면 불러와서 상태에 설정
          setNotes(existingRecord.notes || "");
          setKeywords(existingRecord.keywords || "");
        } catch (error) {
          console.error("기존 기록 불러오기 실패:", error);
        }
      };
      fetchExistingRecord();
    }
  }, [scheduleId, studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await saveRecord(scheduleId, notes, keywords);
      alert("상담 기록이 성공적으로 저장되었습니다.");

      // 저장 후 상세 페이지로 이동
      navigate(
        `/professor/counseling/detail/${scheduleId}?studentId=${studentId}`
      );
    } catch (error) {
      alert("상담 기록 저장 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 💡 클래스 적용
    <div className="record-form-container">
      <h3 className="form-title">상담 기록 {notes ? "수정" : "작성"}</h3>
      <form onSubmit={handleSubmit} className="record-form">
        {/* 💡 상담 내용 그룹 */}
        <div className="form-group">
          <label className="form-label">상담 내용:</label>
          <textarea
            className="form-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            rows="10"
            placeholder="상담 내용을 입력하세요."
          />
        </div>

        {/* 💡 키워드 그룹 */}
        <div className="form-group">
          <label className="form-label">키워드 (쉼표로 구분):</label>
          <input
            className="form-input"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="예: 학업 스트레스, 진로 고민, 시간 관리"
          />
        </div>

        {/* 💡 저장 버튼 */}
        <button type="submit" disabled={loading} className="btn-save-record">
          {loading ? "저장 중..." : "기록 저장"}
        </button>
      </form>
    </div>
  );
};

export default CounselingRecordForm;
