import React, { useState } from "react";
import "./Login.css";
import Modal from "../components/Modal"; // 모달 컴포넌트

const LoginPage = () => {
  const [findIdOpen, setFindIdOpen] = useState(false);
  const [findPwOpen, setFindPwOpen] = useState(false);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>로그인</h2>

        <form className="login-form">
          <div className="input-group">
            <label>아이디</label>
            <input type="text" placeholder="아이디를 입력하세요" />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input type="password" placeholder="비밀번호를 입력하세요" />
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="saveId" />
            <label htmlFor="saveId">아이디 저장</label>
          </div>

          <button type="submit" className="login-btn">
            로그인
          </button>

          <div className="login-links">
            <button type="button" onClick={() => setFindIdOpen(true)}>
              아이디 찾기
            </button>
            <span>|</span>
            <button type="button" onClick={() => setFindPwOpen(true)}>
              비밀번호 찾기
            </button>
          </div>
        </form>
      </div>

      {/* 아이디 찾기 모달 */}
      {findIdOpen && (
        <Modal onClose={() => setFindIdOpen(false)}>
          <h3>아이디 찾기</h3>
          <input className="modal-input" placeholder="이름" />
          <input className="modal-input" placeholder="이메일" />
          <div className="role-checkboxes">
            <label>
              <input type="radio" name="role" value="student" /> 학생
            </label>
            <label>
              <input type="radio" name="role" value="professor" /> 교수
            </label>
            <label>
              <input type="radio" name="role" value="staff" /> 직원
            </label>
          </div>
          <button className="modal-btn">조회</button>
        </Modal>
      )}

      {/* 비밀번호 찾기 모달 */}
      {findPwOpen && (
        <Modal onClose={() => setFindPwOpen(false)}>
          <h3>비밀번호 찾기</h3>
          <input className="modal-input" placeholder="이름" />
          <input className="modal-input" placeholder="아이디" />
          <input className="modal-input" placeholder="이메일" />
          <div className="role-checkboxes">
            <label>
              <input type="radio" name="role" value="student" /> 학생
            </label>
            <label>
              <input type="radio" name="role" value="professor" /> 교수
            </label>
            <label>
              <input type="radio" name="role" value="staff" /> 직원
            </label>
          </div>
          <button className="modal-btn">임시 비밀번호 발급</button>
        </Modal>
      )}
    </div>
  );
};

export default LoginPage;
