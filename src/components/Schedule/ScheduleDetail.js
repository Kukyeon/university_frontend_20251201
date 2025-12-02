import React, { useEffect, useState } from "react";
import { getScheduleDetail } from "../../api/scheduleApi";

const ScheduleDetail = ({ id }) => {
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getScheduleDetail(id);
      setSchedule(data);
    };
    fetchDetail();
  }, [id]);

  if (!schedule) return <div>로딩중...</div>;

  return (
    <table className="table">
      <tbody>
        <tr>
          <td>시작날짜</td>
          <td>{schedule.startDay}</td>
        </tr>
        <tr>
          <td>종료날짜</td>
          <td>{schedule.endDay}</td>
        </tr>
        <tr>
          <td>내용</td>
          <td>{schedule.information}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default ScheduleDetail;
