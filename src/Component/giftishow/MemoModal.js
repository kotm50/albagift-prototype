import React from "react";

import MemoList from "./MemoList";

function MemoModal(props) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative lg:w-auto my-6 mx-auto w-11/12 lg:max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-screen p-6">
            <MemoList trId={props.coupon.trId} />
            <button
              className="bg-gray-500 p-2 text-white"
              onClick={e => {
                props.setMemoModal(false);
              }}
            >
              창닫기
            </button>
          </div>
        </div>
      </div>
      <div
        className="opacity-25 fixed inset-0 z-40 bg-black"
        onClick={e => props.setMemoModal(false)}
      ></div>
    </>
  );
}

export default MemoModal;
