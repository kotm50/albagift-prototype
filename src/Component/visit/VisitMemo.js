import React, { useState } from "react";

import MemoInput from "./Memo/MemoInput";
import MemoHeader from "./Memo/MemoHeader";
import MemoList from "./Memo/MemoList";

import RefreshOff from "../RefreshOff";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

function VisitMemo(props) {
  const [menu, setMenu] = useState(0);
  return (
    <>
      <div className="p-3">
        <RefreshOff />
        <MemoHeader menu={menu} setMenu={setMenu} />
        {menu === 0 ? (
          <MemoInput visit={props.visit} id={props.id} menu={props.menu} />
        ) : (
          <MemoList id={props.id} menu={props.menu} cName={props.visit.cName} />
        )}
      </div>
    </>
  );
}

export default VisitMemo;
