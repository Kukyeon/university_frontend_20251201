// src/VideoRoomApp.js

import React, { useState, useRef, useEffect } from "react";
// 현재 디렉토리의 useJanusVideoRoom.js 파일을 가정합니다.
import { useJanusVideoRoom } from "./useJanusVideoRoom";

// =========================================================================
// UI Components
// =========================================================================

/**
 * 미디어 스트림을 비디오 태그에 연결하고 표시하는 컴포넌트
 */
const VideoParticipant = ({ display, stream, isLocal }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      // WebRTC 스트림을 비디오 엘리먼트에 부착
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={participantStyle.container}>
      <video
        ref={videoRef}
        autoPlay
        muted={isLocal} // 로컬 피드는 음소거
        playsInline
        // 로컬 영상만 좌우 반전하여 거울처럼 보이게 합니다.
        style={{
          ...participantStyle.video,
          transform: isLocal ? "scaleX(-1)" : "none",
        }}
      />
      <p style={participantStyle.label}>
        {display} {isLocal && "(나)"}
      </p>
    </div>
  );
};

/**
 * 접속 전 방 번호 및 사용자 이름 입력 폼
 */
// onJoin 콜백은 이제 (username, roomId) 두 인수를 받습니다.
const JoinForm = ({ onJoin }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 방 번호와 사용자 이름을 모두 검사
    if (username.trim() && roomId.trim()) {
      // onJoin 함수에 사용자 이름과 방 번호를 함께 전달
      onJoin(username.trim(), roomId.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle.container}>
      <h2>화상 회의 참가</h2>

      <input
        type="number"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="참가할 방 번호 입력 (예: 1234)"
        required
        min="1"
        style={formStyle.input}
      />

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="사용자 이름 입력"
        required
        style={formStyle.input}
      />
      <button type="submit" style={formStyle.button}>
        참가
      </button>
    </form>
  );
};

// =========================================================================
// 메인 애플리케이션 컴포넌트
// =========================================================================

/**
 * 메인 애플리케이션 컴포넌트
 */
export default function VideoRoomApp() {
  const {
    localStream,
    remoteFeeds,
    roomJoined,
    myUsername,
    currentRoomId, // useJanusVideoRoom에서 받은 현재 접속된 방 번호
    joinRoom,
    leaveRoom,
    isJanusLoaded,
  } = useJanusVideoRoom();

  if (!isJanusLoaded) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        ❌ **Janus.js 라이브러리가 로드되지 않았습니다.** <br />
        `public/index.html` 파일에 `<script src="adapter.js"></script>`와 `
        <script src="janus.js"></script>`가 올바른 순서로 추가되었는지
        확인하세요.
      </p>
    );
  }

  // 방에 접속하기 전: JoinForm 표시
  if (!roomJoined) {
    return <JoinForm onJoin={joinRoom} />;
  }

  // 방에 접속한 후: 비디오 그리드 표시
  return (
    <div style={appStyle.container}>
      <h1 style={appStyle.title}>
        👋 방 {currentRoomId}: {myUsername}님의 화상 회의
      </h1>

      <div style={appStyle.controls}>
        <button onClick={leaveRoom} style={appStyle.leaveButton}>
          방 나가기
        </button>
      </div>

      <div style={appStyle.videoGrid}>
        {/* 로컬 비디오 */}
        {localStream && (
          <VideoParticipant
            display={myUsername}
            stream={localStream}
            isLocal={true}
          />
        )}

        {/* 원격 참가자 비디오 */}
        {remoteFeeds.map((feed) => (
          <VideoParticipant
            key={feed.id}
            display={feed.display || `참가자 ${feed.id}`}
            stream={feed.stream}
            isLocal={false}
          />
        ))}

        {remoteFeeds.length === 0 && localStream && (
          <p style={appStyle.waitingText}>
            현재 다른 참가자가 없습니다. 잠시만 기다려주세요.
          </p>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// Simple Styles (인라인 스타일)
// =========================================================================

const appStyle = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: { textAlign: "center", color: "#333", marginBottom: "30px" },
  controls: { display: "flex", justifyContent: "center", marginBottom: "30px" },
  leaveButton: {
    padding: "10px 30px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1em",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background-color 0.2s",
  },
  videoGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  waitingText: { margin: "20px", fontSize: "1.2em", color: "#666" },
};

const participantStyle = {
  container: {
    border: "3px solid #007bff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "300px",
    maxWidth: "100%",
    backgroundColor: "#000",
  },
  video: { width: "100%", display: "block", aspectRatio: "4/3" },
  label: {
    color: "white",
    textAlign: "center",
    padding: "10px",
    margin: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

const formStyle = {
  container: {
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    maxWidth: "400px",
    margin: "100px auto",
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  input: {
    padding: "12px",
    margin: "10px 0",
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  button: {
    padding: "12px 25px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    fontSize: "1.1em",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "background-color 0.2s",
  },
};
