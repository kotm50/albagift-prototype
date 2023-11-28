import React, { useState, useEffect } from "react";
import { cities1, cities2 } from "../Job/Data";

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
    <div className="flex gap-2 xl:w-2/3">
      <select
        id="area1"
        className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg"
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
          className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg"
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
  );
}

export default InputArea;
