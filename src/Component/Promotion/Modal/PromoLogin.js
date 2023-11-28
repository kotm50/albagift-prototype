import React, { useState } from "react";
import PromoMain from "./PromoMain";
import PromoEmail from "./PromoEmail";
import PromoPhone from "./PromoPhone";

import { AiOutlineClose } from "react-icons/ai";

function PromoLogin(props) {
  const [account, setAccount] = useState(0);
  return (
    <>
      <div
        id="loginPopup"
        className="rounded fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg flex flex-col justify-center px-2 w-11/12 xl:w-1/2 z-40"
      >
        <button
          className="w-full text-white text-right font-normal shadow-lg mb-2"
          onClick={e => props.setModalOn(false)}
        >
          창 닫기 <AiOutlineClose size={20} className="inline" />
        </button>
        <div className="bg-white px-2 py-4 rounded">
          {account > 0 && (
            <div className="grid grid-cols-1 mb-2">
              <button
                className="border border-indigo-500 hover:border-indigo-700 p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 block text-center rounded-full"
                onClick={e => {
                  e.preventDefault();
                  setAccount(0);
                }}
              >
                다른 방식으로 가입하기
              </button>
            </div>
          )}
          {account === 0 ? (
            <PromoMain setAccount={setAccount} />
          ) : account === 1 ? (
            <PromoEmail />
          ) : account === 3 ? (
            <PromoPhone />
          ) : null}
        </div>
      </div>
      <div className="fixed z-20 top-0 bottom-0 left-0 right-0 w-full h-screen"></div>
    </>
  );
}

export default PromoLogin;
