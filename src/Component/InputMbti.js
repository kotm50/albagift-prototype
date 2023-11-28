import React, { useState } from "react";
import MbtiModal from "./MbtiModal";

function InputMbti(props) {
  const [mbtiChk, setMbtiChk] = useState(false);
  const mbtiHandler = e => {
    props.setMbti(e);
  };
  return (
    <div className="mb-5">
      <div className="p-2 bg-gray-200 font-medium">
        <h2>MBTI를 골라주세요</h2>
      </div>
      <div className="p-2 bg-gray-100 grid grid-cols-4 gap-2">
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ISTJ"
            id="ISTJ"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ISTJ"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ISTJ
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ISFJ"
            id="ISFJ"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ISFJ"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ISFJ
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="INFJ"
            id="INFJ"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="INFJ"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            INFJ
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="INTJ"
            id="INTJ"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="INTJ"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            INTJ
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ISTP"
            id="ISTP"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ISTP"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ISTP
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ISFP"
            id="ISFP"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ISFP"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ISFP
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="INFP"
            id="INFP"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="INFP"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            INFP
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="INTP"
            id="INTP"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="INTP"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            INTP
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ESTP"
            id="ESTP"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ESTP"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ESTP
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ESFP"
            id="ESFP"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ESFP"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ESFP
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ENFP"
            id="ENFP"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ENFP"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ENFP
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ENTP"
            id="ENTP"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ENTP"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ENTP
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ESTJ"
            id="ESTJ"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ESTJ"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ESTJ
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ESFJ"
            id="ESFJ"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ESFJ"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ESFJ
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ENFJ"
            id="ENFJ"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ENFJ"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ENFJ
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 shadow">
          <input
            type="radio"
            value="ENTJ"
            id="ENTJ"
            name="mbti"
            className="peer hidden"
            onClick={e => mbtiHandler(e.currentTarget.value)}
          />
          <label
            htmlFor="ENTJ"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            ENTJ
          </label>
        </div>
        <div className="bg-white p-1 md:p-2 col-span-4 shadow">
          <input
            type="radio"
            value="잘 모르겠어요"
            id="etc"
            name="mbti"
            className="peer hidden"
            onClick={e => {
              mbtiHandler(e.currentTarget.value);
              setMbtiChk(true);
            }}
          />
          <label
            htmlFor="etc"
            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
          >
            잘 모르겠어요
          </label>
        </div>
      </div>
      {mbtiChk && (
        <div className="p-2 bg-gray-100">
          <div className="bg-green-700 text-white text-center p-2 w-full lg:text-xl leading-6">
            1분도 안걸리는
            <br className="lg:hidden" />
            <strong className="lg:ml-2">초간단 MBTI검사</strong>
            를 해보시겠어요?
            <br />
            <br />
            <small className="block leading-4">
              MBTI검사를 최대한 간소화 시킨 만큼 빠르게 확인할 수 있으나
              정확도가 다소 떨어집니다.
            </small>
            <div className="text-center w-5/6 mx-auto mt-6 mb-3">
              <MbtiModal />
            </div>
          </div>
          <small className="block text-center pb-5">
            (원하지 않으시면 아래 설문을 계속 진행하시면 됩니다.)
          </small>
        </div>
      )}
    </div>
  );
}

export default InputMbti;
