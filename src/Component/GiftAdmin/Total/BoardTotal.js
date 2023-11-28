import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

function BoardTotal() {
  const [applies, setApplies] = useState(0);
  useEffect(() => {
    getApply();
    //eslint-disable-next-line
  }, []);
  const getApply = async () => {
    const applyCollectionRef = collection(db, "applypoint"); // 'apply' 컬렉션의 참조 가져오기

    try {
      const snapshot = await getDocs(applyCollectionRef); // 컬렉션의 모든 문서 스냅샷 가져오기
      const documentCount = snapshot.size; // 문서 수 계산

      setApplies(documentCount);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
    }
  };
  return (
    <div>
      누적 지급 요청 수 :{" "}
      <span className="text-rose-500 text-lg font-medium">{applies}</span> 명
    </div>
  );
}

export default BoardTotal;
