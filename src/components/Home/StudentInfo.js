import React from "react";
import { Link } from "react-router-dom";
import NotificationBell from "../Chatbot/NotificationBell";

const StudentInfo = ({ user, role, logout }) => {
  console.log(user);
  const renderAffiliation = () => {
    if (role === "student") {
      return user.department?.name;
    } else if (role === "professor") {
      return `${user.department?.college.name} ${user.department?.name} 교수`;
    } else if (role === "staff") {
      return "교직원";
    }
    return "";
  };
  return (
    <section className="student-info">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {role === "student" && (
          <h2>
            {user?.name}({user.id})
          </h2>
        )}
        {role !== "student" && <h2>환영합니다</h2>}
        {/* ★ 여기에 알림벨 추가 (user prop으로 student 정보 전달) */}
        <NotificationBell user={user} />
      </div>
      <div className="student-profile">
        <span className="material-symbols-outlined profile-icon">
          account_circle
        </span>
        <div className="student-details">
          <p>
            <strong>{user?.name}</strong>님, 환영합니다.
          </p>
        </div>
        <ul>
          <li>
            <span>이메일</span>
            <span>{user?.email}</span>
          </li>
          <li>
            <span>소속</span>
            <span>{renderAffiliation()}</span>
          </li>
          {role === "student" && (
            <li>
              <span>학기</span>
              <span>
                {user?.grade}학년 {user?.semester}학기
              </span>
            </li>
          )}
          {role === "student" && (
            <li>
              <span>학적상태</span>
              <span>{user?.currentStatus?.status}</span>
            </li>
          )}
        </ul>
      </div>
      <div className="student-actions">
        <button className="btn">
          <Link to={"/my"}> 마이페이지</Link>
        </button>
        <button className="btn logout" onClick={logout}>
          로그아웃
        </button>
      </div>
    </section>
  );
};

export default StudentInfo;
