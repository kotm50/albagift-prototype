import React, { useState, useEffect } from "react";
import enfj from "../images/mbti/enfj.png";
import enfp from "../images/mbti/enfp.png";
import entj from "../images/mbti/entj.png";
import entp from "../images/mbti/entp.png";
import esfj from "../images/mbti/esfj.png";
import esfp from "../images/mbti/esfp.png";
import estj from "../images/mbti/estj.png";
import estp from "../images/mbti/estp.png";
import infj from "../images/mbti/infj.png";
import infp from "../images/mbti/infp.png";
import intj from "../images/mbti/intj.png";
import intp from "../images/mbti/intp.png";
import isfj from "../images/mbti/isfj.png";
import isfp from "../images/mbti/isfp.png";
import istj from "../images/mbti/istj.png";
import istp from "../images/mbti/istp.png";

function Mbti(props) {
  const [mbti, setMbti] = useState("");
  useEffect(() => {
    setMbti(props.mbti);
  }, [props.mbti, mbti]);

  return (
    <>
      {mbti === "" && <span>로딩중</span>}
      {mbti === "ENFJ" && <img src={enfj} alt="ENFJ" />}
      {mbti === "ENFT" && <img src={enfp} alt="ENFT" />}
      {mbti === "ENTJ" && <img src={entj} alt="ENTJ" />}
      {mbti === "ENTP" && <img src={entp} alt="ENTP" />}
      {mbti === "ESFJ" && <img src={esfj} alt="ESFJ" />}
      {mbti === "ESFP" && <img src={esfp} alt="ESFP" />}
      {mbti === "ESTJ" && <img src={estj} alt="ESTJ" />}
      {mbti === "ESTP" && <img src={estp} alt="ESTP" />}
      {mbti === "INFJ" && <img src={infj} alt="INFJ" />}
      {mbti === "INFP" && <img src={infp} alt="INFP" />}
      {mbti === "INTJ" && <img src={intj} alt="INTJ" />}
      {mbti === "INTP" && <img src={intp} alt="INTP" />}
      {mbti === "ISFJ" && <img src={isfj} alt="ISFJ" />}
      {mbti === "ISFP" && <img src={isfp} alt="ISFP" />}
      {mbti === "ISTJ" && <img src={istj} alt="ISTJ" />}
      {mbti === "ISTP" && <img src={istp} alt="ISTP" />}
    </>
  );
}

export default Mbti;
