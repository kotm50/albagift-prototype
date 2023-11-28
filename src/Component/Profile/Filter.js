import React, { useState, useEffect } from "react";

import real from "../../Asset/Profile/real.png";
import cartoon from "../../Asset/Profile/cartoon.png";

function Filter(props) {
  const [checkedInputs, setCheckedInputs] = useState([]);
  useEffect(() => {
    props.setFilter(checkedInputs);
    //eslint-disable-next-line
  }, [checkedInputs]);

  const changeHandler = (checked, id) => {
    if (checked) {
      if (checkedInputs.length === 1) {
        return alert("최대 1개만 선택 가능합니다.");
      }
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
  };
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        [real, "real", "필터 미적용"],
        [cartoon, "cartoon", "필터 적용"],
      ].map((filter, idx) => (
        <div key={idx}>
          <div className="border rounded">
            <input
              type="checkbox"
              value={filter[2]}
              id={"filter" + idx}
              name={filter[2]}
              className="peer hidden"
              onChange={e => {
                changeHandler(e.currentTarget.checked, filter[2]);
              }}
              checked={checkedInputs.includes(filter[2]) ? true : false}
            />
            <label
              htmlFor={"filter" + idx}
              className="block trfilterition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-purple-100 text-stone-900  peer-checked:text-white peer-checked:bg-indigo-500 border border-purple-500"
            >
              <div className="flex flex-col justify-around p-2 gap-3">
                <div className="w-24 h-24 xl:w-48 xl:h-48 mx-auto rounded-full overflow-hidden flex flex-col justify-center bg-indigo-500">
                  <img
                    src={filter[0]}
                    alt={filter[2]}
                    className="w-full mx-auto my-auto"
                  />
                </div>
                <span className="xl:text-2xl p-2 rounded-full border border-indigo-500">
                  {filter[2]}
                </span>
              </div>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Filter;
