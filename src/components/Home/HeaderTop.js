import React from "react";

const HeaderTop = ({ user }) => {
  return (
    <div className="header-top">
      <ul>
        <li className="material-li">
          <span className="material-symbols-outlined">account_circle</span>
        </li>
        <li>
          {user.name} ({user.id})
        </li>
        <li className="divider">|</li>
        <li className="material-li">
          <span className="material-symbols-outlined logout-icon">logout</span>
        </li>
        <li>
          <a href="/logout" className="logout-link">
            로그아웃
          </a>
        </li>
      </ul>
    </div>
  );
};

export default HeaderTop;
