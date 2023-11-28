import React, { useState, useEffect } from "react";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

function ApplyBoard() {
  const [applies, setApplies] = useState([]);
  const [loading, setLoading] = useState("불러오는 중입니다...");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const [point, setPoint] = useState("");

  const [points, setPoints] = useState({});
  const [lasts, setLasts] = useState({});

  useEffect(() => {
    Promise.all(
      applies.map(async apply => {
        const point = await getPoint(apply.id);
        const last = await getLast(apply.id);
        setPoints(prevPoints => ({ ...prevPoints, [apply.id]: point }));
        setLasts(prevLasts => ({ ...prevLasts, [apply.id]: last }));
      })
    );
  }, [applies]);

  useEffect(() => {
    getApply();
    //eslint-disable-next-line
  }, []);
  const getApply = async () => {
    setApplies([]);
    const applyCollectionRef = collection(db, "applypoint"); // 'apply' 컬렉션의 참조 가져오기
    const q = query(applyCollectionRef, orderBy("timestamp", "desc"));

    try {
      const snapshot = await getDocs(q); // 쿼리에 해당하는 문서 스냅샷 가져오기
      const documents = []; // 문서를 저장할 배열

      snapshot.forEach(doc => {
        let date = doc.data().timestamp.toDate();
        let dateString = date.toLocaleDateString();
        let bid = doc.id;
        let docData = doc.data();
        docData.bid = bid;
        docData.interview = dateString;
        documents.push(docData); // 문서 데이터를 배열에 추가
      });

      setApplies(documents);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
      setLoading("오류가 발생했습니다 다시 시도해 주세요");
    }
  };

  const checkUsers = (user, checked) => {
    if (checked) {
      // 체크박스가 선택된 경우, 아이템을 배열에 추가
      setSelectedUsers([
        ...selectedUsers,
        { uid: user.id, phone: user.phone, name: user.name, bid: user.bid },
      ]);
      setSelectedUsersId([
        ...selectedUsersId,
        { uid: user.id, bid: user.bid, name: user.name },
      ]);
    } else {
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedUsers(selectedUsers.filter(item => item.bid !== user.bid));
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedUsersId(selectedUsersId.filter(item => item.bid !== user.bid));
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
        const bid = userObj.bid;
        const name = userObj.name;
        const userDocRef = doc(db, "apply", uid); // 'users'는 컬렉션 이름입니다. 실제 컬렉션 이름으로 변경하세요.
        const boardDocRef = doc(db, "applypoint", bid);
        const userDoc = await getDoc(userDocRef);
        const boardDoc = await getDoc(boardDocRef);
        const pointRef = doc(giftPointCollectionRef, `point_${serial}_${uid}`);
        if (userDoc.exists()) {
          const interviewDate = boardDoc.data().date || "";
          const interviewTime = boardDoc.data().time || "";
          const currentPoints = userDoc.data().point || 0;
          const newPoints = Number(currentPoints) + Number(point);
          await updateDoc(userDocRef, {
            point: newPoints,
            lastPoint: serverTimestamp(),
          });
          await setDoc(pointRef, {
            uid: uid,
            name: name,
            date: serverTimestamp(),
            point: Number(point),
            beforePoint: currentPoints,
            afterPoint: newPoints,
            increase: true,
            type: "board",
            interviewData: interviewDate + interviewTime,
          });
        }

        if (boardDoc.exists()) {
          await updateDoc(boardDocRef, {
            updated: true,
            point: Number(point),
            lastUpdate: serverTimestamp(),
          });
        }
      }

      alert("포인트가 지급되었습니다");
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
  /*
  const decPoint = async () => {
    let confirm = window.confirm(
      `${selectedUsers.length}명에게 ${point}포인트를 지급합니다\n진행할까요?`
    );
    if (confirm) {
      for (let userObj of selectedUsersId) {
        const uid = userObj.uid; // uid를 객체에서 직접 추출합니다.
        const userDocRef = doc(db, "apply", uid); // 'users'는 컬렉션 이름입니다. 실제 컬렉션 이름으로 변경하세요.
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const currentPoints = userDoc.data().point || 0;
          const newPoints = Number(currentPoints) - Number(point);
          await updateDoc(userDocRef, {
            point: newPoints,
            lastPoint: serverTimestamp(),
          });
        }
      }
      const giftPointCollectionRef = collection(db, "giftPoint");
      await addDoc(giftPointCollectionRef, {
        user: selectedUsers,
        date: serverTimestamp(),
        point: point,
        increase: false,
      });

      alert("포인트가 차감되었습니다");
      setSelectedUsers([]);
      setSelectedUsersId([]);
      getApply();
      setPoint("");
    } else {
      return alert("지급할 인원과 포인트를 확인 후 다시 시도해 주세요");
    }
  };
*/
  const blockIt = async () => {
    let confirm = window.confirm(
      `지급불가 처리 후 되돌릴 수 없습니다 계속 하시겠습니까?`
    );
    if (confirm) {
      let reason = window.prompt("지급불가 사유를 간단하게 적어주세요");
      if (!isNaN(reason) || reason === "") {
        reason = "사유불명";
      }
      if (reason === null) {
        return alert("지급불가 사유를 입력해 주세요. 없으면 0을 입력해 주세요");
      }
      for (let userObj of selectedUsersId) {
        const bid = userObj.bid;
        const boardDocRef = doc(db, "applypoint", bid);
        const boardDoc = await getDoc(boardDocRef);

        if (boardDoc.exists()) {
          await updateDoc(boardDocRef, {
            updated: true,
            point: reason,
            lastUpdate: serverTimestamp(),
          });
        }
      }
      alert("지급 불가 처리하였습니다");
      setSelectedUsers([]);
      setSelectedUsersId([]);
      getApply();
      setPoint("");
    } else {
      return alert("지급할 인원과 포인트를 확인 후 다시 시도해 주세요");
    }
  };
  const getPoint = async id => {
    const docRef = doc(db, "apply", id);

    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const pointValue = docSnapshot.data().point;
        return pointValue;
      } else {
        console.log("문서가 존재하지 않습니다.");
        return 0;
      }
    } catch (error) {
      console.error("데이터 조회 중 오류가 발생했습니다:", error);
      return 0;
    }
  };

  const getLast = async id => {
    const docRef = doc(db, "apply", id);

    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        let lastD, lastT;

        if (data.lastPoint) {
          let dateObject = data.lastPoint.toDate();
          lastD = `${dateObject.getFullYear()}-${String(
            dateObject.getMonth() + 1
          ).padStart(2, "0")}-${String(dateObject.getDate()).padStart(2, "0")}`;
          lastT = `${String(dateObject.getHours()).padStart(2, "0")}시${String(
            dateObject.getMinutes()
          ).padStart(2, "0")}분`;
        } else {
          lastD = 0;
          lastT = 0;
        }

        return { lastD, lastT };
      } else {
        console.log("문서가 존재하지 않습니다.");
        return { lastD: 0, lastT: 0 };
      }
    } catch (error) {
      console.error("데이터 조회 중 오류가 발생했습니다:", error);
      return { lastD: 0, lastT: 0 };
    }
  };

  return (
    <>
      <h2 className="text-3xl font-medium p-2">포인트 지급 신청 목록</h2>
      {applies.length > 0 ? (
        <div
          className={`grid grid-cols-1 xl:grid-cols-4 gap-2 mt-2 bg-white p-2 ${
            selectedUsers.length > 0 ? "mb-60" : null
          } `}
        >
          {applies.map((apply, idx) => (
            <div key={idx} data={apply.bid}>
              <input
                type="checkbox"
                value={apply.bid}
                className="hidden peer"
                id={apply.bid}
                onChange={e => checkUsers(apply, e.target.checked)}
                disabled={apply.updated}
              />
              <label
                htmlFor={apply.bid}
                className="block p-2 bg-indigo-50 hover:bg-indigo-200 text-black rounded-lg border-2 border-indigo-50 hover:border-indigo-200 peer-checked:border-indigo-500 peer-checked:hover:border-indigo-500"
              >
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    신청일시
                  </div>
                  <div className="font-normal col-span-2 flex flex-col justify-center">
                    {apply.interview}
                  </div>
                </div>
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
                    면접일자
                  </div>
                  <div className="font-normal col-span-2 flex flex-col justify-center font-rose-500">
                    {apply.date}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    면접시간
                  </div>
                  <div className="font-normal col-span-2 flex flex-col justify-center font-rose-500">
                    {apply.time}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    포인트
                  </div>
                  <div
                    className="font-normal col-span-2 flex flex-col justify-center"
                    title={points[apply.id]}
                  >
                    {points[apply.id]} point
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    최종지급일시
                  </div>
                  <div
                    className="font-normal col-span-2 flex flex-col justify-center"
                    title={
                      lasts[apply.id] &&
                      `${lasts[apply.id].lastD} ${lasts[apply.id].lastT}`
                    }
                  >
                    {lasts[apply.id] &&
                      `${lasts[apply.id].lastD} ${lasts[apply.id].lastT}`}
                  </div>
                </div>
                {apply.updated ? (
                  <>
                    {isNaN(apply.point) ? (
                      <div className="p-2 bg-rose-500 text-center text-white">
                        지급불가(사유 : {apply.point})
                      </div>
                    ) : (
                      <div className="p-2 bg-green-500 text-center text-white">
                        {apply.point} 포인트 지급 완료
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-2 bg-blue-500 text-center text-white">
                    미지급
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <>{loading}</>
      )}
      {selectedUsers.length > 0 && (
        <>
          <div className="fixed w-full bottom-0 left-1/2 -translate-x-1/2 border-t border-gray-200 bg-white p-3 drop-shadow-xl z-40">
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
                    onClick={blockIt}
                  >
                    지급불가처리
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

export default ApplyBoard;
