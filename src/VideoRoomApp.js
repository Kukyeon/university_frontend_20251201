// src/components/VideoRoomApp.js (예시 파일 경로)

import React from "react";

/**
 * WebRTC 데모 페이지를 iFrame으로 로드하는 컴포넌트입니다.
 */
function VideoRoomApp() {
  // public 폴더에 있는 videoroomtest.html을 로드합니다.
  // React에서는 public 폴더의 파일은 상대 경로('/')로 접근 가능합니다.
  const iframeSrc = process.env.PUBLIC_URL + "/videoroomtest.html";

  return (
    <div style={{ height: "100vh", width: "100%", padding: "20px" }}>
      <h2>🎥 화상 회의 데모</h2>
      <p>아래 iFrame을 통해 Janus WebRTC 데모가 로드됩니다.</p>

      <iframe
        src={iframeSrc}
        title="Video Room Demo"
        // iFrame 크기를 설정하여 데모 화면이 제대로 보이도록 합니다.
        style={{
          width: "100%",
          height: "800px", // 적절한 높이 설정
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
        allow="camera; microphone" // 카메라와 마이크 접근 권한 요청
      ></iframe>
    </div>
  );
}

export default VideoRoomApp;
