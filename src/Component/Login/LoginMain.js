import React, { useState /* useEffect */ } from "react";
import { Link, useNavigate /* useLocation */ } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginUser } from "../../Reducer/userSlice";

import { FcGoogle } from "react-icons/fc";
import { GrMail } from "react-icons/gr";
import { GiSmartphone } from "react-icons/gi";

import { signInWithPopup } from "firebase/auth";
import { db, auth, googleProvider } from "../../firebase.js";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

function LoginMain() {
  let navi = useNavigate();
  const dispatch = useDispatch();
  auth.languageCode = "ko";
  const [regist, setRegist] = useState(false);

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        // 구글 로그인 성공 후의 처리 로직
        const user = result.user;
        const gmail = user.email;
        checkDocument(user, gmail);
      })
      .catch(error => {
        // 로그인 실패 시의 처리 로직
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const checkDocument = async (u, g) => {
    const docRef = doc(db, "apply", u.uid);
    const docSnap = await getDoc(docRef);
    const exists = docSnap.exists();
    const [mail, domain] = g.split("@");

    if (exists) {
      const hasNameField = docSnap.data().name !== undefined;

      if (hasNameField) {
        dispatch(
          loginUser({
            uid: u.uid,
            accessToken: u.accessToken,
            admin: false,
            name: docSnap.data().name,
            point: docSnap.data().point,
            phone: docSnap.data().phone,
          })
        );
        navi("/");
      } else {
        dispatch(
          loginUser({
            uid: u.uid,
            accessToken: u.accessToken,
            admin: false,
            name: "",
            point: 0,
            phone: "",
          })
        );
        alert("원활한 이용을 위해 프로필을 작성해 주세요");
        navi(`/inputprofile/${u.uid}/promotion`);
      }
    } else {
      await setDoc(docRef, {
        type: "gmail",
        created: serverTimestamp(),
        email: mail,
        domain: domain,
        fullEmail: g,
      });
      dispatch(
        loginUser({
          uid: u.uid,
          accessToken: u.accessToken,
          admin: false,
          name: "",
          point: 0,
          phone: "",
        })
      );
      alert(
        "알바선물에 처음 오셨네요\n원활한 이용을 위해 프로필을 작성해 주세요"
      );
      navi(`/inputprofile/${u.uid}/promotion`);
    }
  };

  return (
    <>
      <div className="text-lg font-medium text-black pb-2 text-center">
        {regist ? "회원가입" : "로그인"} 방식을 선택하세요
      </div>
      <div className="grid grid-cols-1 gap-2">
        <div className="w-11/12 mx-auto">
          {regist ? (
            <Link
              to="/login/emailregist"
              className="border p-2 text-center block w-full hover:bg-blue-100"
            >
              <GrMail className="inline mr-2" />
              이메일로 가입하기
            </Link>
          ) : (
            <Link
              to="/login/email"
              className="border p-2 text-center block w-full hover:bg-blue-100"
            >
              <GrMail className="inline mr-2" />
              이메일로 로그인
            </Link>
          )}
        </div>
        <div className="w-11/12 mx-auto">
          <button
            className="border p-2 text-center block w-full hover:bg-red-100"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="inline mr-2" />
            구글로 {regist ? "가입하기" : "로그인"}
          </button>
        </div>
        <div className="w-11/12 mx-auto">
          <Link
            to="/login/phone"
            className="border p-2 text-center block w-full hover:bg-green-100"
            onClick={e => {
              e.preventDefault();
              alert(
                "현재 구글 전산 오류로 휴대전화 계정 가입이 불가능 합니다\n불편을 끼쳐드려 죄송합니다"
              );
            }}
          >
            <GiSmartphone className="inline mr-2" />
            휴대전화로 {regist ? "가입하기" : "로그인"}
          </Link>
        </div>
        <div className="text-center group">
          <button onClick={e => setRegist(!regist)}>
            {regist ? (
              <>
                이미 가입하셨으면 여기를 눌러{" "}
                <span className="text-blue-600 group-hover:text-red-600 border-b border-blue-600 group-hover:border-red-600">
                  로그인
                </span>
                을 진행해 주세요
              </>
            ) : (
              <>
                처음이신가요? 여기를 눌러{" "}
                <span className="text-blue-600 group-hover:text-red-600 border-b border-blue-600 group-hover:border-red-600">
                  회원가입
                </span>
                을 진행해 주세요
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default LoginMain;
