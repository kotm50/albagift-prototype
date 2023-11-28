import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  where,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Loading from "./Loading";
import PhotoErr from "./PhotoErr";

function SurveyList() {
  const user = useSelector(state => state.user);
  let navi = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    chkAdmin(user);
    getList(1);
    // eslint-disable-next-line
  }, []);

  const chkAdmin = user => {
    setTimeout(() => {
      if (!user.admin) {
        alert("관리자 로그인이 필요합니다");
        navi("/adminlogin");
      } else {
        setCorrect(true);
      }
    }, 1000);
  };

  return <>{!correct ? <Loading /> : <></>}</>;
}

export default SurveyList;
