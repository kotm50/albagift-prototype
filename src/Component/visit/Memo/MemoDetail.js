import React, { useState } from "react";

import dompurify from "dompurify";

function MemoDetail(props) {
  const sanitizer = dompurify.sanitize;
  const [detailOpen, setDetailOpen] = useState(false);
  const detailHandler = () => {
    setDetailOpen(!detailOpen);
    console.log(props.memo.mid);
  };
  return (
    <>
      <div
        className={
          detailOpen
            ? "hover:cursor-pointer bg-gray-100 p-2 hover:bg-gray-200 font-medium"
            : "hover:cursor-pointer hover:bg-gray-100 p-2"
        }
        onClick={detailHandler}
      >
        {props.memo.formattedTime}에 작성한 메모{" "}
        <span
          className={
            detailOpen
              ? "font-medium border-b border-green-500 text-green-500"
              : "font-medium border-b border-indigo-500 text-indigo-500"
          }
        >
          {detailOpen ? "접기" : "보기"}
        </span>
      </div>
      {detailOpen ? (
        <div className="m-2 p-2 border grid grid-cols-1 divide-y">
          <div className="grid grid-cols-10">
            <div className="p-2 bg-gray-200 col-span-2">미팅참석자</div>
            <div className="p-2 col-span-8 bg-gray-50">
              {props.memo.meeting}
            </div>
          </div>
          <div className="grid grid-cols-10">
            <div className="p-2 bg-gray-200 col-span-2">면접비</div>
            <div className="p-2 col-span-8 bg-gray-50">{props.memo.reward}</div>
          </div>
          <div className="grid grid-cols-10">
            <div className="p-2 bg-gray-200 col-span-2">면접질의서</div>
            <div className="p-2 col-span-8 bg-gray-50">{props.memo.koti}</div>
          </div>
          <div className="grid grid-cols-10">
            <div className="p-2 bg-gray-200 col-span-2">면접장소</div>
            <div className="p-2 col-span-8 bg-gray-50">{props.memo.place}</div>
          </div>
          <div className="grid grid-cols-10">
            <div className="p-2 bg-gray-200 col-span-2">면접장소</div>
            <div className="p-2 col-span-8 bg-gray-50">{props.memo.place}</div>
          </div>
          <div className="grid grid-cols-10">
            <div className="p-2 bg-gray-200 col-span-2">상세메모</div>
            <div
              className="memo p-2 col-span-8 bg-gray-50"
              dangerouslySetInnerHTML={{
                __html: sanitizer(props.memo.memo),
              }}
            ></div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default MemoDetail;
