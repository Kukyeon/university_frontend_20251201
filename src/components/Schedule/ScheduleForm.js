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
    <form onSubmit={handleSubmit} className="change-password-form">
      <div className="input-group">
        <label>시작날짜</label>
        <input
          type="date"
          name="startDay"
          value={form.startDay}
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <label>종료날짜</label>
        <input
          type="date"
          name="endDay"
          value={form.endDay}
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <label>내용</label>
        <input
          type="text"
          name="information"
          value={form.information}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn-save">
        저장
      </button>
    </form>
  );
};

export default ScheduleForm;
