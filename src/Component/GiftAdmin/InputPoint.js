import React, { useState } from "react";

import {
  doc,
  getDoc,
  collection,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

function InputPoint() {
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [point, setPoint] = useState("");
  const [beforePoint, setBeforePoint] = useState("");
  const [afterPoint, setAfterPoint] = useState("");
  const [inc, setInc] = useState("");
  const [type, setType] = useState("");
  const [realPrice, setRealPrice] = useState("");

  const inputIt = async event => {
    const serial = await getSerial();
    const giftPointCollectionRef = collection(db, "giftPoint");
    const pointRef = doc(giftPointCollectionRef, `point_${serial}_${uid}`);
    let increase;
    if (inc === "i") {
      increase = true;
    } else if (inc === "d") {
      increase = false;
    }
    await setDoc(pointRef, {
      uid: uid,
      name: name,
      date: serverTimestamp(),
      point: Number(point),
      beforePoint: beforePoint,
      afterPoint: afterPoint,
      increase: increase,
      realPrice: realPrice,
      type: type, // board, bought user 셋 중 하나
      interviewData: "불명  ",
    });
    setUid("");
    setName("");
  };
  const getSerial = async () => {
    const serialRef = doc(db, "giftPoint", "serial");

    const serialSnapshot = await getDoc(serialRef);
    if (serialSnapshot.exists()) {
      const currentNumber = serialSnapshot.data().number;
      let newNumber = currentNumber + 1;
      if (newNumber > 99999999) {
        newNumber = 0;
      }

      // Update the number in Firestore
      await updateDoc(serialRef, { number: newNumber });

      // Format the number to 8 digits with leading zeros
      const formattedNumber = String(newNumber).padStart(8, "0");
      return formattedNumber;
    } else {
      console.error("Serial number document does not exist.");
    }
  };
  const handleInputChange = setFunc => event => {
    setFunc(event.target.value);
  };
  return (
    <div className="container mx-auto bg-white p-2 grid grid-cols-1 gap-2">
      <div className="font-medium">uid</div>
      <div className="text-base">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={uid}
          onChange={handleInputChange(setUid)}
        />
      </div>
      <div className="font-medium">이름</div>
      <div className="text-base">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={name}
          onChange={handleInputChange(setName)}
        />
      </div>
      <div className="font-medium">증감 한 포인트</div>
      <div className="text-base">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={point}
          onChange={handleInputChange(setPoint)}
        />
      </div>
      <div className="font-medium">증감 전 포인트</div>
      <div className="text-base">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={beforePoint}
          onChange={handleInputChange(setBeforePoint)}
        />
      </div>
      <div className="font-medium">증감 후 포인트</div>
      <div className="text-base">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={afterPoint}
          onChange={handleInputChange(setAfterPoint)}
        />
      </div>
      <div className="font-medium">증감(증액은 i, 차감은 d)</div>
      <div className="text-base">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={inc}
          onChange={handleInputChange(setInc)}
        />
      </div>
      <div className="font-medium">타입 (board, user, bought 중 하나)</div>
      <div className="text-base">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={type}
          onChange={handleInputChange(setType)}
        />
      </div>
      <div className="font-medium">쿠폰가(실제가격)</div>
      <div className="text-base">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-lg"
          value={realPrice}
          onChange={handleInputChange(setRealPrice)}
        />
      </div>
      <button className="p-2 bg-indigo-500 text-white" onClick={inputIt}>
        입력하기
      </button>
    </div>
  );
}

export default InputPoint;
