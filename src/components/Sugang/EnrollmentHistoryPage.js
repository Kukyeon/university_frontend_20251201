import React, { useState, useEffect } from "react";
import { courseApi } from "../../api/gradeApi";

const EnrollmentHistoryPage = ({ setPageHeader, setActiveTab }) => {
  // 1. 상태 관리
  const [basketList, setBasketList] = useState([]);
  const [successList, setSuccessList] = useState([]);
  const [period, setPeriod] = useState(null); // 0:장바구니, 1:본수강, 2:종료
  const [totalCredits, setTotalCredits] = useState(0);

  // 2. 초기 데이터 로드
  useEffect(() => {
    loadInitData();
  }, []);

  const loadInitData = async () => {
    try {
      const pRes = await courseApi.getSugangPeriod();
      const currentPeriod = pRes.data.period;
      setPeriod(currentPeriod);

      // 기간 2(종료)면 장바구니는 비웁니다.
      if (currentPeriod === 2) {
        setBasketList([]);
      } else {
        // 기간 0, 1이면 장바구니 조회
        const basketRes = await courseApi.getMyBasket();
        setBasketList(basketRes.data || []);
      }

      // 기간 1, 2이면 실제 신청 내역 조회
      if (currentPeriod >= 1) {
        const successRes = await courseApi.getMyHistory();
        setSuccessList(successRes.data || []);

        const credits = (successRes.data || []).reduce(
          (acc, cur) => acc + (cur.subject?.grades || 0),
          0
        );
        setTotalCredits(credits);
      } else {
        setSuccessList([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- 핸들러 ---

  // 장바구니 -> 실제 신청 (기간 1일 때만 동작)
  const handleRegisterFromBasket = async (subject) => {
    if (!window.confirm(`[${subject.name}] 강의를 신청하시겠습니까? (선착순)`))
      return;
    try {
      await courseApi.register(subject.id);
      alert("✅ 신청 성공!");
      loadInitData(); // 목록 갱신 (성공 목록으로 이동)
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
    <>
      <h3>
        {period === 0 && "예비 수강신청 내역"}
        {period === 1 && "수강신청 현황"}
        {period === 2 && "수강 신청내역 확인"}
      </h3>
      {/* 1. 상단 컨트롤 영역 */}
      <div
        className="history-header-controls"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        {period !== 2 && (
          <button
            className="navigate-btn"
            onClick={() => setActiveTab("수강 신청")}
          >
            {period === 0 ? "강의 담으러 가기" : "강의 목록 보러가기"}
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
          <h3>
            장바구니 목록{" "}
            {period === 1 && (
              <span
                className="section-note text-red"
                style={{ fontSize: "0.8em" }}
              >
                (클릭하여 바로 신청하세요!)
              </span>
            )}
          </h3>
          <div className="table-wrapper">
            <table className="course-table">
              <thead>
                <tr>
                  <th>학수번호</th>
                  <th>강의명</th>
                  <th>담당교수</th>
                  <th>학점</th>
                  <th>요일/시간 (강의실)</th>

                  {/* ★ 핵심 변경 1: 기간에 따라 헤더 텍스트 변경 */}
                  <th>{period === 0 ? "담은인원" : "현재/정원"}</th>

                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {basketList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-row">
                      장바구니가 비었습니다.
                    </td>
                  </tr>
                ) : (
                  basketList.map((item) => {
                    const sub = item.subject || item;

                    // 이미 성공 목록에 있는지 확인
                    const isAlreadySuccess = successList.some(
                      (s) => s.subject.id === sub.id
                    );
                    // 정원 마감 여부 (기간 1일 때만 유효)
                    const isFull =
                      period === 1 && sub.numOfStudent >= sub.capacity;

                    return (
                      <tr
                        key={sub.id}
                        className={isAlreadySuccess ? "disabled-row" : ""}
                        style={{ opacity: isAlreadySuccess ? 0.5 : 1 }}
                      >
                        <td>{sub.id}</td>
                        <td className="text-bold">{sub.name}</td>
                        <td>{sub.professor?.name}</td>
                        <td>{sub.grades}</td>
                        <td>
                          {sub.subDay} {sub.startTime}~{sub.endTime} (
                          {sub.room.id})
                        </td>

                        {/* ★ 핵심 변경 2: 데이터 표시 로직 */}
                        <td style={{ fontWeight: "bold" }}>
                          {period === 0 ? (
                            // [기간 0] 찜한 인원수 표시 (basketCount)
                            <span style={{ color: "#f08c00" }}>
                              ❤️ {sub.basketCount || 0}
                            </span>
                          ) : (
                            // [기간 1] 실제 경쟁률 표시
                            <span style={{ color: isFull ? "red" : "black" }}>
                              {sub.numOfStudent} / {sub.capacity}
                            </span>
                          )}
                        </td>

                        <td>
                          {/* ★ 핵심 변경 3: 버튼 표시 로직 */}
                          {period === 0 ? (
                            // [기간 0] 삭제 버튼만 존재
                            <button
                              className="btn-danger"
                              onClick={() => handleDeleteBasket(sub.id)}
                            >
                              삭제
                            </button>
                          ) : isAlreadySuccess ? (
                            // [기간 1] 이미 신청된 경우
                            <button className="btn-disabled" disabled>
                              신청완료
                            </button>
                          ) : (
                            // [기간 1] 신청 가능 상태
                            <div className="btn-group">
                              <button
                                className={isFull ? "btn-full" : "btn-primary"}
                                disabled={isFull}
                                onClick={() => handleRegisterFromBasket(sub)}
                              >
                                {isFull ? "마감" : "신청"}
                              </button>
                              {/* <button
                              className="btn-danger small"
                              onClick={() => handleDeleteBasket(sub.id)}
                            >
                              삭제
                            </button> */}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 3. 확정 목록 (기간 1 이상일 때 표시) */}
      {period >= 1 && (
        <section className="section">
          <h3>수강 확정 목록</h3>
          <div className="table-wrapper">
            <table className="course-table">
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
          </div>
        </section>
      )}
    </>
  );
};

export default EnrollmentHistoryPage;
