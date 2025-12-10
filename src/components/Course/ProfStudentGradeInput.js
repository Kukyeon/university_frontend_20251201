import React, { useState } from "react";

const ProfStudentGradeInput = ({ student, courseId, goBack }) => {
  const [form, setForm] = useState({
    absent: "",
    late: "",
    assignment: "",
    midterm: "",
    final: "",
    total: "",
    grade: "A+",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="grade-input-container">
      <h2>학생 성적 기입</h2>
      <button onClick={goBack}>← 학생 리스트로</button>

      <div>
        <p>
          <strong>학생 번호 :</strong> {student.studentId}
        </p>
        <p>
          <strong>이름 :</strong> {student.name}
        </p>
      </div>

      <div className="grade-form">
        <label>결석</label>
        <input name="absent" onChange={handleChange} />

        <label>지각</label>
        <input name="late" onChange={handleChange} />

        <label>과제점수</label>
        <input name="assignment" onChange={handleChange} />

        <label>중간시험</label>
        <input name="midterm" onChange={handleChange} />

        <label>기말시험</label>
        <input name="final" onChange={handleChange} />

        <label>환산점수</label>
        <input name="total" onChange={handleChange} />

        <label>등급</label>
        <select name="grade" onChange={handleChange}>
          <option>A+</option>
          <option>A0</option>
          <option>B+</option>
          <option>B0</option>
          <option>C+</option>
          <option>C0</option>
          <option>D+</option>
          <option>D0</option>
          <option>F</option>
        </select>
      </div>
    </div>
  );
};

export default ProfStudentGradeInput;
