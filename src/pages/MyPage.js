import React, { useState } from "react";

const MyPage = ({ user }) => {
  const [userData, setUserData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // 임시: console.log
    console.log("저장할 데이터:", userData);
    // 나중에 API 호출해서 DB에 저장
  };

  return (
    <div className="mypage-container">
      <h2>마이페이지</h2>

      <div>
        <label>이름</label>
        <input name="name" value={userData.name} onChange={handleChange} />
      </div>

      <div>
        <label>학번/아이디</label>
        <input name="id" value={userData.id} onChange={handleChange} />
      </div>

      <div>
        <label>이메일</label>
        <input name="email" value={userData.email} onChange={handleChange} />
      </div>

      <button onClick={handleSave}>저장</button>
    </div>
  );
};

export default MyPage;
