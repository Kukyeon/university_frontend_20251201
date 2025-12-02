// src/hooks/useJanusVideoRoom.js

import { useState, useEffect, useRef, useCallback } from "react";

// =========================================================================
// CONFIGURATION
// =========================================================================
const serverUrl = "https://janus.jsflux.co.kr/janus";

// ✅ WebRTC 연결을 위한 STUN 서버 설정 (필수!)
const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  // 필요하다면 여기에 TURN 서버를 추가할 수 있습니다.
];

// 전역 Janus 객체가 로드되었는지 확인
const isJanusLoaded = () => typeof window.Janus !== "undefined";

// =========================================================================
// Custom Hook
// =========================================================================
export const useJanusVideoRoom = () => {
  const [janus, setJanus] = useState(null);
  const [sfutest, setSfutest] = useState(null);
  const [myId, setMyId] = useState(null);
  const [myUsername, setMyUsername] = useState("");
  // ✅ 추가: 현재 접속한 방 ID 상태
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteFeeds, setRemoteFeeds] = useState([]);
  const [roomJoined, setRoomJoined] = useState(false);

  // sfutest 핸들러 참조 (클로저 문제 해결)
  const sfutestRef = useRef(sfutest);
  sfutestRef.current = sfutest;

  // Janus 초기화 및 연결
  useEffect(() => {
    if (!isJanusLoaded()) {
      console.error(
        "Janus.js 라이브러리가 로드되지 않았습니다. adapter.js와 janus.js가 index.html에 올바른 순서로 로드되었는지 확인하세요."
      );
      return;
    }

    window.Janus.init({
      debug: "all",
      callback: () => {
        const janusInstance = new window.Janus({
          server: serverUrl,
          iceServers: iceServers,
          success: () => setJanus(janusInstance),
          error: (error) => console.error("Janus connection error:", error),
          destroyed: () => console.log("Janus connection destroyed."),
        });
      },
    });

    return () => {
      if (janus) {
        janus.destroy();
      }
    };
  }, []);

  // 참가자 구독 로직 (기존 newRemoteFeed 역할)
  // ✅ 변경: 구독할 방 ID(roomId)를 인수로 받습니다.
  const newRemoteFeed = useCallback(
    (id, display, audio, video, roomId) => {
      if (!janus || !myId) return;

      let remoteFeed = null;

      janus.attach({
        plugin: "janus.plugin.videoroom",
        opaqueId: "videoroomtest-" + window.Janus.randomString(12),
        success: (pluginHandle) => {
          remoteFeed = pluginHandle;
          const sub = {
            request: "join",
            room: roomId, // ✅ 변경
            ptype: "subscriber",
            feed: id,
            private_id: myId,
          };

          remoteFeed.send({ message: sub });
        },
        error: (error) => {
          console.error("Janus attach error (subscriber):", error);
        },
        onmessage: (msg, jsep) => {
          if (jsep) {
            remoteFeed.createAnswer({
              jsep: jsep,
              media: { audioSend: false, videoSend: false },
              success: (jsep) => {
                const body = { request: "start", room: roomId }; // ✅ 변경
                remoteFeed.send({ message: body, jsep: jsep });
              },
              error: (error) => {
                console.error("WebRTC error (Subscriber Answer):", error);
              },
            });
          }
        },
        onremotestream: (stream) => {
          // 새로운 원격 피드 상태 추가
          setRemoteFeeds((prev) => {
            if (prev.find((f) => f.id === id)) return prev;
            return [...prev, { id, display, stream, remoteFeed }];
          });
        },
        oncleanup: () => {
          // 원격 피드 정리 시 상태에서 제거
          setRemoteFeeds((prev) => prev.filter((f) => f.id !== id));
        },
      });
    },
    [janus, myId]
  );

  // 본인 피드 발행 로직 (기존 publishOwnFeed 역할)
  const publishOwnFeed = useCallback((handle, useAudio) => {
    if (!handle) return;

    handle.createOffer({
      media: {
        audio: useAudio,
        video: true,
        data: true,
      },
      success: (jsep) => {
        const publish = { request: "configure", audio: useAudio, video: true };
        handle.send({ message: publish, jsep: jsep });
      },
      error: (error) => {
        console.error("WebRTC createOffer error:", error);
      },
    });
  }, []);

  // 방 접속 로직
  // ✅ 변경: username과 함께 roomId를 인수로 받습니다.
  const joinRoom = useCallback(
    (username, roomId) => {
      if (!isJanusLoaded() || !janus || !roomId) {
        console.error("Janus is not initialized or Room ID is missing.");
        return;
      }

      const parsedRoomId = parseInt(roomId);
      if (isNaN(parsedRoomId) || parsedRoomId <= 0) {
        console.error("Invalid Room ID provided.");
        return;
      }

      janus.attach({
        plugin: "janus.plugin.videoroom",
        opaqueId: "videoroomtest-" + window.Janus.randomString(12),
        success: (pluginHandle) => {
          setSfutest(pluginHandle);
          setMyUsername(username);
          setCurrentRoomId(parsedRoomId); // ✅ 방 ID 상태 저장

          const join = {
            request: "join",
            room: parsedRoomId, // ✅ 변경: 인수로 받은 roomId 사용
            ptype: "publisher",
            display: username,
          };
          pluginHandle.send({ message: join });
        },
        onmessage: (msg, jsep) => {
          const event = msg["videoroom"];

          if (event === "joined") {
            setMyId(msg["id"]);
            setRoomJoined(true);

            if (msg["publishers"]) {
              msg["publishers"].forEach(
                (p) =>
                  newRemoteFeed(
                    p.id,
                    p.display,
                    p.audio_codec,
                    p.video_codec,
                    parsedRoomId
                  ) // ✅ 변경: roomId 전달
              );
            }

            publishOwnFeed(sfutestRef.current, true);
          } else if (event === "event" && msg["publishers"]) {
            msg["publishers"].forEach(
              (p) =>
                newRemoteFeed(
                  p.id,
                  p.display,
                  p.audio_codec,
                  p.video_codec,
                  parsedRoomId
                ) // ✅ 변경: roomId 전달
            );
          } else if (event === "event" && msg["leaving"]) {
            const leavingId = msg["leaving"];
            setRemoteFeeds((prev) => prev.filter((f) => f.id !== leavingId));
          } else if (event === "error") {
            // ✅ 방이 없을 경우 방을 생성하는 로직 (에러 코드 410)
            if (
              msg["error_code"] === 410 ||
              msg["error"].includes("no such room")
            ) {
              console.warn(
                `Room ${parsedRoomId} does not exist. Creating room...`
              );
              const create = {
                request: "create",
                room: parsedRoomId, // ✅ 변경
                permanent: false,
                is_private: false,
                description: `React Test Room ${parsedRoomId}`,
                bitrate: 128000,
                publishers: 6,
              };
              sfutestRef.current.send({ message: create });
            } else {
              console.error("VideoRoom error:", msg["error"]);
            }
          } else if (event === "success" && msg["room"] === parsedRoomId) {
            // 방 생성에 성공했다면, 다시 join 요청
            console.log(
              `Room ${parsedRoomId} created successfully. Attempting to join...`
            );
            const join = {
              request: "join",
              room: parsedRoomId, // ✅ 변경
              ptype: "publisher",
              display: myUsername,
            };
            sfutestRef.current.send({ message: join });
          }

          if (jsep) {
            sfutestRef.current.handleRemoteJsep({ jsep: jsep });
          }
        },
        onlocalstream: (stream) => {
          setLocalStream(stream);
        },
        oncleanup: () => {
          setSfutest(null);
          setMyId(null);
          setLocalStream(null);
          setRemoteFeeds([]);
          setRoomJoined(false);
          setCurrentRoomId(null); // ✅ 방 ID 정리
        },
      });
    },
    [janus, newRemoteFeed, publishOwnFeed, myUsername] // 의존성 배열에 myUsername 추가
  );

  // 방 나가기
  const leaveRoom = useCallback(() => {
    if (sfutest) {
      const unpublish = { request: "unpublish" };
      sfutest.send({ message: unpublish });
      sfutest.detach();
    }
    setRoomJoined(false);
  }, [sfutest]);

  return {
    localStream,
    remoteFeeds,
    roomJoined,
    myUsername,
    currentRoomId, // ✅ 추가
    joinRoom,
    leaveRoom,
    isJanusLoaded: isJanusLoaded(),
  };
};
