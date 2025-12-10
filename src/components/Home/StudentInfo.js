import React from "react";
import { Link } from "react-router-dom";
import NotificationBell from "../Chatbot/NotificationBell";
const StudentInfo = ({ student, logout }) => {
  return (
    <section className="student-info">
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>학생 정보</h2>
        {/* ★ 여기에 알림벨 추가 (user prop으로 student 정보 전달) */}
        <NotificationBell user={student} />
      </div>
      <div className="student-profile">
        <span className="material-symbols-outlined profile-icon">
          account_circle
        </span>
        <div className="student-details">
          <p>
            <strong>{student?.name}</strong> ({student?.id})
          </p>
        </div>
        <ul>
          <li>
            <span>이메일</span>
            <span>{student?.email}</span>
          </li>
          <li>
            <span>소속</span>
            <span>{student?.department?.name}</span>
          </li>
          <li>
            <span>학기</span>
            <span>
              {student?.grade}학년 {student?.semester}학기
            </span>
          </li>
          <li>
            <span>학적상태</span>
            <span>{student?.status}</span>
          </li>
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
