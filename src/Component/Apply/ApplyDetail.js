import React, { useState } from "react";

import PhotoErr from "../PhotoErr";

function ApplyDetail(props) {
  const [addPoint, setAddPoint] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <PhotoErr photo={props.s.photo} name={props.s.name} />
      <div className="text-base">이름 : {props.s.name}</div>
      <div className="text-base">
        연락처 :{" "}
        {props.s.phone
          .replace(/[^0-9]/g, "")
          .replace(
            /(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g,
            "$1-$2-$3"
          )}
      </div>
      <div className="grid grid-cols-1">
        <button
          className="bg-teal-500 hover:bg-teal-700 text-white p-2 w-full rounded-lg"
          onClick={e => setAddPoint(!addPoint)}
        >
          면접 포인트 확인/지급
        </button>
      </div>

      {addPoint ? (
        <>
          <div className="text-base">
            <span className="font-medium text-pink-500">{props.s.point}</span>
            point
          </div>
          <div className="text-base">포인트 추가하기 기능 개발중</div>
        </>
      ) : null}
    </div>
  );
}

export default ApplyDetail;
