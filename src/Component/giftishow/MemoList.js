import React, { useState, useEffect } from "react";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function MemoList(props) {
  const [memoList, setMemoList] = useState([]);
  const [loadMsg, setLoadMsg] = useState("불러오는 중입니다...");
  useEffect(() => {
    getMemoList(props.trId);
    //eslint-disable-next-line
  }, []);

  const getMemoList = async t => {
    // 'couponmemo' 컬렉션에서 'trId' 필드가 객체 't'와 일치하는 문서를 쿼리합니다.
    const q = query(
      collection(db, "couponmemo"),
      where("trId", "==", t),
      orderBy("date")
    );
    const querySnapshot = await getDocs(q);

    const memos = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id; // 문서의 ID를 가져옵니다.
      // timestamp 객체를 자바스크립트 Date 객체로 변환합니다.
      const date = data.date.toDate(); // toDate() 메서드를 사용합니다.
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}:${String(date.getSeconds()).padStart(2, "0")}`;
      // 메모와 함께 문서의 ID도 추가합니다.
      memos.push({ id, ...data, formattedDate });
    });
    if (memos.length === 0) {
      setLoadMsg("메모가 없습니다");
    }
    // 결과를 상태로 설정합니다.
    setMemoList(memos);
  };
  return (
    <div className="h-full overflow-auto">
      {memoList.length > 0 ? (
        <>
          <div className="grid grid-cols-5 gap-y-1 bg-gray-50 p-1">
            <div className="col-span-2 text-center bg-white">작성일</div>
            <div className="col-span-3 text-center bg-white">내용</div>
          </div>
          {memoList.map((memo, idx) => (
            <div className="grid grid-cols-5 gap-1 bg-gray-50 p-1" key={idx}>
              <div className="col-span-2 bg-white p-1">
                {memo.formattedDate}
              </div>
              <div className="col-span-3 bg-white p-1">{memo.memo}</div>
            </div>
          ))}
        </>
      ) : (
        loadMsg
      )}
    </div>
  );
}

export default MemoList;
