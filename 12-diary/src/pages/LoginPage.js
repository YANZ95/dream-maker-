import React, { useContext } from "react";
import "./LoginPage.css";
import * as FcIcons from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { DiaryStateContext } from "../App";
import { Navigate, useNavigate } from "react-router-dom";
import { getUserAuth } from "../api/firebase";

function LoginPage() {
  // const { auth } = useContext(DiaryStateContext);
  // useContext 값을 바꿔 undefined 오류가 뜸 
  const auth = getUserAuth();
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
    navigate("/", { replace: true });
    // : => type script 로 작성이 된거
  };

  return (
    <div className="login_box">
      <button onClick={signInWithGoogle}>
        <FcIcons.FcGoogle />
        <span>Continue with Google</span>
      </button>
    </div>
  );
}

export default LoginPage;
