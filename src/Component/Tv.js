import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

import { collection, setDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

import Loading from "./Loading";

function Tv() {
  let now = dayjs().locale("ko");
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(null);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [date, setDate] = useState("");
  const [dateKr, setDateKr] = useState("");
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [ampm, setAmpm] = useState("");
  const [survey, setSurvey] = useState(0);
  const [monthlySurvey, setMonthlySurvey] = useState(0);
  const [beforeMonth, setBeforeMonth] = useState(
    Math.floor(Math.random() * 500 + 2700)
  );

  useEffect(() => {
    const un = setInterval(() => {
      if (count < 99) {
        setCount(count + 1);
      } else {
        setCount(0);
      }
    }, 60000);
    return () => clearInterval(un);
    // eslint-disable-next-line
  }, [count]);

  useEffect(() => {
    const ap = setInterval(() => {
      if (count > 9 && count % 10 === 0) {
        getMoreSurvey();
      }
    }, 60000);
    return () => clearInterval(ap);
    // eslint-disable-next-line
  }, [count]);

  useEffect(() => {
    getBasicSurvey();
    getMonthlySurvey(0, 0);
    getBeforeMonthSurvey(now.format("DD"));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer(now.format("YYYY년 MM월 DD일 HH:mm:ss"));
      setYear(now.format("YYYY"));
      setMonth(now.format("MM"));
      setDay(now.format("DD"));
      setDate(now.locale("en").format("ddd"));
      setDateKr(now.format("ddd"));
      setHour(now.format("hh"));
      setMin(now.format("mm"));
      setSec(now.format("ss"));
      setAmpm(now.format("a"));
    }, 1000);
    return () => clearInterval(id);
  }, [now, timer]);

  const getBasicSurvey = async () => {
    setSurvey(100);
  };

  const getMoreSurvey = async () => {
    let s = survey;
    let m = monthlySurvey;
    let r = Math.floor(Math.random() * 3);
    setSurvey(s + r);
    setMonthlySurvey(m + r);
  };

  const getBeforeMonthSurvey = async e => {
    if (e === "01") {
      setApplies(true);
    } else {
      setApplies(false);
    }
  };

  const setApplies = async b => {
    const applyRef = collection(db, "test");
    if (b === true) {
      let s = { apply: Math.floor(Math.random() * 500 + 2700) };
      await setDoc(doc(applyRef, "Monthly"), s);
    }
    let result = await getDoc(doc(applyRef, "Monthly"));
    setBeforeMonth(result.data().apply);
  };

  const getMonthlySurvey = async (e, t) => {
    let d = Number(now.format("DD"));
    if (d >= 7) {
      d = d - 2;
    } else if (d >= 14) {
      d = d - 4;
    } else if (d >= 21) {
      d = d - 6;
    } else if (d >= 28) {
      d = d - 8;
    }
    let total = t + Math.floor(Math.random() * 10 + 120);
    if (d - 1 > e) {
      let c = e + 1;
      getMonthlySurvey(c, total);
    } else {
      setMonthlySurvey(total);
    }
  };

  return (
    <>
      {timer !== null ? (
        <>
          <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full z-40 bg-teal-900">
            <img
              src={`https://source.unsplash.com/collection/${count}/1920x1080`}
              alt=""
              className="w-full opacity-40"
            />
          </div>
          <div className="fixed bottom-10 left-0 right-0 w-full z-50">
            <div className="flex justify-center gap-10">
              <div className="text-center text-white p-3 rounded border-2 border-white">
                <div className="text-4xl mb-3">
                  {Number(month) - 1}월 총 면접자수
                </div>
                <div className="text-8xl font-bold text-yellow-300">
                  {beforeMonth}
                  <span className="font-normal text-white text-4xl">명</span>
                </div>
              </div>
              <div className="text-center text-white p-3 rounded border-2 border-white">
                <div className="text-4xl mb-3">금일 총 면접자수</div>
                <div className="text-8xl font-bold text-yellow-300">
                  {survey}
                  <span className="font-normal text-white text-4xl">명</span>
                </div>
              </div>
              <div className="text-center text-white p-3 rounded border-2 border-white">
                <div className="text-4xl mb-3">
                  {Number(month)}월 누적 면접자수
                </div>
                <div className="text-8xl font-bold text-yellow-300">
                  {monthlySurvey}
                  <span className="font-normal text-white text-4xl">명</span>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed top-20 left-1/2 -translate-x-1/2 text-center font-normal text-white text-6xl z-50">
            채용대박! <strong className="text-bold">코리아티엠</strong>입니다
            <div className="mt-3">방문해주셔서 감사합니다</div>
          </div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white z-50 p-10 rounded-lg">
            <div id="tv_date" className="text-5xl font-bold">
              {year}년 {month}월 {day}일 {dateKr}요일{" "}
              <small className="font-normal text-3xl">({date})</small>
            </div>
            <div id="tv_time" className="text-9xl font-bold">
              <small>{ampm} </small>
              {hour}:{min}:{sec}
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Tv;
