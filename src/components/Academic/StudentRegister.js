import React, { useState } from "react";
import api from "../../api/axiosConfig";
import { useModal } from "../ModalContext";

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "남성",
    address: "",
    tel: "",
    email: "",
    department: { id: "" },
    entranceDate: "",
  });
  const { showModal } = useModal();
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
      await api.post("/staff/student", formData);
      showModal({
        type: "alert",
        message: "학생 등록을 완료하였습니다.",
      });
      setFormData({
        name: "",
        birthDate: "",
        gender: "남성",
        address: "",
        tel: "",
        email: "",
        department: { id: "" },
        entranceDate: "",
      });
    } catch (err) {
      showModal({
        type: "alert",
        message:
          err.response?.data?.message ||
          err.message ||
          "학생 등록을 실패했습니다.",
      });
    }
  };

  return (
    <>
      <h3>학생 등록</h3>

      {/* 입력 필드 */}
      {[
        { label: "이름", name: "name", type: "text" },
        { label: "생년월일", name: "birthDate", type: "date" },
        { label: "주소", name: "address", type: "text" },
        { label: "전화번호", name: "tel", type: "text" },
        { label: "이메일", name: "email", type: "email" },
        {
          label: "과 ID",
          name: "departmentNo",
          type: "text",
          value: formData.department.id,
        },
        { label: "입학일", name: "entranceDate", type: "date" },
      ].map((field) => (
        <div className="input-group" key={field.name}>
          <label>{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={field.value ?? formData[field.name]}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* 성별 라디오 */}
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

      <div className="form-actions">
        <button className="primary-btn" onClick={handleSubmit}>
          등록
        </button>
      </div>
    </>
  );
};

export default StudentRegister;
