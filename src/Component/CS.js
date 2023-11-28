import React from "react";
import { RiCustomerService2Fill } from "react-icons/ri";

function CS() {
  return (
    <a href="tel:1644-4223">
      <div className="flex flex-col justify-start gap-1 text-gray-500 border p-2 mt-2">
        <div className="text-left font-bold text-lg">
          취업상담 / 채용문의
          <span className="text-sm text-indigo-500 font-normal ml-1">
            눌러서 통화하기
          </span>
        </div>
        <div className="text-3xl flex flex-row flex-nowrap gap-2">
          <div className="flex flex-col justify-center">
            <RiCustomerService2Fill size={48} />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-indigo-500 font-bold">1644-4223</span>
          </div>
        </div>
        <div className="font-normal text-base">영업시간 : 09:00 ~ 18:00</div>
        <div className="font-normal text-base">점심시간 : 12:00 ~ 13:00</div>
      </div>
    </a>
  );
}

export default CS;
