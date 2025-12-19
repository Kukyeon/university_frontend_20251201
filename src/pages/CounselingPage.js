import { useState } from "react";
import SectionLayout from "../components/Layout/SectionLayout";
import BookAppointment from "../components/Counseling/BookAppointment";
import StudentScheduleList from "../components/Counseling/StudentScheduleList";
import VideoRoom from "../components/Counseling/VideoRoom";
import ProfessorAvailabilityManager from "../components/Counseling/ProfessorAvailabilityManager";
import ProfessorScheduleList from "../components/Counseling/ProfessorScheduleList";
import CounselingDetailForProfessor from "../components/Counseling/CounselingDetailForProfessor";

const Counseling = ({ role, user }) => {
  const menuItems =
    role === "professor"
      ? ["상담 예약 관리", "학생 상담 목록", "상담 기록 조회", "화상 상담"]
      : ["상담 예약", "상담 일정", "화상 상담"];
  const [activeTab, setActiveTab] = useState(menuItems[0]);
  const [selectedSchedule, setSelectedSchedule] = useState(null); // 일정 선택
  const [inRoom, setInRoom] = useState(false); // 화상 상담 여부
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // 화상 상담이나 상세보기 선택 초기화
    setSelectedSchedule(null);
    setInRoom(false);
  };

  const sidebar = (
    <ul className="section-menu">
      {menuItems.map((item) => (
        <li
          key={item}
          className={activeTab === item ? "active" : ""}
          onClick={() => handleTabChange(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
  console.log(user);
  const handleSelectSchedule = (schedule) => {
    const now = new Date();
    const startTime = new Date(schedule.startTime);

    if (now >= startTime) {
      console.log("📌 selectedSchedule 세팅", schedule);
      setSelectedSchedule(schedule);
      setInRoom(true); // 시작된 상담만 입장
      setActiveTab("화상 상담");
    } else {
      alert("아직 상담 시작 시간이 되지 않았습니다.");
    }
  };

  return (
    <SectionLayout title="상담" sidebar={sidebar}>
      {role === "student" && (
        <>
          {activeTab === "상담 예약" && (
            <BookAppointment
              user={user}
              onBooked={() => setActiveTab("상담 일정")}
            />
          )}
          {activeTab === "상담 일정" && !inRoom && (
            <StudentScheduleList
              studentId={user.id}
              onSelect={handleSelectSchedule}
            />
          )}

          {/* {selectedSchedule && !inRoom && (
            <StudentCounselingDetail
              schedule={selectedSchedule}
              onStartCounseling={() => setInRoom(true)}
              onBack={() => setSelectedSchedule(null)}
            />
          )} */}
          {activeTab === "화상 상담" && (
            <>
              {inRoom && selectedSchedule ? (
                <VideoRoom
                  scheduleId={selectedSchedule.id}
                  studentId={user.id}
                  professorId={selectedSchedule.professorId}
                  userRole="student"
                  userName={user.name}
                  onFinish={() => {
                    setInRoom(false);
                    setSelectedSchedule(null);
                    setActiveTab("상담 일정");
                  }}
                />
              ) : (
                <>
                  <h3>화상 상담</h3>
                  <p>상단 탭 또는 상담 일정 목록에서 상담을 선택해주세요.</p>
                </>
              )}
            </>
          )}
        </>
      )}
      {role === "professor" && (
        <>
          {activeTab === "상담 예약 관리" && (
            <>
              <ProfessorAvailabilityManager professorId={user.id} />
              {/* <ProfessorScheduleList professorId={user.id} /> */}
            </>
          )}

          {activeTab === "학생 상담 목록" && (
            <ProfessorScheduleList
              professorId={user.id}
              filterStatus={["PENDING", "CONFIRMED"]}
              onSelectSchedule={(schedule) => {
                const now = new Date();
                const startTime = new Date(schedule.startTime);

                if (now >= startTime) {
                  setSelectedSchedule(schedule);
                  setInRoom(true); // 화상 상담 상태로 전환
                  setActiveTab("화상 상담"); // 탭 이동
                } else {
                  alert("아직 상담 시작 시간이 되지 않았습니다.");
                }
              }}
            />
            // <CounselingRecordPage type="PENDING" professorId={user.id} />
          )}

          {activeTab === "상담 기록 조회" && !selectedSchedule && (
            <ProfessorScheduleList
              professorId={user.id}
              filterStatus={["COMPLETED"]}
              onSelectSchedule={(schedule) => {
                setSelectedSchedule(schedule);
                // 쿼리 없이 바로 상세보기로 전환
              }}
            />
          )}
          {activeTab === "상담 기록 조회" && selectedSchedule && (
            <CounselingDetailForProfessor schedule={selectedSchedule} />
          )}
          {activeTab === "화상 상담" && (
            <>
              {inRoom && selectedSchedule ? (
                <VideoRoom
                  scheduleId={selectedSchedule.id}
                  studentId={selectedSchedule.studentId}
                  professorId={user.id}
                  userRole="professor"
                  userName={user.name}
                  onFinish={() => {
                    setInRoom(false);
                    setSelectedSchedule(null);
                    setActiveTab("상담 기록 조회");
                  }}
                />
              ) : (
                <>
                  <h3>화상 상담</h3>
                  <p>학생 상담 목록에서 상담을 선택해주세요.</p>
                </>
              )}
            </>
          )}
        </>
      )}
    </SectionLayout>
  );
};
export default Counseling;
