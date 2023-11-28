import React, { useState, useEffect } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

function Meet(props) {
  const [survey, setSurvey] = useState([]);
  const [no, setNo] = useState("");

  useEffect(() => {
    setNum();
    // eslint-disable-next-line
  }, []);

  const setNum = () => {
    const num = props.alias;
    if (no !== null) {
      setNo(Number(num));
      getResult(num);
    }
  };

  const getResult = async num => {
    const resultRef = collection(db, "meet");
    let result = await getDoc(doc(resultRef, `${num}`));
    if (result.data()) {
      setSurvey(result.data().answers);
      props.setMeeting(true);
    } else {
      props.setMeeting(false);
    }
  };

  return (
    <>
      <div className="w-full lg:container lg:mx-auto my-3 bg-white p-3 rounded drop-shadow-lg">
        <h2 className="text-2xl text-center bg-black text-white p-2">
          고객사 방문 사전 설문
        </h2>
        <ul id="survey" className="flex flex-col border border-gray-100">
          {survey &&
            survey.map((sur, idx) => (
              <li id={sur.id} key={idx}>
                <div className="px-2 py-3 bg-gray-200 font-medium">
                  {sur.question}
                </div>
                <div className="px-2 py-3 bg-gray-100">
                  {sur.answer ? (
                    sur.answer
                  ) : (
                    <>
                      {sur.selected.map((s, idx) => (
                        <span key={idx}>
                          {s}
                          {idx < sur.selected.length - 1 && ", "}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default Meet;
