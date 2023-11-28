import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

function ReportTotal() {
  const [reports, setReports] = useState(0);
  useEffect(() => {
    getReport();
    //eslint-disable-next-line
  }, []);
  const getReport = async () => {
    const reportCollectionRef = collection(db, "report"); // 'report' 컬렉션의 참조 가져오기

    try {
      const snapshot = await getDocs(reportCollectionRef); // 컬렉션의 모든 문서 스냅샷 가져오기
      const documentCount = snapshot.size; // 문서 수 계산

      setReports(documentCount);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
    }
  };
  return (
    <div>
      오류제보 총 :{" "}
      <span className="text-emerald-500 text-lg font-medium">{reports}</span> 개
    </div>
  );
}

export default ReportTotal;
