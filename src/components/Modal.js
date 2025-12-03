import React from "react";
import "./Modal.css";

const Modal = ({ children, onClose }) => {
  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </>
  );
};

export default Modal;
