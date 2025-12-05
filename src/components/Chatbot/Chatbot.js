import React, { useState, useEffect } from 'react';
//import './Chatbot.css'; // 스타일은 나중에
import { chatApi } from "../../api/aiApi"; // [핵심] api.js에서 가져옴
import { useNavigate } from 'react-router-dom';

const Chatbot = ({ studentId }) => {
  const [isOpen, setIsOpen] = useState(false); // 채팅창 열림/닫힘 상태
  const [messages, setMessages] = useState([]); // 대화 내용 리스트
  const [input, setInput] = useState(''); // 입력창 내용
  const navigate = useNavigate();

 const handleClear = async () => {
      try {
        await chatApi.clearHistory(studentId);
        setMessages([]);
        setIsOpen(false);
        alert("대화가 종료되었습니다.")
      } catch(err) {
        alert("삭제 실패")
      }
    }

  // 1. 처음 열릴 때 과거 대화 가져오기 (FUN-006)
  useEffect(() => {
    if (isOpen && studentId) {
      loadHistory();
    }
  }, [isOpen, studentId]);

  const loadHistory = async () => {
    try {
      const res = await chatApi.getHistory(studentId);
      // 백엔드에서 받은 데이터를 화면 형식에 맞게 변환
      const history = res.data.map(log => ([
        { sender: 'user', text: log.question },
        { sender: 'ai', text: log.answer }
      ])).flat();
      setMessages(history);
    } catch (err) {
      console.error("이력 로딩 실패", err);
    }
  };

  // 2. 메시지 전송 (Gemini와 대화)
  const handleSend = async () => {
    if (!input.trim()) return;

    // 내 말풍선 먼저 추가 (즉시 반응)
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      // 백엔드 호출
      const res = await chatApi.ask(studentId, userMsg.text);
      
      // AI 답변 말풍선 추가
      const aiMsg = { sender: 'ai', text: res.data.answer };
      setMessages(prev => [...prev, aiMsg]);
      
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "오류가 발생했습니다." }]);
    }
  };

   const renderMessage = (text, sender) => {
    // 1. 태그 문자열 제거 (화면에는 안 보이게)
    let cleanText = text;
    // 정규식으로 [[ACTION: ... ]] 패턴을 찾아서 지움
    cleanText = cleanText.replace(/\[\[ACTION:[a-zA-Z_]+\]\]/g, "");
    let actionButton = null;
    if (text.includes("[[ACTION:LEAVE_APP]]")) {
      actionButton = <button className="action-btn" onClick={() => navigate("/student/leave")}>📄 휴학 신청 바로가기</button>;
    } else if (text.includes("[[ACTION:RETURN_APP]]")) {
      actionButton = <button className="action-btn" onClick={() => navigate("/student/course-reg")}>📄 복학신청 페이지로 이동</button>;
    } else if (text.includes("[[ACTION:COURSE_REG]]")) {
      actionButton = <button className="action-btn" onClick={() => navigate("/student/course-reg")}>📅 수강신청 페이지로 이동</button>;
    } else if (text.includes("[[ACTION:GRADE_VIEW]]")) {
      actionButton = <button className="action-btn" onClick={() => navigate("/student/course-reg")}>📅 수강신청 페이지로 이동</button>;
  }
  return (
      <div className={`message ${sender}`}>
        {cleanText}
        {sender === 'ai' && actionButton && <div style={{marginTop: '5px'}}>{actionButton}</div>}
      </div>
    );
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <button className="chat-btn" onClick={() => setIsOpen(true)}>챗봇🤖</button>
      )}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>학사 도우미 AI</span>
            <div style={{ display: "flex", gap: "10px" }}>
            <button 
                onClick={handleClear} 
                style={{ background: "none", border: "none", color: "#ffcccc", cursor: "pointer", fontSize: "12px" }}
                title="대화 기록 삭제"
              >
                🗑️ 종료
              </button>
              {/* 닫기 버튼 (기존) */}
              <button onClick={() => setIsOpen(false)}>X</button>
          </div>
           </div>
          <div className="chat-body">
            {messages.map((msg, idx) => (
              // [수정] 그냥 msg.text를 출력하는 게 아니라, renderMessage 함수를 통과시킴
              <div key={idx}>
                {renderMessage(msg.text, msg.sender)}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="질문하세요..."
            />
            <button onClick={handleSend}>전송</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;