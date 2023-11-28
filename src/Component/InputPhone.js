import React, { useState } from "react";

function InputPhone(props) {
  const [pAlert, setPAlert] = useState(false);
  return (
    <div id="InputPhone">
      <div className="p-2 bg-gray-200 font-medium">
        <h2>
          <label htmlFor="phone" className={props.Job ? "text-lg" : null}>
            연락처를 알려주세요
            {pAlert && (
              <span className="text-indigo-500 text-sm mb-5 lg:ml-1 font-normal">
                연락처는 숫자만 입력해 주세요
              </span>
            )}
          </label>
        </h2>
      </div>
      <div className="p-2 pb-3 bg-gray-100">
        <input
          type="text"
          id="phone"
          name="phone"
          className="block mb-2 text-lg font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
          placeholder={
            props.Job
              ? "담당자 연락처를 - 없이 숫자만 입력하세요"
              : "여기를 눌러서 직접 입력해 주세요"
          }
          onKeyDown={event => {
            if (!/[0-9]/.test(event.key)) {
              if (
                event.key === "Delete" ||
                event.key === "Backspace" ||
                event.key === "Tab"
              ) {
                setPAlert(false);
              } else {
                event.preventDefault();
                setPAlert(true);
              }
            } else {
              setPAlert(false);
            }
          }}
          value={props.phone}
          onChange={e => props.setPhone(e.currentTarget.value)}
          onBlur={e => {
            props.setPhone(e.currentTarget.value);
            setPAlert(false);
          }}
        />
      </div>
    </div>
  );
}

export default InputPhone;
