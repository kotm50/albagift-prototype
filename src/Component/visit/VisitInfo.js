import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";

import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import smoothscroll from "smoothscroll-polyfill";

import Info from "./Info";
import AdImg from "./AdImg";
import ExistImg from "./ExistImg";
import Meet from "./Meet";
import VisitMemo from "./VisitMemo";
import Loading from "../Loading";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function VisitInfo() {
  const { aliasNum } = useParams();
  const [visit, setVisit] = useState(null);
  const [select, setSelect] = useState(0);
  const [admin, setAdmin] = useState(false);
  const [meeting, setMeeting] = useState(true);
  const [error, setError] = useState(false);
  const [memo, setMemo] = useState(false);
  const [id, setId] = useState("");

  const inf = useRef();
  const adi = useRef();
  const exi = useRef();
  const mee = useRef();

  useEffect(() => {
    setAdmin(false);
    setAlias();
    // eslint-disable-next-line
  }, []);
  /*
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
  */

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
    if (result.data() !== undefined) {
      setId(formatNumber(result.data().alias));
      setVisit(result.data());
    } else {
      setError(true);
    }
  };

  const formatNumber = num => {
    const numString = num.toString();
    const paddedString = numString.padStart(4, "0");
    return paddedString;
  };

  const selectSection = s => {
    if (s === 0) {
      setSelect(0);
      smoothscroll.polyfill();
      inf.current.scrollIntoView({ behavior: "smooth" });
    }
    if (s === 1) {
      setSelect(1);
      smoothscroll.polyfill();
      adi.current.scrollIntoView({ behavior: "smooth" });
    }
    if (s === 2) {
      setSelect(2);
      smoothscroll.polyfill();
      exi.current.scrollIntoView({ behavior: "smooth" });
    }
    if (s === 3) {
      setSelect(3);
      smoothscroll.polyfill();
      mee.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMemo = () => {
    setMemo(!memo);
  };

  return (
    <>
      {!error ? (
        <>
          {visit === null ? (
            <Loading />
          ) : (
            <>
              <div
                className={memo ? "mb-20 memolock overflow-hidden" : "mb-20"}
              >
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
                  {visit.adImgA !== "" ? <AdImg visit={visit} /> : " "}
                </div>
                <div ref={exi} className="pt-1">
                  {visit.existImgA !== "" ? <ExistImg visit={visit} /> : " "}
                </div>
                <div ref={mee} className="pt-1">
                  <Info visit={visit} admin={admin} />
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
                        코티 광고
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
                        기존 광고
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
                      케어서비스 안내
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={
                  !memo
                    ? "sidemenu off hidden xl:block"
                    : "sidemenu on hidden xl:block"
                }
              >
                <button
                  className="fixed top-1/2 -translate-y-1/2 w-12 -translate-x-12 hidden xl:block xl:bg-white hover:bg-yellow-100 rounded-l-xl hover:cursor-pointer border-l border-y"
                  onClick={handleMemo}
                >
                  {memo ? (
                    <FaAngleRight size={48} />
                  ) : (
                    <FaAngleLeft size={48} />
                  )}
                </button>
                <VisitMemo visit={visit} id={id} />
              </div>
            </>
          )}
        </>
      ) : (
        <div className="fixed top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-lg text-xl text-indigo-500 text-center">
          <div className="my-3">
            아직 작성하지 않았거나 잘못된 고유번호 입니다
          </div>
          <div className="my-3 text-base p-2 bg-gray-100">
            입력하신 고유번호는
            <br />
            <span className="text-black font-medium text-2xl">{aliasNum} </span>
            입니다
          </div>
          <div className="my-3">고유번호가 정확한지 확인해 주세요</div>
          <Link
            to="/beforevisit"
            className="block w-full my-3 p-1 rounded-full bg-indigo-500 text-white font-medium"
          >
            다시 입력하기
          </Link>
        </div>
      )}
      {!memo ? null : (
        <div className="fixed hidden xl:block top-0 left-0 w-screen h-screen bg-black bg-opacity-30 z-0"></div>
      )}
    </>
  );
}

export default VisitInfo;
