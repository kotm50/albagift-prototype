import React, { useState, useEffect } from "react";

const Timer = props => {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    // seconds가 0이 아닌 경우에만 타이머를 실행
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);

      // 컴포넌트가 언마운트될 때 타이머를 클리어
      return () => clearInterval(timer);
    } else {
      // seconds가 0이면 props.setAllowRightClick을 false로 설정
      props.setAllowRightClick(false);
    }
    //eslint-disable-next-line
  }, [seconds]); // seconds 혹은 props가 변경되면 effect를 재실행

  return (
    <div className="text-center p-2 bg-blue-50">
      <a
        href={`/downloadImageProxy?url=${props.coupon}`}
        download
        className="w-full bg-violet-500 hover:bg-violet-700 p-2 text-white block mb-2"
        onClick={e => props.setAllowRightClick(false)}
        target="_blank"
        rel="noreferrer"
      >
        다운로드
      </a>
      <strong className="text-lg text-rose-500">{seconds}</strong>초 뒤 버튼이
      사라집니다
    </div>
  );
};

export default Timer;
