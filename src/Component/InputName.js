import React from "react";

function InputName(props) {
  return (
    <div id="inputName">
      <div className="p-2 bg-gray-200 font-medium">
        <h2>
          <label htmlFor="name">이름을 알려주세요</label>
        </h2>
      </div>
      <div className="p-2 pb-3 bg-gray-100">
        <input
          type="text"
          id="name"
          name="name"
          className="block mb-2 text-lg font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
          placeholder="여기를 눌러서 직접 입력해 주세요"
          value={props.name}
          onChange={e => props.setName(e.currentTarget.value)}
          onBlur={e => props.setName(e.currentTarget.value)}
        />
      </div>
    </div>
  );
}

export default InputName;
