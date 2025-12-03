import React, { useState } from "react";
import Hero from "../components/Home/Hero";
import Notice from "../components/Home/Notice";
import Schedule from "../components/Home/Schedule";
import StudentInfo from "../components/Home/StudentInfo";
import "../components/Home/Home.css";

const Home = () => {
  const [isLoggedIn] = useState(true);
  const student = {
    name: "박시우",
    id: "2023000001",
    department: "컴퓨터공학과",
    grade: 2,
    email: "siwoo@test.edu",
    semester: 2,
    status: "재학",
  };

  return (
    <div className="home">
      <Hero />

      <div className="home-cards">
        {isLoggedIn && <StudentInfo student={student} />}
        <Notice />
        <Schedule />
      </div>
    </div>
  );
};

export default Home;
