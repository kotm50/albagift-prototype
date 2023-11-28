import React, { useState, useRef, useEffect } from "react";

function TotalTable() {
  const [OriginData, setOriginData] = useState("");
  const [array, setArray] = useState(null);

  useEffect(() => {
    convertJson();
    // eslint-disable-next-line
  }, [OriginData]);

  const convertJson = () => {
    let jsonA = OriginData.split("\n");
    setArray(jsonA);
  };
  const inputSheet = useRef();
  return (
    <>
      <div className="container mx-auto bg-white p-2">
        <textarea
          ref={inputSheet}
          className="w-full"
          value={OriginData}
          onChange={e => {
            setOriginData(e.currentTarget.value);
          }}
          style={{ width: "100%", height: "48px" }}
          placeholder="2번째 줄 부터 원하는 영역까지 복사(ctrl+c) 하신 다음 여기에 붙여넣기(ctrl+v) 해주세요"
        ></textarea>
        <div className="mt-2 bg-gray-100 p-2">{array[0]}</div>
      </div>
    </>
  );
}

export default TotalTable;
