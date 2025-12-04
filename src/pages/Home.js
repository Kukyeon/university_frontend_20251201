import React, { useContext, useState } from "react";
import Hero from "../components/Home/Hero";
import Notice from "../components/Home/Notice";
import Schedule from "../components/Home/Schedule";
import StudentInfo from "../components/Home/StudentInfo";
import "../components/Home/Home.css";
import { UserContext } from "../components/Context/UserContext";

const Home = () => {
  const { user } = useContext(UserContext);
  return (
    <div className="home">
      <Hero />

      <div className="home-cards">
        {user && <StudentInfo student={user} />}
        <Notice />
        <Schedule />
      </div>
    </div>
  );
};

export default Home;
