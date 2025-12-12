import React, { useEffect } from "react";
import "./FeedBackModal.css";

const FeedbackModal = ({
  type = "info", // success, error, warning, info
  message = "",
  onClose,
  autoClose = 0, // 0 = 자동 닫힘 없음, ms 단위
  buttonText = "확인",
}) => {
  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "check_circle";
      case "error":
        return "error";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  return (
    <>
      <div className="feedback-overlay" onClick={onClose}></div>

      <div className="feedback-modal">
        <span className="material-symbols-outlined feedback-icon">
          {getIcon()}
        </span>

        <p className="feedback-message">{message}</p>

        <button className="feedback-button" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </>
  );
};

export default FeedbackModal;
