import React, { useState } from "react";
import api from "../../api/axiosConfig";

const ProfessorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "남성",
    address: "",
    tel: "",
    email: "",
    department: {
      id: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "departmentNo") {
      setFormData((prev) => ({
        ...prev,
        department: { ...prev.department, id: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async () => {
    try {
      const res = await api.post("/staff/professor", formData); // formData 전송
      console.log("교수 등록 성공:", res.data);
      alert("교수 등록 완료!");
      // 폼 초기화
      setFormData({
        name: "",
        birthDate: "",
        gender: "남성",
        address: "",
        tel: "",
        email: "",
        department: {
          id: "",
        },
      });
    } catch (err) {
      console.error(err);
      alert("교수 등록 실패: " + err.response?.data?.message || err.message);
    }
  };
  return (
    <div className="student-form-vertical mypage-card">
      <h3>교수 등록</h3>
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
          value={formData.department.id}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit}>등록</button>
      </div>
    </div>
  );
};

export default ProfessorRegister;
