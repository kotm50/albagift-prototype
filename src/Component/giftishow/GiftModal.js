import React from "react";

function GiftModal(props) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative lg:w-auto my-6 mx-auto w-11/12 lg:max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-6">
            <h3 className="text-lg font-medium mb-3">
              쿠폰 구매가 안되시나요?
            </h3>
            <div className="relative p-2 grid grid-cols-1 gap-3 divide-y overflow-y-auto texl-xl">
              고객센터
              <span className="text-3xl font-medium">
                <a href="tel:02-1644-4223" className="hover:text-rose-500">
                  1644-4223
                </a>
              </span>
              연락 부탁드립니다.
            </div>
            <a
              href="tel:02-1644-4223"
              className="text-white text-center drop-shadow-lg bg-indigo-500 p-2 my-1 xl:hidden"
            >
              전화하기
            </a>
            <div
              className="text-white text-center drop-shadow-lg bg-gray-500 p-2 my-1 hover:cursor-pointer"
              onClick={e => {
                props.setModalOn(false);
              }}
            >
              창 닫기
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default GiftModal;
