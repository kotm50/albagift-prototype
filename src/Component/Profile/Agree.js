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
      <div className="h-40 overflow-y-hidden  bg-purple-100">
        <div className="p-4 mb-2 h-full overflow-y-auto">
          <h5 className="font-bold text-lg mb-2">수집하는 개인정보의 항목</h5>
          <p className="w-full mb-3">
            회사는 채용 면접 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.{" "}
            <br />- 수집항목 : 사진, 지점명, 이름, 직책, 연락처, 경력/수상내역
            <br />- 개인정보 수집방법 : 홈페이지(설문조사)
          </p>
          <h5 className="font-bold text-lg mb-2">
            개인정보의 수집 및 이용목적
          </h5>
          <p className="w-full mb-3">
            회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
            <br />
            - 회사는 KoTI 프로필 제작을 위하여 귀하의 동의가 있는 경우, 상기
            기재해주신 항목을 수집하여 제작 완료 시까지 활용하게 됩니다. <br />
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
      <div className="my-5">
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
            className="transition duration-150 xl:p-3 text-sm py-3 text-center ease-in-out rounded-full lg:text-base xl:text-lg font-bold bg-gray-100 border border-purple-500 text-stone-900  peer-checked:text-white peer-checked:bg-teal-500 peer-checked:border-teal-500 flex flex-row justify-center"
          >
            <div className="flex flex-col justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={!props.agree ? "gray" : "white"}
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="ml-2 noDrag text-sm xl:text-base flex flex-col justify-center">
              개인정보 수집 및 이용에 동의합니다
            </p>
          </label>
        </div>
      </div>
    </>
  );
}

export default Agree;
