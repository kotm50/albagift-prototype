import React, { useState } from "react";
import dompurify from "dompurify";

function ReportDetail(props) {
  const sanitizer = dompurify.sanitize;
  const [detailOn, setDetailOn] = useState(false);
  return (
    <>
      <div
        className="p-2 bg-gray-50 w-full hover:bg-indigo-100 grid grid-cols-5 divide-x hover:cursor-pointer"
        onClick={e => setDetailOn(!detailOn)}
      >
        <p className="text-left">제보자 : {props.report.name}</p>
        <p className="giftcategory text-center col-span-3">
          {props.report.goodsName}에 대한 제보
        </p>
        <p className="text-right">
          제보일시 : {props.report.created.toDate().toLocaleDateString()}
        </p>
      </div>
      {detailOn && (
        <div className="bg-gray-100 p-2 w-full grid grid-cols-1">
          <div>
            제보한 상품 : {props.report.goodsName}{" "}
            <a
              href={`/giftdetail/${props.report.goodsCode}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-500 hover:text-blue-700 border-b"
            >
              여길 눌러 상품 상세 확인
            </a>
          </div>
          <div
            className="w-full"
            dangerouslySetInnerHTML={{
              __html: sanitizer(props.report.report),
            }}
          />
        </div>
      )}
    </>
  );
}

export default ReportDetail;
