import React from "react";
import ApplyTotal from "./Total/ApplyTotal";
import CouponTotal from "./Total/CouponTotal";
import ReportTotal from "./Total/ReportTotal";
import BoardTotal from "./Total/BoardTotal";

function Main() {
  return (
    <>
      <BoardTotal />
      <ApplyTotal />
      <CouponTotal />
      <ReportTotal />
    </>
  );
}

export default Main;
