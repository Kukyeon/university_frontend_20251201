import React, { useState, useEffect } from "react";
import { getCounselingRecord, saveRecord } from "../../api/scheduleApi";
import "./CounselingDetail.css";

const CounselingDetailForProfessor = ({ schedule }) => {
  const [record, setRecord] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const scheduleId = schedule?.id;
  const studentId = schedule?.studentId;
  const studentName = schedule?.studentName;

  useEffect(() => {
    if (!scheduleId || !studentId) return;

    const fetchRecord = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCounselingRecord(scheduleId, studentId);
        if (data) {
          setRecord(data);
          setNotes(data.notes || "");
        } else {
          setError("상담 기록을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("상담 기록 조회 실패:", err);
        setError("상담 기록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [scheduleId, studentId]);

  const handleSave = async () => {
    if (!window.confirm("상담 기록을 저장/수정 하시겠습니까?")) return;
    setSaving(true);
    try {
      await saveRecord(scheduleId, notes, record?.keywords);
      alert("상담 기록이 성공적으로 업데이트되었습니다.");
      setIsEditing(false);
    } catch (err) {
      alert("기록 저장 실패: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>🚨 에러: {error}</div>;
  if (!record) return <div>상담 기록이 존재하지 않습니다.</div>;
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  return (
    <>
      <h3>상담 기록 상세</h3>

      <div className="counseling-detail-info">
        <strong>학생 이름:</strong> {studentName}
      </div>

      <div className="counseling-detail-info">
        <strong>상담 일시:</strong> {formatDate(record.schedule?.startTime)} -{" "}
        {formatDate(record.recordDate)}
      </div>

      <div className="counseling-detail-info">
        <strong>상담 내용:</strong>
      </div>

      <textarea
        className="counseling-edit-textarea"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        readOnly={!isEditing}
      />
      {!isEditing ? (
        <button
          className="counseling-edit-button"
          onClick={() => setIsEditing(true)}
        >
          수정
        </button>
      ) : (
        <button
          className="counseling-edit-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      )}
    </>
  );
};

export default CounselingDetailForProfessor;
