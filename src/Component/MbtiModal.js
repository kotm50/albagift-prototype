import React, { useState } from "react";

export default function MbtiModal() {
  const [showModal, setShowModal] = useState(false);
  const [mbtiResult, setMbtiResult] = useState("");
  const [step, setStep] = useState(0);
  const [ie, setIe] = useState("");
  const [sn, setSn] = useState("");
  const [tf, setTf] = useState("");
  const [pj, setPj] = useState("");
  return (
    <>
      <button
        className="rounded block w-48 mx-auto font-medium px-5 py-2 text-center text-lg text-green-500 bg-white hover:bg-yellow-100"
        type="button"
        onClick={() => setShowModal(true)}
      >
        간단 MBTI검사 시작
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-30">
            <div className="relative w-5/6 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-2xl text-black font-medium">
                    간단 MBTI 검사
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {step === 0 && (
                    <>
                      <div className="p-2 bg-gray-200 text-black lg:text-2xl">
                        놀 때는 🏡집 안이 좋나요? ⛱️집 밖이 좋나요?
                      </div>
                      <div className="grid grid-cols-2 gap-1 bg-gray-100 p-2">
                        <button
                          className="block w-full bg-green-700 hover:bg-green-900 text-white p-5 rounded-lg text-lg lg:text-3xl"
                          onClick={() => {
                            setIe("I");
                            setStep(1);
                          }}
                        >
                          집 안
                        </button>
                        <button
                          className="block w-full bg-green-700 hover:bg-green-900 text-white p-5 rounded-lg text-lg lg:text-3xl"
                          onClick={() => {
                            setIe("E");
                            setStep(1);
                          }}
                        >
                          집 밖
                        </button>
                      </div>
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <div className="p-2 bg-gray-200 text-black lg:text-2xl">
                        🚎현재 🚀미래 무엇이 중요한가요?
                      </div>
                      <div className="grid grid-cols-2 gap-1 bg-gray-100 p-2">
                        <button
                          className="block w-full bg-green-700 hover:bg-green-900 text-white p-5 rounded-lg text-lg lg:text-3xl"
                          onClick={() => {
                            setSn("N");
                            setStep(2);
                          }}
                        >
                          현재
                        </button>
                        <button
                          className="block w-full bg-green-700 hover:bg-green-900 text-white p-5 rounded-lg text-lg lg:text-3xl"
                          onClick={() => {
                            setSn("S");
                            setStep(2);
                          }}
                        >
                          미래
                        </button>
                      </div>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <div className="p-2 bg-gray-200 text-black lg:text-2xl">
                        😫친구가 안좋은 일이 있는 것 같습니다
                      </div>
                      <div className="grid grid-cols-2 gap-1 bg-gray-100 p-2">
                        <button
                          className="block w-full bg-green-700 hover:bg-green-900 text-white p-5 rounded-lg text-sm lg:text-lg"
                          onClick={() => {
                            setTf("F");
                            setStep(3);
                          }}
                        >
                          친구의 슬픔을 함께 나눈다
                        </button>
                        <button
                          className="block w-full bg-green-700 hover:bg-green-900 text-white  p-5 rounded-lg text-sm lg:text-lg"
                          onClick={() => {
                            setTf("T");
                            setStep(3);
                          }}
                        >
                          구체적인 해결방안을 제시한다
                        </button>
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <div className="p-2 bg-gray-200 text-black lg:text-2xl">
                        어떤 🛬여행을 좋아하시나요?
                      </div>
                      <div className="grid grid-cols-2 gap-1 bg-gray-100 p-2">
                        <button
                          className="block w-full bg-green-700 hover:bg-green-900 text-white p-5 rounded-lg text-sm lg:text-lg"
                          onClick={() => {
                            setPj("J");
                            setStep(4);
                          }}
                        >
                          계획대로 진행되는 여행
                        </button>
                        <button
                          className="block w-full bg-green-700 hover:bg-green-900 text-white  p-5 rounded-lg text-sm lg:text-lg"
                          onClick={() => {
                            setPj("P");
                            setStep(4);
                          }}
                        >
                          즉흥적으로 진행되는 여행
                        </button>
                      </div>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <div className="p-2 text-sm bg-gray-100 text-black text-center">
                        당신의 MBTI는{" "}
                        <strong className="text-base lg:text-lg">
                          {ie}
                          {sn}
                          {tf}
                          {pj}
                        </strong>{" "}
                        입니다
                        <br />
                        창을 닫고 MBTI를 선택해 주세요.
                      </div>
                    </>
                  )}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <p className="text-gray-700 text-sm"></p>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      if (step < 4) {
                        let cancel = window.confirm(
                          "검사가 완료되지 않았습니다. 정말 닫으시겠어요?"
                        );
                        if (cancel) {
                          setMbtiResult("");
                          setShowModal(false);
                        } else {
                          return alert("검사를 계속 진행해 주세요");
                        }
                      } else {
                        setMbtiResult(ie + sn + tf + pj);
                        setStep(0);
                        setShowModal(false);
                      }
                    }}
                  >
                    창 닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {mbtiResult !== "" && (
        <div className="text-white text-center mt-3">
          지원자님의 MBTI는{" "}
          <strong className="text-yellow-300">{mbtiResult}</strong> 입니다
        </div>
      )}
    </>
  );
}
