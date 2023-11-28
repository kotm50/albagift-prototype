import React from "react";

function Guide(props) {
  return (
    <div className="bg-yellow-100 my-2 p-2 w-11/12 lg:container mx-auto relative rounded drop-shadow-lg">
      <h2 className="text-center text-2xl lg:py-2">
        이용방법{" "}
        <small className="block lg:inline text-sm">
          (시작 전 한번 읽어보시기를 추천합니다)
        </small>
      </h2>
      <div
        className="w-full rounded py-2 lg:hidden hover:cursor-pointer text-center p-1 bg-indigo-500 hover:bg-indigo-700 text-white mb-2"
        onClick={e => props.setGuide(!props.guide)}
      >
        {props.guide ? "▲ 접기" : "▼ 펼치기"}
      </div>
      <div
        className="hidden lg:block absolute right-3 top-3 hover:cursor-pointer p-2 bg-indigo-500 hover:bg-indigo-700 text-white rounded"
        onClick={e => props.setGuide(!props.guide)}
      >
        {props.guide ? "▲접기" : "▼펼치기"}
      </div>
      {props.guide && (
        <>
          <div className="bg-gray-200 p-2 font-bold lg:mt-2">KoTI 설문지란</div>
          <div className="bg-white p-2 mb-2">
            <strong className="font-bold text-indigo-500">Ko</strong>reatm{" "}
            <strong className="font-bold text-indigo-500">T</strong>ype{" "}
            <strong className="font-bold text-indigo-500">I</strong>ndicator의
            약자로, 코리아티엠 자체 성격유형 검사로서 해당 지원자에 대한
            프로파일링이 가능합니다. 100개 이상의 문항이 있으며 이 중에 원하는
            문항을 선택하여 나만의 KoTI설문지를 만들 수 있습니다.
            <br />
            아래에서 업체(지점)명, 담당자명, 연락처를 입력한 후 시작하실 수
            있습니다
          </div>
          <div className="my-2 bg-gray-200 p-2">
            아래 문항 목록에서 원하는 문항을 선택해주세요! 클릭하여 문항의
            배경색이 바뀌면 선택된 겁니다
          </div>
          <div className="flex justify-start gap-2 mb-2">
            <div className="bg-white border w-1/2 border-gray-200 p-2">
              선택하지 않은 문항
              <div className="flex flex-col lg:flex-row">
                <div className="border bg-teal-50 p-2 m-2 text-sm text-center lg:text-left text-black">
                  답변예시 1
                </div>
                <div className="border bg-teal-50 p-2 m-2 text-sm text-center lg:text-left text-black">
                  답변예시 2
                </div>
                <div className="border bg-teal-50 p-2 m-2 text-sm text-center lg:text-left text-black">
                  답변예시 3
                </div>
                <div className="border bg-teal-50 p-2 m-2 text-sm text-center lg:text-left text-black">
                  답변예시 4
                </div>
              </div>
            </div>
            <div className="bg-indigo-500 w-1/2 text-white border border-gray-200 p-2">
              선택한 문항
              <div className="border bg-teal-50 p-2 m-2 text-sm text-center lg:text-left text-black">
                주관식 답변
              </div>
            </div>
          </div>
          <div className="mb-2 bg-gray-200 p-2">
            문항 선택 완료 후{" "}
            <span className="px-2 m-2 rounded bg-indigo-500 text-white">
              저장하기
            </span>{" "}
            버튼을 누르면 KoTI 설문지 생성이 완료됩니다.
          </div>
        </>
      )}
    </div>
  );
}

export default Guide;
