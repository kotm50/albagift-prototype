import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Complete() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [comp, setComp] = useState(0);
  useEffect(() => {
    const b = searchParams.get("b");
    setSearchParams(searchParams);
    if (b === "sample") {
      setComp(1);
    }
    if (b === "basic") {
      setComp(2);
    }
    if (b === "survey") {
      setComp(3);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className=" text-white font-bold text-3xl mt-10 text-center">
        감사합니다.
      </div>
      <div className="text-white font-bold text-xl mt-10 text-center">
        {comp === 1 && "선택하신 문항으로 설문을 진행하도록 하겠습니다"}
        {comp === 2 && "담당자가 확인 후 빠르게 연락드리도록 하겠습니다."}
        {comp === 3 && "담당자가 확인 후 빠르게 연락드리도록 하겠습니다."}
      </div>
    </>
  );
}

export default Complete;
