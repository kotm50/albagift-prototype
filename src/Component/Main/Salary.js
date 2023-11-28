import React from "react";

import { minSal } from "../Job/Data";

function Salary() {
  return (
    <>
      {minSal !== undefined ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 border border-gray-200 my-1 py-2 bg-white mt-5 lg:mt-2">
          <h3 className="text-xl lg:text-base text-center px-2 border-r border-gray-200 font-medium mb-2 lg:mb-0">
            2023년 최저임금표
          </h3>
          <div className="flex justify-start lg:justify-around border-r border-gray-200 py-1 lg:py-0">
            <div className="font-medium text-indigo-500 basis-1/2 text-center lg:basis-auto">
              시급
            </div>
            <div className="font-normal text-black ease-in-out duration-150 hover:scale-110  basis-1/3 text-right lg:basis-auto lg:text-center">
              {minSal !== undefined && minSal.hour.toLocaleString("ko-KR")}원
            </div>
          </div>
          <div className="flex justify-start  lg:justify-around border-r border-gray-200 py-1 lg:py-0">
            <div className="font-medium text-indigo-500 basis-1/2 text-center lg:basis-auto">
              주급
            </div>
            <div className="font-normal text-black ease-in-out duration-150 hover:scale-110  basis-1/3 text-right lg:basis-auto lg:text-center">
              {minSal !== undefined && minSal.week.toLocaleString("ko-KR")}원
            </div>
          </div>
          <div className="flex justify-start  lg:justify-around py-1 lg:py-0">
            <div className="font-medium text-indigo-500 basis-1/2 text-center lg:basis-auto">
              월급
            </div>
            <div className="font-normal text-black ease-in-out duration-150 hover:scale-110 basis-1/3 text-right lg:basis-auto lg:text-center">
              {minSal !== undefined && minSal.month.toLocaleString("ko-KR")}원
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Salary;
