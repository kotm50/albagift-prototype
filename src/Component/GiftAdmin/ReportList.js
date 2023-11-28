import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

import ReportDetail from "./ReportDetail";

function ReportList() {
  const [applies, setApplies] = useState([]);
  useEffect(() => {
    getReport();
    //eslint-disable-next-line
  }, []);
  const getReport = async () => {
    const reportCollectionRef = collection(db, "report"); // 'report' 컬렉션의 참조 가져오기

    try {
      const snapshot = await getDocs(reportCollectionRef); // 컬렉션의 모든 문서 스냅샷 가져오기
      const documents = []; // 문서를 저장할 배열

      snapshot.forEach(doc => {
        doc.data().docId = doc.id;
        let docData = doc.data();
        docData.docId = doc.id;
        documents.push(docData); // 문서 데이터를 배열에 추가
      });

      setApplies(documents);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
    }
  };
  return (
    <>
      {applies.length > 0 ? (
        <div className="grid grid-cols-1 justify-start divide-y">
          {applies.map((report, idx) => (
            <div key={idx} data={report.docId}>
              <ReportDetail report={report} idx={idx} />
            </div>
          ))}
        </div>
      ) : (
        "불러오는 중입니다"
      )}
    </>
  );
}

export default ReportList;
