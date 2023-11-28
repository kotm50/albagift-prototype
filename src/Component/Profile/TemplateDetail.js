import React, { useState, useEffect } from "react";

import TemplateModal from "./TemplateModal";

function TemplateDetail(props) {
  const [templateModal, setTemplateModal] = useState(false);

  useEffect(() => {
    if (templateModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // eslint-disable-next-line
  }, [templateModal]);

  return (
    <>
      <div className="border rounded">
        <input
          type="checkbox"
          value={props.template[2]}
          id={"temp" + props.idx}
          name={props.template[2]}
          className="peer hidden"
          onChange={e => {
            props.changeHandler(e.currentTarget.checked, props.template[2]);
          }}
          checked={
            props.checkedInputs.includes(props.template[2]) ? true : false
          }
        />
        <label
          htmlFor={"temp" + props.idx}
          className="block trtemplateition duration-150 p-2 text-sm text-center ease-in-out rounded lg:text-base xl:text-lg bg-purple-100 text-stone-900  peer-checked:text-white peer-checked:bg-indigo-500 border border-purple-500"
        >
          <div className="flex flex-col justify-around gap-3">
            <div className="w-24 h-24 xl:w-48 xl:h-48 mx-auto overflow-hidden flex flex-col justify-center bg-indigo-500">
              <img
                src={props.template[0]}
                alt={props.template[2]}
                className="w-full mx-auto my-auto"
              />
            </div>
            <span className="xl:text-2xl p-2 rounded-full border border-indigo-500">
              {props.template[2]}
              {props.template[2] === "템플릿 5" && (
                <span className="text-center text-lg text-red-500">
                  {" "}
                  (필터 적용시에만 사용 가능)
                </span>
              )}
            </span>
          </div>
          <button
            className="p-2 mx-auto text-center w-full bg-teal-500 text-white rounded-lg mt-3"
            onClick={e => setTemplateModal(true)}
          >
            원본 보기
          </button>
        </label>
      </div>

      {templateModal ? (
        <TemplateModal
          setTemplateModal={setTemplateModal}
          template={props.template}
        />
      ) : null}
    </>
  );
}

export default TemplateDetail;
