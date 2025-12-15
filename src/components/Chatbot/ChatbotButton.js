// import { useState } from "react";
// import "./ChatbotButton.css"; // 스타일을 따로 관리

// const ChatbotButton = () => {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* 플로팅 버튼 */}
//       <button className="chatbot-float-btn" onClick={() => setOpen(!open)}>
//         💬
//       </button>

//       {/* 챗봇 창 */}
//       {open && (
//         <div className="chatbot-window">
//           <div className="chatbot-header">
//             챗봇
//             <button onClick={() => setOpen(false)}>X</button>
//           </div>
//           <div className="chatbot-body">여기에 챗봇 UI 넣기</div>
//           <div className="chatbot-input">
//             <input type="text" placeholder="메시지를 입력하세요" />
//             <button>전송</button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatbotButton;
