import React, { useEffect, useState } from "react";
import "./MyPage.css";
import ChangePw from "../components/MyPage/ChangePw";
import MyInfo from "../components/MyPage/MyInfo";
import BreakApp from "../components/MyPage/BreakApp";
import BreakHistory from "../components/MyPage/BreakHistory";
import TuitionNotice from "../components/MyPage/TuitionNotice";
import TuitionHistory from "../components/MyPage/TuitionHistory";

const MyPage = ({ user, role }) => {
  const [activeTab, setActiveTab] = useState("myInfo");

  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user) {
      setUserData({ ...user });
    }
  }, [user]);
  console.log(user);
  if (!user) return <div>로그인 정보를 불러오는 중...</div>;

  return (
    <div className="mypage-container">
      {/* 좌측 메뉴 */}
      <aside className="mypage-sidebar">
        <h2>MY</h2>
        <ul>
          <li
            className={activeTab === "myInfo" ? "active" : ""}
            onClick={() => setActiveTab("myInfo")}
          >
            내 정보 조회
          </li>
          <li
            className={activeTab === "changePw" ? "active" : ""}
            onClick={() => setActiveTab("changePw")}
          >
            비밀번호 변경
          </li>
          {role === "student" && (
            <>
              <li
                className={activeTab === "leave" ? "active" : ""}
                onClick={() => setActiveTab("leave")}
              >
                휴학 신청
              </li>
              <li
                className={activeTab === "leaveHistory" ? "active" : ""}
                onClick={() => setActiveTab("leaveHistory")}
              >
                휴학 내역 조회
              </li>
              <li
                className={activeTab === "tuitionHistory" ? "active" : ""}
                onClick={() => setActiveTab("tuitionHistory")}
              >
                등록금 내역 조회
              </li>
              <li
                className={activeTab === "tuitionNotice" ? "active" : ""}
                onClick={() => setActiveTab("tuitionNotice")}
              >
                등록금 납부 고지서
              </li>
            </>
          )}
        </ul>
      </aside>

      {/* 우측 컨텐츠 */}
      <main className="mypage-content">
        {activeTab === "myInfo" && (
          <MyInfo
            user={user}
            userData={userData}
            setUserData={setUserData}
            role={role}
          />
        )}
        {activeTab === "changePw" && <ChangePw user={user} />}
        {activeTab === "leave" && <BreakApp user={user} />}
        {activeTab === "leaveHistory" && <BreakHistory user={user} />}
        {activeTab === "tuitionHistory" && <TuitionHistory user={user} />}
        {activeTab === "tuitionNotice" && <TuitionNotice user={user} />}
      </main>
    </div>
  );
};

export default MyPage;
