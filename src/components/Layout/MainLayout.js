import { Outlet } from "react-router-dom";
import Header from "../Home/Header";
import Footer from "../Home/Footer";
import Chatbot from "../Chatbot/Chatbot";

const MainLayout = ({ user, role, logout }) => {
  return (
    <>
      <Header user={user} role={role} logout={logout} />
      <main className="page">
        <Outlet />
      </main>
      <Footer />
      {role === "student" && <Chatbot user={user} />}
    </>
  );
};

export default MainLayout;
