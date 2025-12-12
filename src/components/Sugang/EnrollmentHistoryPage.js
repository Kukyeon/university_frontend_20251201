import React, { useState, useEffect } from "react";
import { courseApi } from "../../api/gradeApi";

const EnrollmentHistoryPage = ({ setPageHeader, setActiveTab }) => {
  // 1. 상태 관리
  const [basketList, setBasketList] = useState([]);
  const [successList, setSuccessList] = useState([]);
  const [period, setPeriod] = useState(null); // 0:장바구니, 1:본수강, 2:종료
  const [totalCredits, setTotalCredits] = useState(0);

  // 2. 초기 데이터 로드 및 헤더 설정
  useEffect(() => {
    loadInitData();
  }, []);

  // 상위 컴포넌트(Header) 텍스트 변경
  useEffect(() => {
    if (period === 0) {
      setPageHeader("예비 수강신청 내역 (장바구니)");
    } else if (period === 1) {
      setPageHeader("수강신청 현황");
    } else if (period === 2) {
      setPageHeader("수강신청 종료 (내역 확인)");
    }
  }, [period, setPageHeader]);

  const loadInitData = async () => {
    try {
      const pRes = await courseApi.getSugangPeriod();
      setPeriod(pRes.data.period);
      const currentPeriod = pRes.data.period;

      if (currentPeriod === 0) {
        // 장바구니 기간: 장바구니만 조회
        const res = await courseApi.getMyBasket();
        setBasketList(res.data || []);
      } else {
        // 본 수강 기간 이후: 장바구니 + 확정 내역 조회
        const basketRes = await courseApi.getMyBasket();
        const successRes = await courseApi.getMyHistory();

        setBasketList(basketRes.data || []);
        setSuccessList(successRes.data || []);

        // ★ 학점 계산 로직 (두 번째 코드 적용)
        const credits = (successRes.data || []).reduce(
          (acc, cur) => acc + (cur.subject?.grades || 0),
          0
        );
        setTotalCredits(credits);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- 핸들러 (두 번째 코드의 상세 로직 적용) ---

  const handleRegisterFromBasket = async (subject) => {
    if (!window.confirm(`[${subject.name}] 수강신청 하시겠습니까?`)) return;
    try {
      await courseApi.register(subject.id);
      alert("✅ 신청 성공!");
      loadInitData();
    } catch (err) {
      alert("❌ 신청 실패: " + (err.response?.data || "오류"));
    }
  };

  const handleDeleteBasket = async (subjectId) => {
    if (!window.confirm("장바구니에서 삭제하시겠습니까?")) return;
    try {
      await courseApi.cancel(subjectId);
      alert("🗑️ 삭제 완료");
      loadInitData();
    } catch {
      alert("삭제 실패");
    }
  };

  const handleCancelSuccess = async (subjectId) => {
    // ★ 기간 종료 시 취소 방지 로직 (두 번째 코드)
    if (period === 2) {
      alert("수강신청 기간이 종료되어 취소할 수 없습니다.");
      return;
    }

    if (!window.confirm("정말 수강을 취소하시겠습니까?")) return;
    try {
      await courseApi.cancel(subjectId);
      alert("취소 완료");
      loadInitData();
    } catch {
      alert("취소 실패");
    }
  };

  return (
    <div className="sugang-container">
      {/* 1. 상단 컨트롤 영역 */}
      <div className="history-header-controls">
        {period !== 2 && (
          <button
            className="navigate-btn"
            onClick={() => setActiveTab("수강 신청")}
          >
            {period === 0 ? "➕ 강의 담으러 가기" : "➕ 강의 신청목록으로"}
          </button>
        )}

        {period !== 0 && (
          <div className="credit-box">
            신청 학점: <span>{totalCredits}</span> / 18
          </div>
        )}
      </div>

      {/* 2. 장바구니 목록 (기간 0, 1일 때 표시) */}
      {(period === 0 || period === 1) && (
        <section className="section">
          <h3 className="section-title">
            🛒 장바구니 목록{" "}
            {period === 1 && (
              <span className="section-note text-red">
                (클릭하여 바로 신청하세요!)
              </span>
            )}
          </h3>

          <table className="styled-table">
            <thead>
              <tr>
                <th>학수번호</th>
                <th>강의명</th>
                <th>담당교수</th>
                <th>학점</th>
                <th>요일/시간 (강의실)</th>
                <th>현재인원</th>
                <th>정원</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {basketList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    장바구니가 비었습니다.
                  </td>
                </tr>
              ) : (
                basketList.map((item) => {
                  const sub = item.subject || item;
                  // ★ 두 번째 코드의 상태 판단 로직
                  const isAlreadySuccess = successList.some(
                    (s) => s.subject.id === sub.id
                  );
                  const isFull = sub.numOfStudent >= sub.capacity;

                  return (
                    <tr
                      key={sub.id}
                      className={isAlreadySuccess ? "disabled-row" : ""}
                    >
                      <td>{sub.id}</td>
                      <td className="text-bold">{sub.name}</td>
                      <td>{sub.professor?.name}</td>
                      <td>{sub.grades}</td>
                      <td>
                        {sub.subDay} {sub.startTime}~{sub.endTime} (
                        {sub.room.id})
                      </td>
                      <td className={isFull ? "text-red bold" : ""}>
                        {sub.numOfStudent}
                      </td>
                      <td>{sub.capacity}</td>
                      <td>
                        {/* 버튼 렌더링 로직 통합 */}
                        {period === 0 ? (
                          // 예비 기간: 삭제 버튼만
                          <button
                            className="btn-danger"
                            onClick={() => handleDeleteBasket(sub.id)}
                          >
                            삭제
                          </button>
                        ) : isAlreadySuccess ? (
                          // 이미 신청된 경우
                          <button className="btn-disabled" disabled>
                            신청완료
                          </button>
                        ) : (
                          // 본 수강 기간 + 미신청 상태
                          <div className="btn-group">
                            <button
                              className={isFull ? "btn-full" : "btn-primary"}
                              disabled={isFull}
                              onClick={() => handleRegisterFromBasket(sub)}
                            >
                              {isFull ? "마감" : "신청"}
                            </button>
                            <button
                              className="btn-danger small"
                              onClick={() => handleDeleteBasket(sub.id)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* 3. 확정 목록 (기간 1 이상일 때 표시) */}
      {period >= 1 && (
        <section className="section">
          <h3 className="section-title blue">✅ 수강 확정 목록</h3>

          <table className="styled-table">
            <thead>
              <tr>
                <th>학수번호</th>
                <th>강의명</th>
                <th>담당교수</th>
                <th>학점</th>
                <th>요일/시간 (강의실)</th>
                <th>현재인원</th>
                <th>정원</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {successList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    신청된 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                successList.map((item) => {
                  const sub = item.subject;
                  return (
                    <tr key={sub.id}>
                      <td>{sub.id}</td>
                      <td className="text-blue bold">{sub.name}</td>
                      <td>{sub.professor?.name}</td>
                      <td>{sub.grades}</td>
                      <td>
                        {sub.subDay} {sub.startTime}~{sub.endTime} (
                        {sub.room.id})
                      </td>
                      <td>{sub.numOfStudent}</td>
                      <td>{sub.capacity}</td>
                      <td>
                        {period === 2 ? (
                          <span className="text-gray bold">취소불가</span>
                        ) : (
                          <button
                            className="btn-danger"
                            onClick={() => handleCancelSuccess(sub.id)}
                          >
                            취소
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default EnrollmentHistoryPage;