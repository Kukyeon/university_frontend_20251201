import React, { useState, useEffect } from 'react';
import './Chatbot.css'; // 스타일은 나중에
import { chatApi } from "../../api/aiApiapi"; // [핵심] api.js에서 가져옴

const Chatbot = ({ studentId }) => {
  const [isOpen, setIsOpen] = useState(false); // 채팅창 열림/닫힘 상태
  const [messages, setMessages] = useState([]); // 대화 내용 리스트
  const [input, setInput] = useState(''); // 입력창 내용

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

  return (
    <div className="chatbot-wrapper">
      {/* 둥둥 버튼 */}
      {!isOpen && (
        <button className="chat-btn" onClick={() => setIsOpen(true)}>
          🤖 상담
        </button>
      )}

      {/* 채팅창 */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>학사 도우미 AI</span>
            <button onClick={() => setIsOpen(false)}>X</button>
          </div>
          
          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="궁금한 걸 물어보세요..."
            />
            <button onClick={handleSend}>전송</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;