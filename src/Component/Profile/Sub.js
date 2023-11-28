import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

function Sub(props) {
  dayjs.locale("ko");
  const created = dayjs(props.s.created.toDate()).format("YY/MM/DD");
  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg p-2 text-center bg-indigo-500 text-white">
        <strong>{props.s.name}</strong>님의 신청서
      </div>
      <div className="text-base">
        <strong className="text-red-500 font-medium">번호</strong> :{" "}
        {props.s.alias}
      </div>
      <div className="text-base">
        <strong className="text-red-500 font-medium">지점명</strong> :{" "}
        {props.s.center}
      </div>
      <div className="text-base">
        <strong className="text-red-500 font-medium">신청일</strong> : {created}
      </div>
      <div className="text-base">
        <strong className="text-red-500 font-medium">상태</strong> :{" "}
        {props.s.complete ? "작업완료" : "미완료"}
      </div>
      <div className="text-base">
        <a
          href={`subdetail/${props.s.alias}`}
          className="p-2 block bg-teal-500 text-white text-center"
        >
          신청서 확인
        </a>
      </div>
    </div>
  );
}

export default Sub;
