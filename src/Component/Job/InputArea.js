import React, { useState, useEffect } from "react";
import { cities1, cities2 } from "./Data";

function InputArea(props) {
  const [area1, setArea1] = useState("");
  const [area2, setArea2] = useState("");
  useEffect(() => {
    if (props.city) {
      getArea(props.city, props.town);
    }
    // eslint-disable-next-line
  }, []);
  const getArea = (c, t) => {
    let cityNum;
    cities1.forEach(city => {
      if (c === city[0]) {
        cityNum = city[1];
        setArea1(city[1]);
      }
    });
    if (t !== "") {
      cities2[cityNum].forEach(town => {
        if (t === town[0]) {
          setArea2(town[1]);
        }
      });
    }
  };
  return (
    <div id="inputArea" className="text-lg">
      <div className="p-2 bg-gray-200 font-medium">
        <h3>
          <label htmlFor={area1 !== "" || area1 !== "전국" ? "area2" : "area1"}>
            지역을 선택하세요
          </label>
        </h3>
      </div>
      <div className="p-2 pb-3 bg-gray-100 flex gap-2">
        <select
          id="area1"
          className={
            area1 === ""
              ? "block mb-2 font-medium text-gray-400 w-full h-12 p-2 p shadow-sm"
              : "block mb-2 font-medium  w-full h-12 p-2 p shadow-sm"
          }
          value={area1 || ""}
          onChange={e => {
            setArea1(e.currentTarget.value);
            setArea2(0);
            props.setTown("");
            props.setCity(cities1[e.currentTarget.value][0]);
            //setAreaCount(e.currentTarget.key + 1);
          }}
        >
          <option value="" className="text-gray-400 ">
            지역을 선택하세요
          </option>
          {cities1.map(([title, id]) => (
            <option value={id} className="text-black" key={id}>
              {title}
            </option>
          ))}
        </select>
        {area1 !== "" && Number(area1) !== 0 ? (
          <select
            id="area2"
            className={
              area2 === ""
                ? "block mb-2 font-medium text-gray-400 w-full h-12 p-2 p shadow-sm"
                : "block mb-2 font-medium  w-full h-12 p-2 p shadow-sm"
            }
            value={area2 || ""}
            onChange={e => {
              setArea2(e.currentTarget.value);
              props.setTown(cities2[area1][e.currentTarget.value][0]);
            }}
          >
            {area1 === 0 ? (
              <option value="" className="text-gray-400 ">
                지역을 선택하세요
              </option>
            ) : (
              <>
                {cities2[area1].map(([title, id]) => (
                  <option value={id} className="text-black" key={id}>
                    {title}
                  </option>
                ))}
              </>
            )}
          </select>
        ) : null}
      </div>
    </div>
  );
}

export default InputArea;
