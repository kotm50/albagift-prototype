import React, { useState, useEffect } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useSearchParams } from "react-router-dom";

import dayjs from "dayjs";
import html2canvas from "html2canvas";

function Meet() {
  let navi = useNavigate();

  const [survey, setSurvey] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [no, setNo] = useState("");
  const [isCapture, setIsCapture] = useState(false);

  useEffect(() => {
    setNum();
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `미팅사전설문지`;
    // eslint-disable-next-line
  }, []);

  const setNum = () => {
    const num = searchParams.get("alias");
    setSearchParams(searchParams);
    if (no !== null) {
      setNo(Number(num));
      getResult(num);
    } else {
      navi("/error");
    }
  };

  const getResult = async num => {
    const resultRef = collection(db, "meet");
    let result = await getDoc(doc(resultRef, `${num}`));
    setSurvey(result.data().answers);
  };

  const onSaveToImg = async () => {
    window.scrollTo(0, 0);
    await setIsCapture(true);
    let now = dayjs();
    let capture = document.querySelector("#capture");
    let captureTime = now.format("YYYYMMDDHHmm");

    await html2canvas(capture, {
      allowTaint: true,
      useCORS: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
    }).then(async canvas => {
      await saveAs(
        canvas.toDataURL("image/png"),
        no + "_" + captureTime + ".png"
      );
    });
    setIsCapture(false);
  };

  const saveAs = (uri, filename) => {
    var link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = uri;
      link.download = filename;
      //Firefox requires the link to be in the body
      document.body.appendChild(link);
      //simulate click
      link.click();
      //remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  };

  return (
    <>
      <div className="w-full p-2 bg-white drop-shadow-lg mb-3 text-center">
        <button
          className="bg-teal-500 hover:bg-teal-700 py-3 px-10 font-medium m-auto text-white rounded-full"
          onClick={onSaveToImg}
        >
          이미지로 저장
        </button>
      </div>
      <div className="flex flex-col container mx-auto">
        <div
          className="w-11/12 md:w-4/5 mx-auto p-2 rounded mb-3 max-w-2xl bg-teal-500 drop-shadow"
          id="capture"
        >
          <div className="bg-white text-lg box-border border-2 drop-shadow p-1">
            <ul id="survey" className="flex flex-col border border-gray-100">
              {survey &&
                survey.map((sur, idx) => (
                  <li id={sur.id} key={idx}>
                    <div
                      className={
                        !isCapture
                          ? "px-2 py-3 bg-gray-200 font-medium"
                          : "captureIt px-2 pb-5 bg-gray-200 font-medium"
                      }
                    >
                      {sur.question}
                    </div>
                    <div
                      className={
                        !isCapture
                          ? "px-2 py-3 bg-gray-100"
                          : "captureIt px-2 pb-5 bg-gray-100"
                      }
                    >
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
        </div>
      </div>
    </>
  );
}

export default Meet;
