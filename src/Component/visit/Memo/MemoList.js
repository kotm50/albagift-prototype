import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

import MemoDetail from "./MemoDetail";

function MemoList(props) {
  const [memoList, setMemoList] = useState([]);

  useEffect(() => {
    getMemoList();
    //eslint-disable-next-line
  }, [props.menu]);

  const getMemoList = async () => {
    try {
      const q = query(collection(db, "visitmemo"), where("id", "==", props.id));
      const querySnapshot = await getDocs(q);
      const memos = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        // Firestore에서 serverTimestamp()로 저장된 시간을 Date 객체로 변환
        const timestamp = doc.data().created.toDate();
        // 원하는 형식으로 시간을 포맷
        const formattedTime = timestamp.toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        });
        // 문서 ID를 데이터에 추가
        data.mid = doc.id;
        // 변환된 시간을 데이터에 추가
        data.formattedTime = formattedTime;
        memos.push(data);
      });
      setMemoList(memos);
    } catch (error) {
      console.error("문서를 불러오는 중에 오류가 발생했습니다:", error);
    }
  };
  return (
    <>
      <h2 className="text-xl mb-2">
        <span className="font-medium">{props.cName}</span> 의 미팅기록
      </h2>
      {memoList.length > 0 ? (
        <div className="flex flex-col justify-start divide-y overflow-y-auto">
          {memoList.map((memo, idx) => (
            <div key={idx}>
              <MemoDetail memo={memo} />
            </div>
          ))}
        </div>
      ) : (
        "불러오는 중입니다..."
      )}
    </>
  );
}

export default MemoList;
