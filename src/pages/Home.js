import React, { useState } from "react";
import Hero from "../components/Home/Hero";
import Notice from "../components/Home/Notice";
import Schedule from "../components/Home/Schedule";
import StudentInfo from "../components/Home/StudentInfo";
import "../components/Home/Home.css";

const Home = ({ user, logout, role }) => {
  return (
    <div className="home">
      <Hero />

      <div className="home__cards">
        {user && <StudentInfo user={user} role={role} logout={logout} />}
        <Notice />
        <Schedule />
      </div>
    </div>
  );
};

export default Home;
