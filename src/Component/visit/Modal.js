import React from "react";

import dompurify from "dompurify";

const Modal = ({ isOpen, onClose, toPrint }) => {
  const sanitizer = dompurify.sanitize;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="bg-white p-8 max-w-full max-h-full overflow-auto mt-4">
      <div className="print-content-container">
        <div className="print-content">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <td
                  colSpan="2"
                  className="bg-black text-white text-center text-lg p-2 border border-black"
                >
                  고객사 방문 미팅 제안
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="text-right p-2 border border-black">
                  {toPrint.date}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="text-left p-2 border border-black">
                  고객사명 : {toPrint.cName}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="text-left p-2 border border-black">
                  방문자명 : {toPrint.manager}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="bg-gray-100 p-2 border border-black align-middle font-medium">
                  면접현황
                </th>
                <td className="p-2 border border-black align-middle font-normal">
                  {toPrint.isNew ? (
                    "신규지점으로 해당사항 없음"
                  ) : (
                    <img
                      src={toPrint.applyImg}
                      alt={`${toPrint.cName}의 면접현황표`}
                    />
                  )}
                </td>
              </tr>
              <tr>
                <th className="bg-gray-100 p-2 border border-black align-middle font-medium">
                  기본정보
                </th>
                <td className="p-2 border border-black align-middle font-normal">
                  {toPrint.infoA !== "" ? (
                    <div
                      className="p-2 font-normal"
                      dangerouslySetInnerHTML={{
                        __html: sanitizer(toPrint.infoA),
                      }}
                    />
                  ) : (
                    "미입력"
                  )}
                </td>
              </tr>
              <tr>
                <th className="bg-gray-100 p-2 border border-black align-middle font-medium">
                  참고사항
                </th>
                <td className="p-2 border border-black align-middle font-normal">
                  {toPrint.adInfo !== "" ? (
                    <div
                      className="p-2 font-normal"
                      dangerouslySetInnerHTML={{
                        __html: sanitizer(toPrint.adInfo),
                      }}
                    />
                  ) : (
                    "미입력"
                  )}
                </td>
              </tr>
              <tr>
                <th className="bg-gray-100 p-2 border border-black align-middle font-medium">
                  제안내용
                </th>
                <td className="p-2 border border-black align-middle font-normal">
                  {toPrint.propose !== "" ? (
                    <div
                      className="p-2 font-normal"
                      dangerouslySetInnerHTML={{
                        __html: sanitizer(toPrint.propose),
                      }}
                    />
                  ) : (
                    "미입력"
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {toPrint.adImgA !== "" && (
          <div className="print-content print-image">
            <h2 className="bg-gray-100 text-black text-lg py-2 w-full font-medium">
              참고시안 1
            </h2>
            {toPrint.adImgA !== "" ? (
              <img src={toPrint.adImgA} alt="광고이미지1" />
            ) : null}
            {toPrint.adImgB !== "" ? (
              <img src={toPrint.adImgB} alt="광고이미지2" />
            ) : null}
            {toPrint.adImgC !== "" ? (
              <img src={toPrint.adImgC} alt="광고이미지3" />
            ) : null}
          </div>
        )}
        {toPrint.existImgA !== "" && (
          <div className="print-content print-image page-3">
            <h2 className="bg-gray-100 text-black text-lg py-2 w-full font-medium">
              참고시안 2
            </h2>
            {toPrint.existImgA !== "" ? (
              <img src={toPrint.existImgA} alt="기존광고1" />
            ) : null}
            {toPrint.existImgB !== "" ? (
              <img src={toPrint.existImgB} alt="기존광고2" />
            ) : null}
            {toPrint.existImgC !== "" ? (
              <img src={toPrint.existImgC} alt="기존광고3" />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
