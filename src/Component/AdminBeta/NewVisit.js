import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

function NewVisit() {
  const [cName, setCName] = useState("");

  useEffect(() => {
    getDocument();
  }, []);

  // Firestore에서 문서 가져오기
  const getDocument = async () => {
    try {
      const documentRef = doc(db, "visit", "new");
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        const cNameValue = data.cName;
        setCName(cNameValue);
      } else {
        console.log("문서를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("문서를 가져오는 중에 오류가 발생했습니다:", error);
    }
  };

  return (
    <div>
      <p>
        예정고객사:{" "}
        <span className="text-emerald-500 font-medium">{cName}</span>
        <button
          className="text-indigo-500 ml-5 font-medium"
          onClick={e => getDocument()}
        >
          다시확인
        </button>
      </p>
    </div>
  );
}

export default NewVisit;
