import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BeforeVisit() {
  let navi = useNavigate();

  const [id, setId] = useState("");
  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    p-3 bg-white rounded-lg min-w-1 min-h-1 drop-shadow-lg w-11/12 lg:w-2/6"
    >
      <h2 className="text-lg mb-3">미팅자료열람</h2>
      <form>
        <div className="mb-3">
          <label
            htmlFor="id"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            고유번호를 입력해주세요
          </label>
          <input
            type="text"
            id="id"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={id}
            onChange={e => setId(e.currentTarget.value)}
            onBlur={e => setId(e.currentTarget.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="mr-2 text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
          onClick={e => {
            e.preventDefault();
            if (id === "") {
              return alert("고유번호를 입력하세요");
            } else {
              navi(`/visit/${id}`);
            }
          }}
        >
          일반 자료
        </button>
      </form>
    </div>
  );
}

export default BeforeVisit;
