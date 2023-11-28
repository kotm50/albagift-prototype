import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginUser } from "../../Reducer/userSlice";

import { db, auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import InputPhone from "../User/InputPhone";
import { AiFillWarning } from "react-icons/ai";

import sms from "../../Asset/sms.jpg";

function PhoneLogin() {
  let navi = useNavigate();
  const dispatch = useDispatch();
  auth.languageCode = "ko";
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [expend, setExpend] = useState(false);
  const [smsImg, setSmsImg] = useState(false);

  const reCaptchaGenerate = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: response => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // onSignInSubmit();
        },
      },
      auth
    );
  };
  const requestOTP = async () => {
    if (!expend) {
      if (phone.length === 10 || phone.length === 11) {
        let phoneNum = phone.replace("0", "+82");
        setExpend(true);
        reCaptchaGenerate();
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phoneNum, appVerifier)
          .then(confirmationResult => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // ...
          })
          .catch(error => {
            // Error; SMS not sent
            // ...
            console.log(error);
          });
      } else {
        alert("번호가 잘못되었습니다, 확인 후 다시 입력해 주세요");
        setExpend(false);
      }
    } else {
      if (otp.length === 6) {
        let confirmationResult = window.confirmationResult;
        confirmationResult
          .confirm(otp)
          .then(result => {
            // User signed in successfully.
            const user = result.user;
            checkDocument(user);
            // ...
          })
          .catch(error => {
            // User couldn't sign in (bad verification code?)
            // ...
          });
      } else {
        alert("인증번호가 잘못되었습니다");
      }
    }
  };

  const requestOTP2 = async () => {
    let phoneNum = phone.replace("0", "+82");
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNum, appVerifier)
      .then(confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch(error => {
        // Error; SMS not sent
        // ...
        console.log(error);
      });
  };

  const checkDocument = async u => {
    const docRef = doc(db, "apply", u.uid);
    const docSnap = await getDoc(docRef);
    const exists = docSnap.exists();

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
            phone: u.phoneNumber,
          })
        );
        alert("원활한 이용을 위해 프로필을 작성해 주세요");
        navi(`/inputprofile/${u.uid}/promotion`);
      }
    } else {
      await setDoc(docRef, { phone: phone, created: serverTimestamp() });
      dispatch(
        loginUser({
          uid: u.uid,
          accessToken: u.accessToken,
          admin: false,
          name: "",
          point: 0,
          phone: u.phoneNumber,
        })
      );
      alert(
        "알바선물에 처음 오셨네요\n원활한 이용을 위해 프로필을 작성해 주세요"
      );
      navi(`/inputprofile/${u.uid}`);
    }
  };

  return (
    <>
      <div>
        <div className="hidden xl:flex bg-indigo-500 rounded-lg p-2 text-white xl:flex-row justify-end">
          <div className="basis-1/6">
            <AiFillWarning size={72} className="mx-auto" />
          </div>
          <div className="basis-5/6">
            알바선물은 글로벌기업인{" "}
            <strong style={{ color: "#ff0" }}>구글</strong>의 보안인증 기능을
            이용하고 있습니다. <br />
            이로인해 인증문자에{" "}
            <span style={{ color: "#ff0" }}>&#91;국외발신&#93;</span> 표시가
            뜨는 경우가 발생할 수 있으나 <br />
            스팸문자가 아니오니 안심하시고 인증을 진행해 주시면 됩니다.
          </div>
        </div>
        <div className="block xl:hidden bg-indigo-500 rounded-lg p-3 text-white break-words">
          알바선물은 글로벌기업인{" "}
          <strong style={{ color: "#ff0" }}>구글</strong>의 보안인증 기능을
          이용하고 있습니다. 이로인해 인증문자에{" "}
          <span style={{ color: "#ff0" }}>&#91;국외발신&#93;</span> 표시가 뜨는
          경우가 발생할 수 있으나 스팸문자가 아니오니 안심하시고 인증을 진행해
          주시면 됩니다.
        </div>
        <button
          className="my-2 p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          onClick={e => setSmsImg(!smsImg)}
        >
          문자 예시 {smsImg ? "접기" : "보기"}
        </button>
        {smsImg ? (
          <div className="bg-gray-10 p-2 rounded">
            <img src={sms} alt="인증문자" className="w-fit max-w-full my-2" />
            <div className="text-sm">
              ※만약 <strong className="text-red-500">ikoreatm.com</strong> 이
              아닌 다른 주소가 적혀있다면 스팸문자일 가능성이 크니 바로
              삭제해주세요.
            </div>
          </div>
        ) : null}
        <InputPhone phone={phone} setPhone={setPhone} requestOTP={requestOTP} />
        {expend && (
          <div id="InputOTP">
            <div className="p-2">
              <h2>
                <label htmlFor="otp" className="text-lg xl:text-base">
                  인증번호를 입력해 주세요
                </label>
              </h2>
            </div>
            <div className="p-2">
              <input
                type="text"
                id="otp"
                name="otp"
                className="block mb-2 xl:text-sm font-medium text-stone-900 w-full h-12 p-2 border border-gray-200 roudned-lg"
                placeholder="인증번호를 입력해주세요"
                onChange={e => setOtp(e.currentTarget.value)}
                onBlur={e => {
                  setOtp(e.currentTarget.value);
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    requestOTP();
                  }
                }}
              />
            </div>
          </div>
        )}
        <div className="px-2 mb-3 flex flex-row flex-nowrap gap-2">
          <button
            className="bg-indigo-500 px-5 py-2 rounded text-white hover:bg-indigo-700"
            onClick={requestOTP}
          >
            {!expend ? "인증번호 받기" : "로그인"}
          </button>
          {expend && (
            <div id="InputOTP">
              <button
                className="bg-gray-200 px-5 py-2 rounded text-black hover:bg-gray-300"
                onClick={requestOTP2}
              >
                인증번호 재전송
              </button>
            </div>
          )}
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  );
}

export default PhoneLogin;
