import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

function ListItem(props) {
  dayjs.locale("ko");
  const created = dayjs(props.s.created.toDate()).format("YY/MM/DD");
  let updated;
  if (props.s.updated !== undefined) {
    updated = dayjs(props.s.updated.toDate()).format("YY/MM/DD");
  }

  const copyToClipboard = url => {
    navigator.clipboard.writeText(url).then(
      () => alert("복사되었습니다, 원하는 채팅창에 붙여넣기 하세요"),
      err => console.error("Error copying to clipboard", err)
    );
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg p-2 text-center bg-indigo-500 text-white">
        <strong>
          {props.s.company || ""} {props.s.name || ""}
        </strong>
        {props.s.company ? "님의 동의서" : "완료되지 않은 동의서"}
      </div>
      <div className="text-base">
        <strong className="text-red-500 font-medium">번호</strong> :{" "}
        {props.s.alias}
      </div>
      <div className="text-base">
        <strong className="text-red-500 font-medium">동의자</strong> :{" "}
        {props.s.name || "미동의"}
      </div>
      <div className="text-base">
        <strong className="text-red-500 font-medium">생성일</strong> : {created}
      </div>
      <div className="text-base">
        <strong className="text-red-500 font-medium">동의일</strong> :{" "}
        {updated || "미동의"}
      </div>
      <div className="text-base">
        <strong className="text-red-500 font-medium">상태</strong> :{" "}
        {props.s.signed ? "동의완료" : "미완료"}
      </div>
      <div className="text-base">
        {props.s.signed ? (
          <a
            href={`agreeresult/${props.s.id}`}
            className="p-2 block bg-teal-500 hover:bg-teal-700 text-white text-center w-full"
          >
            동의서 확인
          </a>
        ) : (
          <span className="text-stone-900 py-2 block">
            아래 버튼으로 동의서를 전달하세요
          </span>
        )}
      </div>
      <div className="text-base">
        <button
          onClick={e =>
            copyToClipboard(`https://ikoreatm.com/adagree/${props.s.id}`)
          }
          className="p-2 block bg-pink-500 hover:bg-pink-700 text-white text-center w-full"
        >
          동의서 작성 링크 생성
        </button>
      </div>
    </div>
  );
}

export default ListItem;
