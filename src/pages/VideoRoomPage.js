// src/pages/VideoRoomPage.jsx
import React, { useEffect, useRef, useState } from "react";
import "webrtc-adapter"; // 그냥 import만, 변수는 안받음
import Janus from "janus-gateway";

const VideoRoomPage = () => {
  const localVideoRef = useRef(null);
  const [remoteFeeds, setRemoteFeeds] = useState([]);
  const [janus, setJanus] = useState(null);
  const [pluginHandle, setPluginHandle] = useState(null);
  const [myRoom, setMyRoom] = useState(1234);
  const [myUsername, setMyUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const initJanus = () => {
    Janus.init({
      debug: "all",
      callback: () => {
        const janusInstance = new Janus({
          server: "https://janus.jsflux.co.kr/janus",
          success: () => attachPlugin(janusInstance),
          error: (err) => alert("Janus error: " + err),
          destroyed: () => window.location.reload(),
        });
        setJanus(janusInstance);
      },
    });
  };

  const attachPlugin = (janusInstance) => {
    janusInstance.attach({
      plugin: "janus.plugin.videoroom",
      opaqueId: "videoroomtest-" + Janus.randomString(12),
      success: (handle) => {
        console.log("VideoRoom plugin attached");
        setPluginHandle(handle);
      },
      error: (err) => console.error("Plugin attach failed:", err),
      onmessage: (msg, jsep) => handleMessage(msg, jsep),
      onlocalstream: (stream) => {
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      },
      onremotestream: (stream) => {
        console.log("Remote stream received", stream);
      },
    });
  };

  const handleMessage = (msg, jsep) => {
    const event = msg["videoroom"];
    if (event === "joined") {
      console.log("Joined room:", msg["room"]);
      setIsJoined(true);
      publishOwnFeed(pluginHandle);
      if (msg["publishers"]) {
        msg["publishers"].forEach((pub) =>
          newRemoteFeed(
            pub["id"],
            pub["display"],
            pub["audio_codec"],
            pub["video_codec"]
          )
        );
      }
    } else if (event === "event" && msg["publishers"]) {
      msg["publishers"].forEach((pub) =>
        newRemoteFeed(
          pub["id"],
          pub["display"],
          pub["audio_codec"],
          pub["video_codec"]
        )
      );
    } else if (event === "destroyed") {
      alert("Room has been destroyed.");
      window.location.reload();
    }

    if (jsep && pluginHandle) {
      pluginHandle.handleRemoteJsep({ jsep });
    }
  };

  const joinRoom = () => {
    if (!pluginHandle) return;
    if (!myUsername) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const register = {
      request: "join",
      room: myRoom,
      ptype: "publisher",
      display: myUsername,
    };
    pluginHandle.send({ message: register });
  };

  const publishOwnFeed = (useAudio) => {
    if (!pluginHandle) return;
    pluginHandle.createOffer({
      media: {
        audioRecv: false,
        videoRecv: false,
        audioSend: useAudio,
        videoSend: videoEnabled,
      },
      simulcast: false,
      success: (jsep) => {
        const publish = {
          request: "configure",
          audio: useAudio,
          video: videoEnabled,
        };
        pluginHandle.send({ message: publish, jsep });
      },
      error: (err) => console.error("WebRTC error:", err),
    });
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
    if (pluginHandle && pluginHandle.webrtcStuff.stream) {
      pluginHandle.webrtcStuff.stream
        .getAudioTracks()
        .forEach((t) => (t.enabled = !audioEnabled));
    }
  };

  const toggleVideo = () => {
    setVideoEnabled((prev) => !prev);
    if (pluginHandle && pluginHandle.webrtcStuff.stream) {
      pluginHandle.webrtcStuff.stream
        .getVideoTracks()
        .forEach((t) => (t.enabled = !videoEnabled));
    }
  };

  const newRemoteFeed = (id, display, audio, video) => {
    if (!janus) return;
    janus.attach({
      plugin: "janus.plugin.videoroom",
      opaqueId: "videoroomtest-" + Janus.randomString(12),
      success: (handle) => {
        const remoteFeed = handle;
        remoteFeed.send({
          message: {
            request: "join",
            room: myRoom,
            ptype: "subscriber",
            feed: id,
          },
        });

        remoteFeed.onremotestream = (stream) => {
          setRemoteFeeds((prev) => [...prev, { id, stream }]);
        };

        remoteFeed.onmessage = (msg, jsep) => {
          if (jsep) {
            remoteFeed.createAnswer({
              jsep,
              media: { audioSend: false, videoSend: false },
              success: (jsepAnswer) =>
                remoteFeed.send({
                  message: { request: "start" },
                  jsep: jsepAnswer,
                }),
              error: (err) => console.error("WebRTC error:", err),
            });
          }
        };
      },
      error: (err) => console.error("Attach remote feed failed:", err),
    });
  };

  useEffect(() => {
    initJanus();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h2>Video Room</h2>
      <div>
        <input
          type="text"
          placeholder="닉네임"
          value={myUsername}
          onChange={(e) => setMyUsername(e.target.value)}
        />
        <input
          type="number"
          placeholder="방 번호"
          value={myRoom}
          onChange={(e) => setMyRoom(Number(e.target.value))}
        />
        <button onClick={joinRoom} disabled={isJoined}>
          방 참가
        </button>
        <button onClick={toggleAudio}>
          {audioEnabled ? "음소거" : "오디오 켜기"}
        </button>
        <button onClick={toggleVideo}>
          {videoEnabled ? "비디오 끄기" : "비디오 켜기"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <div>
          <h3>내 비디오</h3>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ width: "300px", border: "1px solid black" }}
          />
        </div>
        <div>
          <h3>원격 비디오</h3>
          {remoteFeeds.map((feed) => (
            <video
              key={feed.id}
              autoPlay
              playsInline
              style={{
                width: "300px",
                border: "1px solid black",
                marginBottom: "10px",
              }}
              ref={(video) => {
                if (video) video.srcObject = feed.stream;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoRoomPage;
