import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notiApi } from '../../api/aiApi'; // 이건 기존 API (조회/삭제용)
import { EventSourcePolyfill } from 'event-source-polyfill'; // ★ 추가
import './NotificationBell.css';

const NotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 1. 초기 데이터 로드 (새로고침 시 기존 알림 가져오기)
  useEffect(() => {
    if (user) {
      loadInitialNotifications();
    }
  }, [user]);

  const loadInitialNotifications = async () => {
    try {
      const res = await notiApi.getMyNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("초기 알림 로드 실패");
    }
  };

  // 2. [핵심] 실시간 알림 구독 (SSE 연결)
  useEffect(() => {
    if (!user) return;

    // SSE 연결 객체 생성 (토큰 헤더 포함)
    const token = localStorage.getItem('token'); // 또는 쿠키 등 토큰 저장 위치
    const eventSource = new EventSourcePolyfill(
      'http://localhost:8888/api/notification/subscribe', // 백엔드 주소 확인
    //   `${baseUrl}/api/notification/subscribe`, // ★ AWS 배포할때
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        heartbeatTimeout: 86400000, // 연결 유지 시간 설정
      }
    );

    // 연결 성공 시
    eventSource.onopen = () => {
      console.log('🔔 실시간 알림 서버 연결 성공');
    };

    // [이벤트 수신] 백엔드에서 emitter.send().name("notification") 한 것
    eventSource.addEventListener('notification', (e) => {
      const newNoti = JSON.parse(e.data); // 전송된 알림 데이터
      console.log('새 알림 도착!', newNoti);

      // 기존 목록 맨 앞에 새 알림 추가
      setNotifications((prev) => [newNoti, ...prev]);
      
      // (선택) 알림음 재생 or 브라우저 알림 띄우기 가능
      alert("새로운 알림이 도착했습니다: " + newNoti.content);
    });

    // 에러 발생 시
    eventSource.onerror = (err) => {
      console.error('SSE 연결 에러', err);
      eventSource.close(); // 에러나면 닫고 재연결 시도 로직 필요 시 추가
    };

    // 컴포넌트가 사라질 때(언마운트) 연결 끊기
    return () => {
      eventSource.close();
      console.log('🔔 알림 연결 종료');
    };
  }, [user]);

  // ... (handleClick, handleDelete, render 부분은 기존과 동일) ...
  
  // 3. 알림 클릭 처리
  const handleClick = async (noti) => {
    try {
      if (!noti.isRead) {
        await notiApi.markAsRead(noti.id);
        setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n));
      }
      if (noti.url) {
        navigate(noti.url);
        setIsOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 알림 삭제 핸들러
  const handleDelete = async (e, notiId) => {
    e.stopPropagation();
    try {
      await notiApi.deleteNotification(notiId);
      setNotifications(prev => prev.filter(n => n.id !== notiId));
    } catch (err) {
      alert("삭제 실패");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="noti-container">
       {/* ... (UI 렌더링 코드는 기존 그대로 유지) ... */}
       <div className="noti-icon-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <span className="material-symbols-outlined noti-icon">notifications</span>
        {unreadCount > 0 && <span className="noti-badge">{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className="noti-dropdown">
          <div className="noti-header">알림함</div>
          <ul className="noti-list">
            {notifications.length === 0 ? (
              <li className="noti-empty">새로운 알림이 없습니다.</li>
            ) : (
              notifications.map(noti => (
                <li 
                  key={noti.id} 
                  className={`noti-item ${noti.isRead ? 'read' : 'unread'}`}
                  onClick={() => handleClick(noti)}
                >
                  <p className="noti-content">{noti.content}</p>
                  <button onClick={(e) => handleDelete(e, noti.id)} className="delete-btn">
                    x
                  </button>
                  <span className="noti-date">
                    {new Date(noti.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;