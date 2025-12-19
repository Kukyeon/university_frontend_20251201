// BookAppointment.js

import React, { useEffect, useState } from "react";
import {
  getProfessorsByMyDepartment,
  getAvailableTimesByProfessor,
  bookAppointment, // 💡 bookAppointment API 함수
} from "../../api/scheduleApi";
import "../../pages/SchedulePage.css";

import ProfessorTimePicker from "./ProfessorTimePicker";

const BookAppointment = ({ user, onBooked }) => {
  const studentId = user.id;
  const [professors, setProfessors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!studentId) return;
    const fetchInitialData = async () => {
      try {
        setLoading(true); // 1. 본인 학과 정보 가져오기
        const profs = await getProfessorsByMyDepartment();
        setProfessors(profs);
      } catch (err) {
        alert("상담 예약 정보를 불러오는 데 실패했습니다 (인증 확인 필요).");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [studentId]);

  const handleProfessorSelect = async (prof) => {
    setSelectedProfessor(prof);
    setSlots([]);
    setLoading(true);
    try {
      const times = await getAvailableTimesByProfessor(prof.id);
      setSlots(times);
    } catch (e) {
      console.error("교수 예약 가능 시간 로드 실패:", e);
      console.error(
        "🔥 예약 가능 시간 조회 실패:",
        e.response?.data || e.message
      );
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }; // 💡 [수정] handleBook 함수: 슬롯 ID와 시간 문자열을 받아 예약 처리

  const handleBook = async (availabilityId, time) => {
    try {
      await bookAppointment(availabilityId); //
      alert(
        `✅ ${time} 슬롯에 예약 신청이 완료되었습니다. 교수님의 승인을 기다려주세요.`
      ); // 예약 후 새로고침 (slots 재조회) // 예약 직후 해당 슬롯이 화면에서 사라지도록 슬롯 목록을 재로딩합니다.

      handleProfessorSelect(selectedProfessor); // 부모 컴포넌트(StudentSchedulePage)에게 목록 갱신을 요청합니다.
      if (onBooked) onBooked();
    } catch (e) {
      // 💡 [수정] 오류 처리 메시지 개선
      const errorMessage =
        e.response?.data?.message ||
        "예약 신청 중 알 수 없는 오류가 발생했습니다.";
      alert(`❌ 예약 실패: ${errorMessage}`);
    }
  };

  if (!studentId)
    return <div className="info-message">로그인 후 이용해주세요.</div>;
  if (loading && professors.length === 0)
    return <div className="loading-text">내 학과 교수 목록 로딩 중...</div>;

  return (
    <>
      <h3>상담 예약</h3>
      {/* ② 교수 선택 */}
      {professors.length === 0 && !loading && (
        <p>현재 학과에 등록된 교수님이 없습니다.</p>
      )}

      <div>
        {professors.length === 0 && !loading ? (
          <p>현재 학과에 등록된 교수님이 없습니다.</p>
        ) : (
          <select
            value={selectedProfessor?.id || ""}
            onChange={(e) => {
              const prof = professors.find(
                (p) => p.id === Number(e.target.value)
              );
              if (prof) handleProfessorSelect(prof);
            }}
          >
            <option value="" disabled>
              교수님 선택
            </option>
            {professors.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} 교수님
              </option>
            ))}
          </select>
        )}
      </div>
      {/* ③ 달력 컴포넌트 렌더링 */}
      {selectedProfessor && (
        <ProfessorTimePicker
          professor={selectedProfessor}
          studentId={studentId}
          onBooked={onBooked}
          slots={slots}
          loading={loading}
          bookAppointment={handleBook} // 💡 [추가] handleBook 함수를 prop으로 전달
        />
      )}
    </>
  );
};
export default BookAppointment;
