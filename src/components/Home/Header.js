import React from "react";
import { Link } from "react-router-dom";
import HeaderTop from "./HeaderTop";
import "./Header.css";

const Header = ({ user }) => {
  return (
    <header>
      {/* 상단 헤더 */}
      {user && <HeaderTop user={user} />}

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

            <li className="dropdown">
              <Link to="/departments">학과소개</Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/departments/cs">컴퓨터공학과</Link>
                </li>
                <li>
                  <Link to="/departments/ee">전기공학과</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/admission">입학안내</Link>
            </li>
            <li>
              <Link to="/academic">공지사항</Link>
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
