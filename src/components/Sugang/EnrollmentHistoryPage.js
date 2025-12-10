import React, { useState, useEffect } from "react";
import { courseApi } from "../../api/gradeApi";

const EnrollmentHistoryPage = ({ setPageHeader, setActiveTab }) => {
  const [basketList, setBasketList] = useState([]);
  const [successList, setSuccessList] = useState([]);
  const [period, setPeriod] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);

  useEffect(() => {
    loadInitData();
  }, []);
  useEffect(() => {
    if (period === 0) {
      setPageHeader("예비 수강신청 내역");
    } else if (period === 1 || period === 2) {
      setPageHeader("수강신청 현황");
    }
  }, [period]);

  const loadInitData = async () => {
    try {
      const pRes = await courseApi.getSugangPeriod();
      setPeriod(pRes.data.period);

      if (pRes.data.period === 0) {
        const res = await courseApi.getMyBasket();
        setBasketList(res.data || []);
      } else {
        const basketRes = await courseApi.getMyBasket();
        const successRes = await courseApi.getMyHistory();

        setBasketList(basketRes.data || []);
        setSuccessList(successRes.data || []);

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

  const handleRegisterFromBasket = async (subject) => {
    if (!window.confirm(`[${subject.name}] 수강신청 하시겠습니까?`)) return;
    try {
      await courseApi.register(subject.id);
      alert("신청 성공!");
      loadInitData();
    } catch (err) {
      alert("신청 실패: " + (err.response?.data || "오류"));
    }
  };

  const handleDeleteBasket = async (subjectId) => {
    if (!window.confirm("장바구니에서 삭제하시겠습니까?")) return;
    try {
      await courseApi.cancel(subjectId);
      alert("삭제 완료");
      loadInitData();
    } catch {
      alert("삭제 실패");
    }
  };

  const handleCancelSuccess = async (subjectId) => {
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
      {/* 상단 제목 + 버튼 */}
      <div>
        {period !== 2 && (
          <button
            className="navigate-btn"
            onClick={() => setActiveTab("수강 신청")}
          >
            {period === 0 ? "강의 담으러 가기" : "강의 신청목록으로"}
          </button>
        )}

        {period !== 0 && (
          <div className="credit-box">
            신청 학점: <span>{totalCredits}</span> / 18
          </div>
        )}
      </div>

      {/* 장바구니 */}
      {(period === 0 || period === 1) && (
        <section className="section">
          <h3 className="section-title">
            수강신청 목록{" "}
            {period === 1 && (
              <span className="section-note">(클릭하여 신청 가능)</span>
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
                <th>처리</th>
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
                      <td className={isFull ? "text-red" : ""}>
                        {sub.numOfStudent}
                      </td>
                      <td>{sub.capacity}</td>
                      <td>
                        {period === 0 ? (
                          <button
                            className="btn-danger"
                            onClick={() => handleDeleteBasket(sub.id)}
                          >
                            삭제
                          </button>
                        ) : isAlreadySuccess ? (
                          <button className="btn-disabled">신청완료</button>
                        ) : (
                          <button
                            className={isFull ? "btn-full" : "btn-primary"}
                            disabled={isFull}
                            onClick={() => handleRegisterFromBasket(sub)}
                          >
                            {isFull ? "마감" : "신청하기"}
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

      {/* 확정 목록 */}
      {period >= 1 && (
        <section className="section">
          <h3 className="section-title blue">수강 확정 목록</h3>

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
                {/* <th>처리</th> */}
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
                      {/* <td>
                        <button
                          className="btn-danger"
                          onClick={() => handleCancelSuccess(sub.id)}
                        >
                          취소
                        </button>
                      </td> */}
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
