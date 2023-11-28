import React, { useState, useEffect } from "react";

import TemplateDetail from "./TemplateDetail";

import template1 from "../../Asset/Profile/template1.png";
import template2 from "../../Asset/Profile/template2.png";
import template3 from "../../Asset/Profile/template3.png";
import template4 from "../../Asset/Profile/template4.png";
import template5 from "../../Asset/Profile/template5.png";
import template6 from "../../Asset/Profile/template6.png";

function Template(props) {
  const [checkedInputs, setCheckedInputs] = useState([]);

  useEffect(() => {
    props.setTemp(checkedInputs);
    //eslint-disable-next-line
  }, [checkedInputs]);

  const changeHandler = (checked, id) => {
    if (checked) {
      if (checkedInputs.length === 1) {
        return alert("최대 1개까지만 선택 가능합니다.");
      }
      setCheckedInputs([...checkedInputs, id]);
    } else {
      // 체크 해제
      setCheckedInputs(checkedInputs.filter(el => el !== id));
    }
  };

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
      {[
        [template1, "template1", "템플릿 1"],
        [template2, "template2", "템플릿 2"],
        [template3, "template3", "템플릿 3"],
        [template4, "template4", "템플릿 4"],
        [template5, "template5", "템플릿 5"],
        [template6, "template6", "템플릿 6"],
      ].map((template, idx) => (
        <div key={idx}>
          <TemplateDetail
            idx={idx}
            template={template}
            changeHandler={changeHandler}
            checkedInputs={checkedInputs}
            setCheckedInputs={setCheckedInputs}
          />
        </div>
      ))}
    </div>
  );
}

export default Template;
