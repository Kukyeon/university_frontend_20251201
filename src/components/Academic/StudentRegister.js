import React, { useState } from "react";
import api from "../../api/axiosConfig";

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "남성",
    address: "",
    tel: "",
    email: "",
    departmentNo: "",
    entranceDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await api.post("/staff/student");
    console.log("학생 등록 데이터:", formData);
    alert("학생 등록 완료! (API 연결 전 임시 기능)");
    setFormData({
      name: "",
      birthDate: "",
      gender: "남성",
      address: "",
      tel: "",
      email: "",
      departmentNo: "",
      entranceDate: "",
    });
  };

  return (
    <div className="student-form-vertical mypage-card">
      <h3>학생 등록</h3>

      <div className="form-row">
        <label>이름</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label>생년월일</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label>성별</label>
        <div className="gender-radio-group">
          <label>
            남성
            <input
              type="radio"
              name="gender"
              value="남성"
              checked={formData.gender === "남성"}
              onChange={handleChange}
            />
          </label>
          <label>
            여성
            <input
              type="radio"
              name="gender"
              value="여성"
              checked={formData.gender === "여성"}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      <div className="form-row">
        <label>주소</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label>전화번호</label>
        <input
          type="text"
          name="tel"
          value={formData.tel}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label>이메일</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label>과 ID</label>
        <input
          type="text"
          name="departmentNo"
          value={formData.departmentNo}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <label>입학일</label>
        <input
          type="date"
          name="entranceDate"
          value={formData.entranceDate}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit}>등록</button>
      </div>
    </div>
  );
};

export default StudentRegister;
