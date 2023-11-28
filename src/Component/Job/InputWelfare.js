import React, { useState, useEffect } from "react";
import { welfares } from "./Data";

function InputWelfare(props) {
  const [checkedInputs, setCheckedInputs] = useState([]);

  useEffect(() => {
    setCheckedInputs(props.welfare);
    //eslint-disable-next-line
  }, []);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
    props.setWelfare(checkedInputs);
  };
  /*
  const checkedHandler = (e, s) => {
    let ansarr = props.welfare;
    let isChecked = e.currentTarget.checked;
    let chkValue = e.currentTarget.value;
    let chkarr = {};
    let chkIndex = ansarr.findIndex(ans => ans.id === s);
    if (chkIndex !== -1) {
      chkarr = ansarr[chkIndex];
    } else {
      chkarr = { id: s, selected: [] };
    }
    if (isChecked) {
      chkarr.selected.push(chkValue);
      if (chkIndex === -1) {
        ansarr.push(chkarr);
      } else {
        ansarr[chkIndex] = chkarr;
      }
    } else {
      chkarr.selected = chkarr.selected.filter(chk => chk !== chkValue);
      ansarr[chkIndex] = chkarr;
      if (chkarr.selected.length === 0) {
        ansarr = ansarr.filter(ans => ans.id !== s);
      }
    }
    props.setWelfare(ansarr);
    console.log(props.welfare);
  };
  */
  return (
    <>
      {welfares.map((wel, idx) => (
        <div className="border rounded bg-white p-1" key={idx}>
          <input
            type="checkbox"
            value={wel[0]}
            id={"wel" + idx}
            name={wel[0]}
            className="peer hidden"
            onChange={e => {
              changeHandler(e.currentTarget.checked, wel[0]);
            }}
            checked={checkedInputs.includes(wel[0]) ? true : false}
          />
          <label
            htmlFor={"wel" + idx}
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg  text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            {wel[0]}
          </label>
        </div>
      ))}
    </>
  );
}

export default InputWelfare;
