import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

function SubscribeGenerator() {
  const [alias, setAlias] = useState("");
  const [url, setUrl] = useState("");

  const subGen = () => {
    if (isNaN(alias) || alias.length !== 4) {
      return alert("고유번호가 잘못되었습니다 확인 후 다시 입력해 주세요");
    }
    setUrl(`https://ikoreatm.com/subscribe/${alias}`);
  };

  const handleCopy = () => {
    alert(
      `지점고유번호:${alias}\nurl이 복사되었습니다. 필요한 곳에 붙여넣기 해주세요`
    );
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    p-3 bg-white rounded-lg min-w-1 min-h-1 drop-shadow-lg w-11/12 lg:w-2/6"
    >
      <h2 className="text-lg mb-3">KoTI 프로필 신청서 생성</h2>

      <div className="mb-3">
        <label
          htmlFor="alias"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          지점 고유번호(4자리 숫자)를 입력하세요
        </label>
        <input
          type="text"
          id="alias"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              subGen();
            }
          }}
          value={alias}
          onChange={e => setAlias(e.currentTarget.value)}
          onBlur={e => setAlias(e.currentTarget.value)}
          disabled={url !== ""}
        />
      </div>
      {url === "" ? (
        <div className="mb-3">
          <button
            type="button"
            className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
            onClick={e => {
              e.preventDefault();
              subGen();
            }}
          >
            신청서 url 생성
          </button>
        </div>
      ) : null}
      {url !== "" ? (
        <>
          <div className="mb-3">
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              아래는 신청서 url 입니다
            </span>
            <input
              type="text"
              id="url"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  subGen();
                }
              }}
              value={url}
              disabled
            />
          </div>
          <div className="mb-3 flex flex-row flex-nowrap justify-start gap-3">
            <CopyToClipboard text={url} onCopy={handleCopy}>
              <button className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">
                URL 복사하기
              </button>
            </CopyToClipboard>
            <button
              className="text-white bg-gray-400 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-400 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
              onClick={e => {
                e.preventDefault();
                setUrl("");
              }}
            >
              고유번호 재입력
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default SubscribeGenerator;
