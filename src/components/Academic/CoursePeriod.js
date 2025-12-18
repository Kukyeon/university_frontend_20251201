import React, { useState, useEffect } from "react";
import { getSugangPeriod, updateSugangPeriod } from "../../api/sugangApi";
import { useModal } from "../ModalContext";

const CoursePeriod = () => {
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await getSugangPeriod();
      setStatus(data.period);
    } catch (err) {
      showModal({
        type: "alert",
        message:
          err.response?.data?.message ||
          err.message ||
          "수강신청 기간 변경중 오류가 발생했습니다.",
      });
    }
  };

  const handleStart = async () => {
    setLoading(true);
    showModal({
      type: "confirm",
      message: "수강 신청 기간을 시작하시겠습니까?",
      onConfirm: async () => {
        try {
          await updateSugangPeriod(1);
          setStatus(1);
          showModal({
            type: "alert",
            message: "이번 학기 수강 신청 기간이 시작되었습니다.",
          });
        } catch (err) {
          showModal({
            type: "alert",
            message: "오류가 발생했습니다.",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleEnd = async () => {
    showModal({
      type: "confirm",
      message: "수강 신청 기간을 종료하시겠습니까?",
      onConfirm: async () => {
        setLoading(true);
        try {
          await updateSugangPeriod(2);
          setStatus(2);
          showModal({
            type: "alert",
            message: "이번 학기 수강 신청 기간이 종료되었습니다.",
          });
        } catch (err) {
          showModal({
            type: "alert",
            message: "오류가 발생했습니다.",
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <>
      <h3>수강 신청 기간 설정</h3>

      {loading && <p>데이터 처리 중입니다...</p>}

      {!loading && (
        <>
          <div>
            {status === 0 && (
              <>
                <p>
                  현재 <strong>예비 수강 신청 기간</strong>입니다.
                </p>
                <button onClick={handleStart}>수강 신청 시작</button>
              </>
            )}

            {status === 1 && (
              <>
                <p>
                  현재 <strong>수강 신청 진행 중</strong>입니다.
                </p>
                <button onClick={handleEnd}>수강 신청 종료</button>
              </>
            )}

            {status === 2 && (
              <p>
                이번 학기 수강 신청이 <strong>종료</strong>되었습니다.
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CoursePeriod;
