import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import NotificationBell from "../Chatbot/NotificationBell";
import "./StudentInfo.css";
const StudentInfo = ({ user, role, logout }) => {
  const { openChatbot } = useOutletContext();
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
  console.log("🔥 StudentInfo openChatbot:", openChatbot);

  return (
    <section className="student-info">
      <div className="student-info__header">
        {role === "student" && (
          <h2 className="student-info__title">
            {user?.name}({user.id})
          </h2>
        )}
        {role !== "student" && (
          <h2 className="student-info__title">환영합니다</h2>
        )}
        <NotificationBell user={user} openChatbot={openChatbot} />
      </div>

      <div className="student-info__profile">
        <span className="material-symbols-outlined student-info__icon">
          account_circle
        </span>
        <div className="student-info__details">
          <p>
            <strong>{user?.name}</strong>님, 환영합니다.
          </p>
        </div>
        <ul className="student-info__list">
          <li className="student-info__list-item">
            <span>이메일</span>
            <span>{user?.email}</span>
          </li>
          <li className="student-info__list-item">
            <span>소속</span>
            <span>{renderAffiliation()}</span>
          </li>
          {role === "student" && (
            <li className="student-info__list-item">
              <span>학기</span>
              <span>
                {user?.grade}학년 {user?.semester}학기
              </span>
            </li>
          )}
          {role === "student" && (
            <li className="student-info__list-item">
              <span>학적상태</span>
              <span>{user?.currentStatus?.status}</span>
            </li>
          )}
        </ul>
      </div>

      <div className="student-info__actions">
        <Link to="/my" className="student-info__btn">
          마이페이지
        </Link>
        <button
          className="student-info__btn student-info__btn--logout"
          onClick={logout}
        >
          로그아웃
        </button>
      </div>
    </section>
  );
};

export default StudentInfo;
