// src/components/Schedule/ScheduleForm.js
import React, { useState, useEffect } from "react";
import {
  createSchedule,
  updateSchedule,
  getScheduleDetail,
} from "../../api/scheduleApi";

const ScheduleForm = ({ id, onSubmit }) => {
  const [form, setForm] = useState({
    startDay: "",
    endDay: "",
    information: "",
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const data = await getScheduleDetail(id);
        setForm(data);
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await updateSchedule(id, form);
    else await createSchedule(form);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="schedule-form">
      <table>
        <tbody>
          <tr>
            <td>시작날짜</td>
            <td>
              <input
                type="date"
                name="startDay"
                value={form.startDay}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>종료날짜</td>
            <td>
              <input
                type="date"
                name="endDay"
                value={form.endDay}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>내용</td>
            <td>
              <input
                type="text"
                name="information"
                value={form.information}
                onChange={handleChange}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button type="submit">저장</button>
    </form>
  );
};

export default ScheduleForm;
