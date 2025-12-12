import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { saveRecord, getCounselingRecord } from "../../api/scheduleApi";

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
    <div style={{ padding: "20px" }}>
      <h3>상담 기록 {notes ? "수정" : "작성"}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            상담 내용:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            rows="10"
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            키워드 (쉼표로 구분):
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "저장 중..." : "기록 저장"}
        </button>
      </form>
    </div>
  );
};

export default CounselingRecordForm;
