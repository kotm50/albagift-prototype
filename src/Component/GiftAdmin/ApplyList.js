import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

function ApplyList() {
  const { phone } = useParams();
  const [applies, setApplies] = useState([]);
  const [phoneNum, setPhoneNum] = useState("");
  const [loading, setLoading] = useState("불러오는 중입니다...");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const [point, setPoint] = useState("");
  useEffect(() => {
    if (phone === undefined) {
      getApply();
    } else {
      setPhoneNum(phone);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (phoneNum !== "") {
      searchIt(phoneNum);
    } else {
      getApply();
    }
    //eslint-disable-next-line
  }, [phoneNum]);
  const getApply = async () => {
    setApplies([]);
    const applyCollectionRef = collection(db, "apply"); // 'apply' 컬렉션의 참조 가져오기

    try {
      const snapshot = await getDocs(applyCollectionRef); // 컬렉션의 모든 문서 스냅샷 가져오기
      const documents = []; // 문서를 저장할 배열

      snapshot.forEach(doc => {
        doc.data().docId = doc.id;
        let docData = doc.data();
        docData.docId = doc.id;
        documents.push(docData); // 문서 데이터를 배열에 추가
      });
      console.log(documents.length);
      setApplies(documents);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
    }
  };

  const searchIt = async p => {
    if (p.length === 11) {
      const q = query(collection(db, "apply"), where("phone", "==", p));
      try {
        const querySnapshot = await getDocs(q);
        let app = [];
        querySnapshot.forEach(doc => {
          // 찾은 문서에 대한 작업을 수행합니다.
          doc.data().docId = doc.id;
          let docData = doc.data();
          docData.docId = doc.id;
          app.push(docData);
        });
        if (app.length === 0) {
          setLoading("검색결과가 없습니다");
        }
        setApplies(app);
      } catch (error) {
        console.log("검색 중 오류 발생:", error);
        setLoading("검색에 실패했습니다.");
      }
    }
  };

  const checkUsers = (user, checked) => {
    if (checked) {
      // 체크박스가 선택된 경우, 아이템을 배열에 추가
      setSelectedUsers([
        ...selectedUsers,
        { uid: user.uid, phone: user.phone, name: user.name },
      ]);
      setSelectedUsersId([
        ...selectedUsersId,
        { uid: user.uid, name: user.name },
      ]);
    } else {
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedUsers(selectedUsers.filter(item => item.uid !== user.uid));
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedUsersId(selectedUsersId.filter(item => item.uid !== user.uid));
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

  const incPoint = async () => {
    let confirm = window.confirm(
      `${selectedUsers.length}명에게 ${point}포인트를 지급합니다\n진행할까요?`
    );
    if (confirm) {
      const giftPointCollectionRef = collection(db, "giftPoint");
      for (let userObj of selectedUsersId) {
        const serial = await getSerial();
        const uid = userObj.uid; // uid를 객체에서 직접 추출합니다.
        const name = userObj.name; // uid를 객체에서 직접 추출합니다.
        const userDocRef = doc(db, "apply", uid); // 'users'는 컬렉션 이름입니다. 실제 컬렉션 이름으로 변경하세요.
        const userDoc = await getDoc(userDocRef);

        const pointRef = doc(giftPointCollectionRef, `point_${serial}_${uid}`);

        if (userDoc.exists()) {
          const currentPoints = userDoc.data().point || 0;
          const newPoints = Number(currentPoints) + Number(point);
          await updateDoc(userDocRef, {
            point: newPoints,
          });
          await setDoc(pointRef, {
            uid: uid,
            name: name,
            date: serverTimestamp(),
            beforePoint: currentPoints,
            afterPoint: newPoints,
            point: Number(point),
            increase: true,
            type: "user",
            interviewData: "면접자 아님",
          });
        }
      }

      alert("포인트가 차감되었습니다");
      setSelectedUsers([]);
      setSelectedUsersId([]);
      getApply();
      setPoint("");
    } else {
      return alert("지급할 인원과 포인트를 확인 후 다시 시도해 주세요");
    }
  };

  const decPoint = async () => {
    let confirm = window.confirm(
      `${selectedUsers.length}명에게 ${point}포인트를 차감합니다\n진행할까요?`
    );
    if (confirm) {
      const giftPointCollectionRef = collection(db, "giftPoint");
      for (let userObj of selectedUsersId) {
        const serial = await getSerial();
        const uid = userObj.uid; // uid를 객체에서 직접 추출합니다.
        const name = userObj.name; // uid를 객체에서 직접 추출합니다.
        const userDocRef = doc(db, "apply", uid); // 'users'는 컬렉션 이름입니다. 실제 컬렉션 이름으로 변경하세요.
        const userDoc = await getDoc(userDocRef);

        const pointRef = doc(giftPointCollectionRef, `point_${serial}_${uid}`);

        if (userDoc.exists()) {
          const currentPoints = userDoc.data().point || 0;
          const newPoints = Number(currentPoints) - Number(point);
          await updateDoc(userDocRef, {
            point: newPoints,
          });
          await setDoc(pointRef, {
            uid: uid,
            name: name,
            date: serverTimestamp(),
            beforePoint: currentPoints,
            afterPoint: newPoints,
            point: Number(point),
            increase: false,
            type: "user",
            interviewData: "면접자 아님",
          });
        }
      }

      alert("포인트가 차감되었습니다");
      setSelectedUsers([]);
      setSelectedUsersId([]);
      getApply();
      setPoint("");
    } else {
      return alert("지급할 인원과 포인트를 확인 후 다시 시도해 주세요");
    }
  };

  const getSerial = async () => {
    const serialRef = doc(db, "giftPoint", "serial");

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

  const handlePaste = event => {
    event.preventDefault();
    const text = event.clipboardData.getData("text");
    const pastedText = text.replace(/-/g, "");
    setPhoneNum(pastedText);
  };

  return (
    <>
      <div className="w-full p-2 bg-indigo-50 flex flex-row flex-nowrap justify-center mb-2">
        <div className="text-lg font-indigo-500 p-2">연락처로 검색</div>
        <input
          type="number"
          className="text-lg p-2 border rounded-lg shadow"
          value={phoneNum}
          onChange={e => setPhoneNum(e.currentTarget.value)}
          onBlur={e => setPhoneNum(e.currentTarget.value)}
          onKeyUp={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              searchIt(e.currentTarget.value);
            }
          }}
          onPaste={handlePaste}
          placeholder="'-'없이 숫자만 입력하세요"
        />
      </div>
      {applies.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 mt-2 bg-white p-2">
          {applies.map((apply, idx) => (
            <div key={idx}>
              <input
                type="checkbox"
                value={apply.uid}
                className="hidden peer"
                id={apply.uid}
                onChange={e => checkUsers(apply, e.target.checked)}
              />
              <label
                htmlFor={apply.uid}
                className="block p-2 bg-indigo-50 hover:bg-indigo-200 text-black rounded-lg border-2 border-indigo-50 hover:border-indigo-200 peer-checked:border-indigo-500 peer-checked:hover:border-indigo-500"
              >
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    이름
                  </div>
                  <div className="font-normal col-span-2 flex flex-col justify-center">
                    {apply.name}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    연락처
                  </div>
                  <div className="font-normal col-span-2 flex flex-col justify-center">
                    {formatPhoneNumber(apply.phone)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    포인트
                  </div>
                  <div
                    className="font-normal col-span-2 flex flex-col justify-center"
                    title={apply.point}
                  >
                    {apply.point} point
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <>{loading}</>
      )}
      {selectedUsers.length > 0 && (
        <>
          <div className="absolute w-full bottom-0 left-1/2 -translate-x-1/2 bg-white p-3 rounded-t-xl drop-shadow-xl z-40">
            <div className="test-xl xl:text-2xl font-medium text-left">
              포인트 지급(차감)대상
            </div>
            <div className="mt-2 flex flex-row flex-wrap gap-2">
              {selectedUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-yellow-50 rounded-xl flex flex-col gap-2 justify-center"
                >
                  <p>이름 : {user.name}</p>
                  <p>연락처 : {user.phone}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 bg-rose-50 p-2 grid grid-cols-1 xl:grid-cols-2 gap-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(Number(point) + 1000)}
                >
                  +1000
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(Number(point) + 5000)}
                >
                  + 5000
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(Number(point) + 10000)}
                >
                  + 10000
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-rose-700 hover:bg-rose-900 text-white"
                  onClick={e => setPoint(Number(point) - 1000)}
                >
                  - 1000
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-rose-700 hover:bg-rose-900 text-white"
                  onClick={e => setPoint(Number(point) - 5000)}
                >
                  - 5000
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-rose-700 hover:bg-rose-900 text-white"
                  onClick={e => setPoint(0)}
                >
                  0 으로
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="number"
                  className="p-2 bg-white border font-medium"
                  value={point}
                  onChange={e => setPoint(e.currentTarget.value)}
                  onBlur={e => setPoint(e.currentTarget.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="transition duration-150 ease-out p-2 bg-sky-500 hover:bg-sky-700 text-white rounded-lg font-medium hover:animate-wiggle"
                    onClick={incPoint}
                  >
                    포인트 지급
                  </button>
                  <button
                    className="transition duration-150 ease-out p-2 bg-white  border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 hover:border-red-700 hover:text-red-700  hover:animate-wiggle"
                    onClick={decPoint}
                  >
                    포인트 차감
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ApplyList;
