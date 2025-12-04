import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-left">
        <h3>학교 이름</h3>
        <p>© 2025 All rights reserved.</p>
      </div>
      <div className="footer-center">
        <Link to="/departments">학과소개</Link>
        <Link to="/admission">입학안내</Link>
        <Link to="/notice">공지사항</Link>
      </div>
      <div className="footer-right">
        <p>전화: 02-1234-5678</p>
        <p>이메일: info@school.ac.kr</p>
      </div>
    </footer>
  );
};

export default Footer;
