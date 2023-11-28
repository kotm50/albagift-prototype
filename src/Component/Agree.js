import React from "react";

function Agree(props) {
  const agreeHandler = e => {
    if (e) {
      props.setAgree(true);
    } else {
      props.setAgree(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold p-2 bg-gray-200 mb-0">
        개인정보 이용동의
      </h2>
      <div className="h-40 p-2 overflow-y-hidden">
        <div className="bg-white p-2 mb-2 h-full overflow-y-auto">
          <h5 className="font-bold text-lg mb-2">수집하는 개인정보의 항목</h5>
          <p className="w-full">
            회사는 채용 면접 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.{" "}
            <br />- 수집항목 :{" "}
            {props.survey.map((sur, idx) => (
              <span key={idx}>
                {sur.question}
                {props.survey.length - 1 > idx && ", "}
              </span>
            ))}
            <br /> - 개인정보 수집방법 : 홈페이지(설문조사)
          </p>
          <h5 className="font-bold text-lg mb-2">
            개인정보의 수집 및 이용목적
          </h5>
          <p className="w-full">
            회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
            <br />
            - 회사는 채용면접을 목적으로 귀하의 동의가 있는 경우, 상기
            기재해주신 항목을 수집하여 면접 시까지 활용하게 됩니다. <br />
            귀하는 개인정보 수집이용에 대한 동의를 거부할 수 있으며, 동의를
            거부한 경우에는 귀하에게 그와 관련된 정보나 혜택은 제공드리지 않게
            됩니다.
          </p>
          <h5 className="font-bold text-lg mb-2">
            개인정보의 보유 및 이용기간
          </h5>
          <p className="w-full">
            회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당
            정보를 지체 없이 파기합니다.
          </p>
        </div>
      </div>
      <div className="p-2 bg-gray-100 mb-5">
        <div className="bg-white p-0 shadow w-full rounded">
          <input
            type="checkbox"
            value="agree"
            id="agree"
            name="agreeChk"
            className="peer hidden"
            onClick={e => agreeHandler(e.currentTarget.checked)}
          />
          <label
            htmlFor="agree"
            className="transition duration-150 md:p-2 text-sm py-4 text-center ease-in-out rounded lg:text-base xl:text-lg font-bold bg-white text-stone-900  peer-checked:text-white peer-checked:bg-teal-500 flex flex-row justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                clipRule="evenodd"
              />
            </svg>
            <p className="ml-2 noDrag text-sm md:text-base">
              개인정보 수집 및 이용에 동의합니다
            </p>
          </label>
        </div>
        <div className="mt-2 p-0 text-center">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full shadow"
            onClick={e => props.surveyStart()}
          >
            설문 시작하기
          </button>
        </div>
      </div>
    </>
  );
}

export default Agree;
