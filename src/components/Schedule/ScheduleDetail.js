import React, { useEffect, useState } from "react";
import { getScheduleDetail } from "../../api/scheduleApi";

const ScheduleDetail = ({ id }) => {
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const data = await getScheduleDetail(id);
        setSchedule(data);
      } catch (error) {
        console.error("상세 조회 실패:", error.message);
      }
    };

    fetchDetail();
  }, [id]);

  if (!schedule) return <div>로딩중...</div>;

  return (
    <table border="1" style={{ marginTop: "10px" }}>
      <tbody>
        <tr>
          <td>시작시간</td>
          <td>{schedule.startTime}</td>
        </tr>
        <tr>
          <td>종료시간</td>
          <td>{schedule.endTime}</td>
        </tr>
        <tr>
          <td>내용</td>
          <td>{schedule.notes || schedule.information}</td>
        </tr>
        <tr>
          <td>상태</td>
          <td>{schedule.status}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default ScheduleDetail;
