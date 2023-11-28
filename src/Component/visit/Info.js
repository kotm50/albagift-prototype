import React from "react";
import careservice from "../../Asset/careservice.png";
import caresample from "../../Asset/caresample.png";
import carechat from "../../Asset/carechat.png";
import profilesample from "../../Asset/profilesample.png";

import dompurify from "dompurify";

function Info(props) {
  const sanitizer = dompurify.sanitize;
  return (
    <div>
      {!props.admin ? (
        <div className="w-full lg:container lg:mx-auto mb-3 bg-white p-3 rounded drop-shadow-lg">
          <h2 className="text-2xl text-center bg-black text-white p-2">
            프리미엄 케어서비스 안내
          </h2>
          <div className="h-full border border-collapse border-gray-300 drop-shadow-md">
            <img
              src={careservice}
              alt="프리미엄 케어서비스"
              className="w-full"
            />
          </div>
          <h2 className="text-2xl text-center bg-black text-white p-2">
            면접관 프로필 샘플
          </h2>
          <div className="h-full border border-collapse border-gray-300 drop-shadow-md">
            <img src={profilesample} alt="면접질의서 샘플" className="w-full" />
          </div>
          <h2 className="text-2xl text-center bg-black text-white p-2">
            면접질의서 샘플
          </h2>
          <div className="h-full border border-collapse border-gray-300 drop-shadow-md">
            <img src={caresample} alt="면접질의서 샘플" className="w-full" />
          </div>
          <div className="h-full border border-collapse border-gray-300 drop-shadow-md mt-2">
            <img
              src={carechat}
              alt="면접질의서 공유 예시"
              className="max-w-full w-auto mx-auto"
            />
          </div>
        </div>
      ) : (
        <div className="w-full lg:container lg:mx-auto mb-3 bg-white p-3 rounded drop-shadow-lg">
          <h2 className="text-2xl text-center bg-black text-white p-2">
            고객사 방문 미팅 제안
          </h2>
          <div className="h-full border border-collapse border-gray-300 drop-shadow-md">
            <div className="flex">
              <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 break-keep">
                고객사명
              </div>
              <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
                {props.visit.cName}
              </div>
            </div>
            <div className="flex">
              <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 break-keep">
                방문자명
              </div>
              <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
                {props.visit.manager}
              </div>
            </div>

            {props.visit.applyImg !== "" ? (
              <div className="flex">
                <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 break-keep">
                  면접현황
                </div>
                <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
                  <img
                    src={props.visit.applyImg}
                    alt="면접현황"
                    className="max-h-96"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}
            <div className="flex">
              <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 break-keep">
                기본정보
              </div>
              <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
                <div
                  className="p-2 font-normal"
                  dangerouslySetInnerHTML={{
                    __html: sanitizer(props.visit.infoA),
                  }}
                />
              </div>
            </div>
            <div className="flex">
              <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 break-keep">
                참고사항
              </div>
              <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
                <div
                  className="p-2 font-normal"
                  dangerouslySetInnerHTML={{
                    __html: sanitizer(props.visit.adInfo),
                  }}
                />
              </div>
            </div>
            <div className="flex">
              <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 break-keep">
                제안내용
              </div>
              <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
                <div
                  className="p-2 font-normal"
                  dangerouslySetInnerHTML={{
                    __html: sanitizer(props.visit.propose),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Info;
