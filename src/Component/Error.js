import React from "react";

function Error() {
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-red-500"
      id="error"
    >
      <div className="mt-10 bg-white p-3 text-indigo-500 text-lg font-bold w-5/6 mx-auto lg:container text-center rounded drop-shadow-lg">
        오류가 발생했습니다. 관리자에게 문의해주세요
      </div>
    </div>
  );
}

export default Error;
