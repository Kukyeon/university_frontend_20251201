// import React, { useState, useEffect } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import { getCounselingRecord, saveRecord } from "../../api/scheduleApi";

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// const CounselingDetailForProfessor = () => {
//   const { scheduleId } = useParams();
//   const [record, setRecord] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const query = useQuery();
//   const studentId = query.get("studentId");

//   useEffect(() => {
//     if (!scheduleId) {
//       setLoading(false);
//       setError("상담 ID가 없습니다.");
//       return;
//     }

//     const fetchRecord = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         //  getCounselingRecord를 호출하고 data 변수에 할당
//         const data = await getCounselingRecord(scheduleId, studentId);

//         if (data) {
//           setRecord(data);
//           // record.notes가 undefined일 경우, notes를 빈 문자열로 초기화
//           setNotes(data.notes || "");
//         } else {
//           setError("상담 기록을 찾을 수 없습니다.");
//         }
//       } catch (err) {
//         console.error("상담 기록 조회 실패:", err);
//         setError("상담 기록을 불러오는 데 실패했습니다.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRecord();
//   }, [scheduleId, studentId]); //  기록 수정 및 저장

//   const handleSave = async () => {
//     if (!window.confirm("상담 기록을 저장/수정 하시겠습니까?")) return;
//     setSaving(true);
//     try {
//       // saveRecord 함수는 이미 API에 존재함
//       // 저장 후 상태 갱신은 필요 없음
//       await saveRecord(scheduleId, notes, record?.keywords);
//       alert("상담 기록이 성공적으로 업데이트되었습니다.");
//     } catch (error) {
//       alert("기록 저장 실패: " + error.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div>로딩 중...</div>;
//   if (error) return <div style={{ color: "red" }}>🚨 에러: {error}</div>;
//   if (!record) return <div>상담 기록이 존재하지 않습니다.</div>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>교수용 상담 기록 상세 (ID: {scheduleId})</h2>
//       <p>
//         <strong>상담 일시:</strong>
//         {new Date(record.counselingSchedule?.startTime).toLocaleString()}
//       </p>

//       <p>
//         <strong>상담 내용 (수정 가능):</strong>
//       </p>

//       <textarea
//         value={notes}
//         onChange={(e) => setNotes(e.target.value)}
//         rows={10}
//         style={{ width: "100%", marginBottom: "10px" }}
//       />

//       <button onClick={handleSave} disabled={saving}>
//         {saving ? "저장 중..." : "기록 저장/수정"}
//       </button>

//       <p style={{ marginTop: "10px" }}>
//         * 이 내용은 STT 요약 결과가 저장되는 곳이며, 수정 후 다시 저장할 수
//         있습니다.
//       </p>
//     </div>
//   );
// };

// export default CounselingDetailForProfessor;
