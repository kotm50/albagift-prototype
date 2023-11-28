import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 및 Firestore 인스턴스 가져오기

import dayjs from "dayjs";
function GetPoint() {
  const thisLocation = useLocation();
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [hour, setHour] = useState("시");
  const [minute, setMinute] = useState("분");
  useEffect(() => {
    if (user.uid !== "") {
      setLoaded(true);
    } else {
      let goLogin = window.confirm(
        "로그인이 필요합니다, 로그인을 진행해 주세요"
      );
      if (goLogin) {
        navi("/login");
      }
    }
    //eslint-disable-next-line
  }, [thisLocation]);

  const handleDateChange = event => {
    setDate(event.target.value);
  };

  const handleInputChange = setFunc => event => {
    // 입력값이 숫자만으로 이루어져 있는지 검사합니다.
    if (/^\d*$/.test(event.target.value)) {
      setFunc(event.target.value);
    }
  };

  const formatPhoneNumber = phoneNumber => {
    if (phoneNumber && phoneNumber.length === 11) {
      const formattedNumber = phoneNumber.replace(
        /(\d{3})(\d{4})(\d{4})/,
        "$1-$2-$3"
      );
      return formattedNumber;
    }
    return phoneNumber;
  };

  const pointPls = async () => {
    const body = {
      id: user.uid,
      name: user.name,
      phone: user.phone,
      date: date,
      time: `${hour}:${minute}`,
      timestamp: serverTimestamp(),
    };
    const submit = window.confirm("포인트 지급을 신청하시겠습니까?");
    if (submit) {
      const serial = await getSerial();
      const today = dayjs(new Date()).format("YYYYMMDD");
      if (hour === "시") {
        const timeChk = window.confirm(
          "면접시간을 수정하지 않으셨습니다. 정말 9시가 맞으신가요?"
        );
        if (!timeChk) {
          return alert("면접날짜와 시간을 확인하신 후 다시 시도해 주세요");
        }
      }
      const collectionRef = collection(db, "applypoint");
      const docRef = doc(
        collectionRef,
        `point_${today}_${user.phone}_${serial}`
      );

      // Firestore에 데이터 입력
      try {
        await setDoc(docRef, body);

        // 입력 완료 후 상태 초기화
        alert("지급 신청이 완료되었습니다, 최대한 빠르게 처리해드리겠습니다");
        navi("/");
      } catch (error) {
        console.error("문서 입력 중 오류가 발생했습니다:", error);
      }
    } else {
      return alert("입력하신 내용을 확인 후 다시 시도해 주세요");
    }
  };

  const getSerial = async () => {
    const serialRef = doc(db, "applypoint", "serial");

    const serialSnapshot = await getDoc(serialRef);
    if (serialSnapshot.exists()) {
      const currentNumber = serialSnapshot.data().number;
      const newNumber = currentNumber + 1;

      // Update the number in Firestore
      await updateDoc(serialRef, { number: newNumber });

      // Format the number to 8 digits with leading zeros
      const formattedNumber = String(newNumber).padStart(8, "0");
      return formattedNumber;
    } else {
      console.error("Serial number document does not exist.");
    }
  };

  return (
    <div className="container p-2 mx-auto bg-white my-2">
      {loaded ? (
        <>
          <h2 className="text-lg xl:text-2xl font-medium mb-3">
            포인트 지급 신청하기
          </h2>
          <div className="grid grid-cols-6 xl:grid-cols-10 gap-1 bg-gray-50 p-2 mb-3">
            <div className="col-span-2 font-medium text-right bg-indigo-50 p-2">
              이름
            </div>
            <div className="col-span-4 xl:col-span-8 p-2 bg-white">
              {user.name}
            </div>
            <div className="col-span-2 font-medium text-right bg-indigo-50 p-2">
              연락처
            </div>
            <div className="col-span-4 xl:col-span-8 p-2 bg-white">
              {formatPhoneNumber(user.phone)}
            </div>
            <div className="col-span-2 font-medium text-right bg-indigo-50 p-2">
              <label htmlFor="inputDate">면접날짜</label>
            </div>
            <div className="col-span-4 xl:col-span-8 p-2 bg-white">
              <input
                id="inputDate"
                type="date"
                value={date}
                onChange={handleDateChange}
              />
            </div>

            <div className="col-span-2 font-medium text-right bg-indigo-50 p-2">
              <label htmlFor="inputTime">면접시간</label>
            </div>
            <div className="col-span-4 xl:col-span-8 bg-white grid grid-cols-2 gap-2 px-1">
              <input
                type="text"
                className="border border-gray-200 p-2"
                value={hour}
                onFocus={e => {
                  if (hour === "시") {
                    setHour("");
                  }
                }}
                onBlur={e => {
                  if (hour === "") {
                    setHour("시");
                  }
                }}
                onChange={handleInputChange(setHour)}
              />

              <input
                type="text"
                className="border border-gray-200 p-2"
                value={minute}
                onFocus={e => {
                  if (minute === "분") {
                    setMinute("");
                  }
                }}
                onBlur={e => {
                  if (minute === "") {
                    setMinute("분");
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    pointPls();
                  }
                }}
                onChange={handleInputChange(setMinute)}
              />
            </div>

            <div className="col-span-2 font-medium text-right"></div>
            <div className="col-span-4 xl:col-span-8 px-1">
              시간은 24시간 기준으로 작성해 주세요.{" "}
              <strong className="text-rose-500">
                ex) 오전 10시 - 10:00, 오후 3시 - 15:00
              </strong>
            </div>
          </div>
          <button
            className="w-full p-2 bg-teal-500 hover:bg-teal-700 text-white"
            onClick={e => pointPls()}
          >
            포인트 지급 신청
          </button>
        </>
      ) : (
        <div className="text-center">"잠시만 기다려 주세요"</div>
      )}
    </div>
  );
}

export default GetPoint;
