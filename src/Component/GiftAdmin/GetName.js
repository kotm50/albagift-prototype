import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

function GetName(props) {
  const [name, setName] = useState("");
  useEffect(() => {
    getApplyName(props.phone);
    //eslint-disable-next-line
  }, []);

  const getApplyName = async phone => {
    // 검색을 위해 Firestore의 gift 컬렉션에 쿼리를 실행합니다.
    // applyName에 대한 쿼리
    const applyQuery = query(
      collection(db, "apply"),
      where("phone", "==", phone)
    );

    try {
      const applySnapshot = await getDocs(applyQuery);
      const applyDocs = applySnapshot.docs.map(doc => doc.data());
      if (applyDocs.length > 0) {
        setName(applyDocs[0].name);
      } else {
        setName("불명");
      }
    } catch (error) {
      console.error("Firestore 검색 오류:", error);
    }
  };
  return (
    <p className="break-keep overflow-hidden text-ellipsis">
      구매자명 : {name}
    </p>
  );
}

export default GetName;
