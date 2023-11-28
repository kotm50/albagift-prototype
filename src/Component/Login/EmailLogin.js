import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginUser } from "../../Reducer/userSlice";

import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../firebase.js";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

function EmailLogin() {
  let navi = useNavigate();
  const dispatch = useDispatch();
  auth.languageCode = "ko";
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [seePwd, setSeePwd] = useState(false);

  const login = e => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, pwd)
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
      });
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
        navi(`/inputprofile/${u.uid}`);
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
      alert(
        "알바선물에 처음 오셨네요\n원활한 이용을 위해 프로필을 작성해 주세요"
      );
      navi(`/inputprofile/${u.uid}`);
    }
  };
  return (
    <form onSubmit={login}>
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
            type="button"
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
        <div className="text-sm pl-1 mt-1">
          {seePwd ? (
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
          value="submit"
        >
          로그인 하기
        </button>
      </div>
    </form>
  );
}

export default EmailLogin;
