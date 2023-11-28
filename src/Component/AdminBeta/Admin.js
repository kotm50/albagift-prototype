import React from "react";
import { useNavigate } from "react-router-dom";

import NewVisit from "./NewVisit";

function Admin() {
  let navi = useNavigate();
  return (
    <>
      <h2 className="container mx-auto py-2 bg-white rounded-lg text-2xl text-center text-indigo-500 font-medium mb-5">
        안녕하세요 코리아티엠입니다
      </h2>
      <div className="grid grid-cols-2 gap-y-3 gap-x-10 container mx-auto">
        <div className="bg-white rounded-lg p-2 text-center">
          <button
            className="bg-indigo-500 hover:bg-indigo-700 py-2 text-center text-white w-full rounded-lg text-xl"
            onClick={e => navi("/beforevisit")}
          >
            💻미팅자료열람(선택)
          </button>
          <div>
            <p>고객사 번호를 입력하여 기존 미팅자료를 열람합니다.</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-2 text-center">
          <button
            className="bg-indigo-500 hover:bg-indigo-700 py-2 text-center text-white w-full rounded-lg text-xl"
            onClick={e => navi("/visit")}
          >
            📱미팅자료열람(최신)
          </button>
          <NewVisit />
        </div>
      </div>
    </>
  );
}

export default Admin;
