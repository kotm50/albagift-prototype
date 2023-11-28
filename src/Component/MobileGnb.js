import React from "react";

import SubMenu from "./SubMenu";
import CS from "./CS";
import Modal from "./doc/Modal";

import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

function MobileGnb() {
  const [menuOn, setMenuOn] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [modalCount, setModalCount] = useState(0);
  return (
    <>
      <div className="fixed top-0 bottom-0 right-0 w-3/4 h-screen bg-white z-30 p-3 overflow-auto">
        <div
          id="mobileSearchArea"
          className="flex justify-around text-center my-auto gap-2"
        >
          <div className="flex gap-0 justify-between py-0 px-2 w-11/12 rounded-full border-2 border-indigo-500 basis-3/4">
            <input
              type="text"
              className="block w-11/12 border-0 p-1 bg-transparent text-sm"
              placeholder="검색하고 싶은 키워드 입력"
              value={searchParam}
              onChange={e => setSearchParam(e.currentTarget.value)}
              onBlur={e => setSearchParam(e.currentTarget.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  searchIt();
                }
              }}
            />
            <button className="w-1/12" onClick={e => searchIt()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-indigo-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
          <div
            className="flex flex-col justify-center border border-gray-500 text-gray-500 rounded p-1 hover:cursor-pointer"
            onClick={e => setMenuOn(false)}
          >
            <AiOutlineClose size={20} />
          </div>
        </div>
        <div className="text-xs border-b my-2 pb-2 text-center">
          <strong>추천검색어</strong> : 재택근무, 카톡상담, 인바운드, 아웃바운드
        </div>
        <div>
          <SubMenu setMenuOn={setMenuOn} />
        </div>
        <CS />
        <div className="bg-white py-2 border-gray-300">
          <div className="flex flex-col text-sm">
            <div
              className="p-2 hover:cursor-pointer"
              onClick={e => {
                setModalCount(1);
                setModalOn(true);
              }}
            >
              개인정보처리방침
            </div>
            <div
              className="p-2 hover:cursor-pointer"
              onClick={e => {
                setModalCount(2);
                setModalOn(true);
              }}
            >
              이용약관
            </div>
            <div
              className="p-2 hover:cursor-pointer"
              onClick={e => {
                setModalCount(3);
                setModalOn(true);
              }}
            >
              e메일 무단수집거부
            </div>
          </div>
        </div>
        {modalOn ? (
          <Modal
            modalCount={modalCount}
            setModalOn={setModalOn}
            setModalCount={setModalCount}
          />
        ) : null}
      </div>
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-20 overflow-hidden"
        onClick={e => setMenuOn(false)}
      ></div>
    </>
  );
}

export default MobileGnb;
