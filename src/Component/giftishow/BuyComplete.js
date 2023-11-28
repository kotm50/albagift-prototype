import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

function BuyComplete() {
  let navi = useNavigate();
  const user = useSelector(state => state.user);
  const [timer, setTimer] = useState(5);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(intervalId);
          return prevTimer - 1;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (timer === 0) {
      navi(`/couponlist/${user.uid}`);
    }
    //eslint-disable-next-line
  }, [timer]);

  return (
    <div className="buyResult container mx-auto bg-white">
      <h1 className="text-center text-xl xl:text-4xl font-medium">
        구매가 완료되었습니다.
        <br className="block xl:hidden" /> 이용해주셔서 감사합니다.
      </h1>
      <div className="countainer mx-auto bg-indigo-50 p-4 mt-5 rounded-lg">
        <div className="xl:text-lg text-center">
          <strong className="text-rose-500 text-xl xl:text-2xl">{timer}</strong>{" "}
          초 후 쿠폰리스트로 이동합니다
        </div>
      </div>

      <div className="countainer mx-auto p-4 mt-5 rounded-lg">
        <div className="xl:text-lg text-center">
          <Link
            to={`/couponlist/${user.uid}`}
            className="border-b border-blue-1 pb-1 text-blue-500 hover:text-blue-700 hover:border-blue-700"
          >
            바로 이동하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BuyComplete;
