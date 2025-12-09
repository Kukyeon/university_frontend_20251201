import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HeaderTop from "./HeaderTop";
import "./Header.css";

const Header = ({ user, logout, role }) => {
  return (
    <header>
      {/* 상단 헤더 */}
      {user && <HeaderTop user={user} logout={logout} />}

      {/* 메인 네비게이션 */}
      <div className="main-header">
        <div className="logo">
          <Link to="/">학교 로고</Link>
        </div>

        <nav className="nav-menu">
          <ul>
            <li>
              <Link to="/">홈</Link>
            </li>
            {user && (
              <li>
                <Link to="/my">MY</Link>
              </li>
            )}
            {role === "staff" && (
              <>
                <li>
                  <Link to="/academic">학사관리</Link>
                </li>
                <li>
                  <Link to="/registration">등록</Link>
                </li>
              </>
            )}
            {role !== "staff" && (
              <>
                <li>
                  <Link to="/course">수업</Link>
                </li>
              </>
            )}
            {/* <li className="dropdown">
              <Link to="/departments">학과소개</Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/departments/cs">컴퓨터공학과</Link>
                </li>
                <li>
                  <Link to="/departments/ee">전기공학과</Link>
                </li>
              </ul>
            </li> */}
            <li>
              <Link to="/academicPage">학사정보</Link>
            </li>
            <li>
              <Link to="/videoroom">회의</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
