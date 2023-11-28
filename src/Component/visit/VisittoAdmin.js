import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import smoothscroll from "smoothscroll-polyfill";

import Info from "./Info";
import AdImg from "./AdImg";
import ExistImg from "./ExistImg";
import Meet from "./Meet";

function VisittoAdmin() {
  const { aliasNum } = useParams();
  const [visit, setVisit] = useState(null);
  const [select, setSelect] = useState(0);
  const [admin, setAdmin] = useState(true);
  const [meeting, setMeeting] = useState(true);

  const inf = useRef();
  const adi = useRef();
  const exi = useRef();
  const mee = useRef();

  useEffect(() => {
    setAdmin(true);
    setAlias();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      window.addEventListener("scroll", handleScroll);
    }, 100);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line
  }, []);

  const handleScroll = () => {
    let sa;
    let sb;
    let sc;
    if (meeting) {
      sa = inf.current.scrollHeight * 0.8;
      sb = inf.current.scrollHeight + adi.current.scrollHeight * 0.8;
      sc =
        inf.current.scrollHeight +
        adi.current.scrollHeight +
        exi.current.scrollHeight * 0.8;
    } else {
      sa = 0;
      sb = adi.current.scrollHeight * 0.8;
      sc = adi.current.scrollHeight + exi.current.scrollHeight * 0.8;
    }
    if (window.scrollY >= sc) {
      setSelect(3);
    } else if (window.scrollY >= sb) {
      setSelect(2);
    } else if (window.scrollY >= sa) {
      setSelect(1);
    } else {
      setSelect(0);
    }
  };

  const setAlias = () => {
    getResult();
  };

  const getResult = async () => {
    const resultRef = collection(db, "visit");
    let result;
    if (aliasNum === undefined) {
      result = await getDoc(doc(resultRef, "new"));
    } else {
      result = await getDoc(doc(resultRef, aliasNum));
    }
    setVisit(result.data());
  };

  const selectSection = s => {
    if (s === 0) {
      smoothscroll.polyfill();
      inf.current.scrollIntoView({ behavior: "smooth" });
    }
    if (s === 1) {
      smoothscroll.polyfill();
      adi.current.scrollIntoView({ behavior: "smooth" });
    }
    if (s === 2) {
      smoothscroll.polyfill();
      exi.current.scrollIntoView({ behavior: "smooth" });
    }
    if (s === 3) {
      smoothscroll.polyfill();
      mee.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {visit === null ? (
        <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-white bg-opacity-80 z-50">
          <div className="text-center mt-96">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-20">
            {meeting ? (
              <div ref={inf} className={meeting ? "pt-1" : "hidden pt-1"}>
                <Meet
                  alias={visit.alias}
                  meeting={meeting}
                  setMeeting={setMeeting}
                />
              </div>
            ) : null}
            <div ref={adi} className="pt-1">
              <Info visit={visit} admin={admin} />
            </div>
            <div ref={exi} className="pt-1">
              {visit.adImgA !== "" ? <AdImg visit={visit} /> : " "}
            </div>
            <div ref={mee} className="pt-1">
              {visit.existImgA !== "" ? <ExistImg visit={visit} /> : " "}
            </div>
            <div className="fixed bottom-0 left-0 right-0 w-full p-4 bg-white text-center">
              <div className="w-full lg:container lg:mx-auto flex justify-between gap-2">
                {meeting ? (
                  <button
                    className={
                      select === 0
                        ? "bg-indigo-700 p-2 px-4 text-white drop-shadow-xl w-full"
                        : "bg-indigo-500 p-2 px-4 text-white drop-shadow-xl w-full"
                    }
                    onClick={e => selectSection(0)}
                  >
                    사전설문
                  </button>
                ) : null}
                {visit.adImgA !== "" && (
                  <button
                    className={
                      select === 1
                        ? "bg-indigo-700 p-2 px-4 text-white drop-shadow-xl w-full"
                        : "bg-indigo-500 p-2 px-4 text-white drop-shadow-xl w-full"
                    }
                    onClick={e => selectSection(1)}
                  >
                    기본정보
                  </button>
                )}
                {visit.existImgA !== "" && (
                  <button
                    className={
                      select === 2
                        ? "bg-indigo-700 p-2 px-4 text-white drop-shadow-xl w-full"
                        : "bg-indigo-500 p-2 px-4 text-white drop-shadow-xl w-full"
                    }
                    onClick={e => selectSection(2)}
                  >
                    코티광고
                  </button>
                )}

                <button
                  className={
                    select === 3
                      ? "bg-indigo-700 p-2 px-4 text-white drop-shadow-xl w-full"
                      : "bg-indigo-500 p-2 px-4 text-white drop-shadow-xl w-full"
                  }
                  onClick={e => selectSection(3)}
                >
                  기존광고
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default VisittoAdmin;
