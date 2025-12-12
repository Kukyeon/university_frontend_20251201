import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeaderTop from "./HeaderTop";
import "./Header.css";

const Header = ({ user, logout, role }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const menuItems = [
    { label: "홈", path: "/" },
    ...(user ? [{ label: "MY", path: "/my" }] : []),
    ...(role === "staff"
      ? [
          { label: "학사관리", path: "/academic" },
          { label: "등록", path: "/registration" },
        ]
      : [{ label: "수업", path: "/course" }]),
    ...(role === "student"
      ? [
          { label: "수강", path: "/sugang" },
          { label: "성적", path: "/grade" },
        ]
      : []),
    { label: "학사정보", path: "/academicPage" },
    { label: "회의", path: "/videoroom" },
  ];

  return (
    <header>
      {/* 상단 HeaderTop */}
      {user && <HeaderTop user={user} logout={logout} />}

      <div className="main-header">
        <div className="logo">
          <Link to="/">학교 로고</Link>
        </div>

        {/* 데스크탑 메뉴 */}
        <nav className="nav-menu">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <span className="material-symbols-outlined">menu</span>
        </div>

        {/* 모바일 슬라이드 메뉴 */}
        <div className={`mobile-slide-menu ${mobileMenuOpen ? "open" : ""}`}>
          <button className="close-btn" onClick={closeMobileMenu}>
            <span className="material-symbols-outlined">close</span>
          </button>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} onClick={closeMobileMenu}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
