import React from "react";

import Clock from "../Clock";

function MemoHeader(props) {
  return (
    <div className="grid grid-cols-3 border-b mb-3">
      <div className="text-center">
        <button
          className={
            props.menu === 0
              ? "py-2 w-full bg-indigo-100 font-medium"
              : "py-2 w-full hover:bg-indigo-100 hover:font-medium"
          }
          onClick={e => props.setMenu(0)}
        >
          신규메모입력
        </button>
      </div>
      <div className="text-center">
        <button
          className={
            props.menu === 1
              ? "py-2 w-full bg-indigo-100 font-medium"
              : "py-2 w-full hover:bg-indigo-100 hover:font-medium"
          }
          onClick={e => props.setMenu(1)}
        >
          과거메모목록
        </button>
      </div>
      <div className="text-center bg-gray-100 hover:bg-indigo-100 hover:font-medium">
        <Clock />
      </div>
    </div>
  );
}

export default MemoHeader;
