import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Premium from "./Main/Premium";
import JobList from "./Main/JobList";
import AllJob from "./Main/AllJob";
import SpecialList from "./Main/SpecialList";
import Salary from "./Main/Salary";
import MainGiftList from "./Main/MainGiftList";

function Main() {
  let navi = useNavigate();
  useEffect(() => {
    navi("/giftlist");
    //eslint-disable-next-line
  }, []);
  return (
    <>
      <Premium />
      <MainGiftList />
      <div className="w-11/12 lg:container mx-auto relative">
        <Salary />
        <SpecialList />
        <JobList />
        <AllJob />
      </div>
    </>
  );
}

export default Main;
