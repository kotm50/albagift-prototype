import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginUser } from "../../Reducer/userSlice";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../firebase.js";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

function EmailRegist() {
  let navi = useNavigate();
  const dispatch = useDispatch();
  auth.languageCode = "ko";
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");
  const [seePwd, setSeePwd] = useState(false);
  const [seePwdChk, setSeePwdChk] = useState(false);

  const signUp = e => {
    e.preventDefault();
    setSeePwd(false);
    setSeePwdChk(false);
    if (email === "" || pwd === "" || pwdChk === "") {
      return alert(
        "입력하지 않은 항목이 있습니다 \n확인 후 다시 진행해 주세요"
      );
    }
    let isEmail = checkEmail(email);
    if (!isEmail) {
      return alert("이메일 양식이 올바르지 않습니다.\n이메일을 확인해 주세요");
    }
    if (pwd !== pwdChk) {
      return alert("비밀번호 확인을 실패했습니다.\n비밀번호를 확인해 주세요");
    }
    createUserWithEmailAndPassword(auth, email, pwd)
      .then(userCredential => {
        // 로그인 성공 후의 처리 로직
        const user = userCredential.user;
        checkDocument(user);
      })
      .catch(error => {
        // 로그인 실패 시의 처리 로직
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode === "auth/email-already-in-use") {
          alert("이미 가입한 계정입니다\n로그인 화면으로 이동합니다");
          navi("/login/email");
        }
      });
  };

  const checkEmail = () => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const checkDocument = async u => {
    const docRef = doc(db, "apply", u.uid);
    const docSnap = await getDoc(docRef);
    const exists = docSnap.exists();
    const [mail, domain] = email.split("@");

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
            phone: "",
          })
        );
        alert("이미 가입하셨습니다. 메인화면으로 이동합니다");
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
        type: "email",
        created: serverTimestamp(),
        email: mail,
        domain: domain,
        fullEmail: email,
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
      alert("환영합니다! 원활한 이용을 위해 프로필을 작성해 주세요");
      navi(`/inputprofile/${u.uid}/promotion`);
    }
  };
  return (
    <form onSubmit={signUp}>
      <div className="p-2">
        <label htmlFor="email" className="text-lg xl:text-base pl-1">
          이메일
        </label>
        <input
          type="text"
          id="email"
          name="email"
          className="block xl:text-sm font-medium text-stone-900 w-full h-12 p-2 border border-gray-200 rounded-lg"
          placeholder="이메일을 입력하세요"
          autoComplete="current-password"
          value={email}
          onChange={e => setEmail(e.currentTarget.value)}
          onBlur={e => setEmail(e.currentTarget.value)}
        />
      </div>
      <div className="p-2">
        <>
          {seePwd ? (
            <label htmlFor="openpwd" className="text-lg xl:text-base pl-1">
              비밀번호
            </label>
          ) : (
            <label htmlFor="pwd" className="text-lg xl:text-base pl-1">
              비밀번호
            </label>
          )}
        </>
        <div className="relative">
          {seePwd ? (
            <input
              type="text"
              id="openpwd"
              name="openpwd"
              className="block xl:text-sm font-medium text-stone-900 w-full h-12 p-2 border border-gray-200 rounded-lg"
              placeholder="비밀번호를 입력하세요"
              value={pwd}
              onChange={e => setPwd(e.currentTarget.value)}
              onBlur={e => setPwd(e.currentTarget.value)}
            />
          ) : (
            <input
              type="password"
              id="pwd"
              name="pwd"
              className="block xl:text-sm font-medium text-stone-900 w-full h-12 p-2 border border-gray-200 rounded-lg"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              value={pwd}
              onChange={e => setPwd(e.currentTarget.value)}
              onBlur={e => setPwd(e.currentTarget.value)}
            />
          )}
          <button
            className="absolute text-black rounded-full right-2 top-1/2 -translate-y-1/2"
            onClick={e => {
              e.preventDefault();
              setSeePwd(!seePwd);
            }}
          >
            {seePwd ? (
              <AiFillEyeInvisible size={28} />
            ) : (
              <AiFillEye size={28} />
            )}
          </button>
        </div>
      </div>
      <div className="p-2">
        <>
          {seePwdChk ? (
            <label htmlFor="openpwdChk" className="text-lg xl:text-base pl-1">
              비밀번호 확인
            </label>
          ) : (
            <label htmlFor="pwdChk" className="text-lg xl:text-base pl-1">
              비밀번호 확인
            </label>
          )}
        </>
        <div className="relative">
          {seePwdChk ? (
            <input
              type="text"
              id="openpwdChk"
              name="openpwdChk"
              className="block xl:text-sm font-medium text-stone-900 w-full h-12 p-2 border border-gray-200 rounded-lg"
              placeholder="비밀번호를 입력하세요"
              value={pwdChk}
              onChange={e => setPwdChk(e.currentTarget.value)}
              onBlur={e => setPwdChk(e.currentTarget.value)}
            />
          ) : (
            <input
              type="password"
              id="pwdChk"
              name="pwdChk"
              className="block xl:text-sm font-medium text-stone-900 w-full h-12 p-2 border border-gray-200 rounded-lg"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              value={pwdChk}
              onChange={e => setPwdChk(e.currentTarget.value)}
              onBlur={e => setPwdChk(e.currentTarget.value)}
            />
          )}
          <button
            className="absolute text-black rounded-full right-2 top-1/2 -translate-y-1/2"
            onClick={e => {
              e.preventDefault();
              setSeePwdChk(!seePwdChk);
            }}
          >
            {seePwdChk ? (
              <AiFillEyeInvisible size={28} />
            ) : (
              <AiFillEye size={28} />
            )}
          </button>
        </div>
        <div className="text-sm pl-1 mt-1">
          {seePwd || seePwdChk ? (
            <span className="text-red-500">
              유출의 우려가 있으니 확인 후{" "}
              <AiFillEyeInvisible
                size={20}
                className="inline-block text-black"
              />{" "}
              아이콘을 눌러 숨겨주세요
            </span>
          ) : (
            <span>
              우측 <AiFillEye size={20} className="inline-block" /> 아이콘을
              누르면 비밀번호를 확인할 수 있습니다
            </span>
          )}
        </div>
      </div>
      <div className="p-2">
        <button
          className="bg-teal-500 hover:bg-teal-700 p-2 text-white w-full rounded-lg"
          type="submit"
        >
          회원가입
        </button>
      </div>
    </form>
  );
}

export default EmailRegist;
