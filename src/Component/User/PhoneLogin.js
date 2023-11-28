import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { db, auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";

import InputPhone from "./InputPhone";

function PhoneLogin() {
  let navi = useNavigate();
  auth.languageCode = "ko";
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("'");
  const [expend, setExpend] = useState(false);

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
            console.log(user);
            inputApply(user);
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

  const inputApply = async u => {
    const applyRef = collection(db, "apply");
    let applyData = await getDoc(doc(applyRef, `${u.uid}`));
    console.log(applyData.data());
    if (applyData.data() === undefined) {
      alert("원활한 이용을 위해 프로필을 작성해 주세요");
      navi("/inputprofile");
    }
  };
  return (
    <>
      <div className="bg-white rounded fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg flex flex-col justify-center p-2 w-11/12 xl:w-1/6">
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
              />
            </div>
          </div>
        )}
        <div className="px-2 mb-3">
          <button
            className="bg-indigo-500 px-5 py-2 rounded text-white hover:bg-indigo-700"
            onClick={requestOTP}
          >
            {!expend ? "인증번호 받기" : "로그인"}
          </button>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  );
}

export default PhoneLogin;
