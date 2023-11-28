import React, { useState, useEffect } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useSearchParams } from "react-router-dom";

import dayjs from "dayjs";
import html2canvas from "html2canvas";

import Mbti from "./Mbti";

import user from "../Asset/user2.png";

// kakao 기능 동작을 위해 넣어준다.
const { Kakao } = window;

function Result() {
  // 재랜더링시에 실행되게 해준다.
  useEffect(() => {
    // init 해주기 전에 clean up 을 해준다.
    Kakao.cleanup();
    // 자신의 js 키를 넣어준다.
    Kakao.init("a8bc905c8e7be4c0eb20c28093fc388e");
  }, []);
  let navi = useNavigate();

  const [survey, setSurvey] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [no, setNo] = useState("");
  const [profile, setProfile] = useState([]);
  const [isCapture, setIsCapture] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imgIsLoading, setImgIsLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    setNum();
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `KoTI 설문지`;
    // eslint-disable-next-line
  }, []);

  const setNum = () => {
    const num = searchParams.get("no");
    const admin = searchParams.get("admin");
    setSearchParams(searchParams);
    if (admin === "no") {
      setIsAdmin(false);
    }
    if (no !== null) {
      setNo(Number(num));
      getResult(num);
    } else {
      navi("/error");
    }
  };

  const getResult = async num => {
    const resultRef = collection(db, "survey");
    let result = await getDoc(doc(resultRef, `${num}`));
    if (result.data() !== undefined) {
      let prof = result.data().profile;
      let pw = result.data().pw;
      setProfile(prof);
      let answers = result.data().answers;
      let surveyArr = [];
      if (pw === "basic") {
        const basicRef = collection(db, "basic");
        for await (const answer of answers) {
          const res = await getDoc(doc(basicRef, `${answer.question}`));
          surveyArr.push({
            id: res.data().id,
            question: res.data().question,
            answer: answer.answer,
          });
        }
      } else {
        const sampleRef = collection(db, "sample");
        for await (const answer of answers) {
          const res = await getDoc(doc(sampleRef, `${answer.question}`));
          surveyArr.push({
            id: res.data().id,
            question: res.data().question,
            answer: answer.answer,
          });
        }
      }
      setSurvey(surveyArr);
      setIsLoading(true);
    } else {
      return alert("알 수 없는 오류");
    }
  };
  const onSaveToImg = async () => {
    window.scrollTo(0, 0);
    await setIsCapture(true);
    let now = dayjs();
    let capture = document.querySelector("#capture");
    let captureTime = now.format("YYYYMMDDHHmm");

    await html2canvas(capture, {
      allowTaint: true,
      useCORS: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      scale: window.devicePixelRatio, // CSS 스타일 적용을 위해 scale 옵션 추가
    }).then(async canvas => {
      await saveAs(
        canvas.toDataURL("image/png"),
        profile.name + "_" + captureTime + ".png"
      );
    });
    setIsCapture(false);
  };

  const saveAs = (uri, filename) => {
    var link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = uri;
      link.download = filename;
      //Firefox requires the link to be in the body
      document.body.appendChild(link);
      //simulate click
      link.click();
      //remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  };

  const handleImgError = e => {
    e.target.src = user;
  };

  const shareKakao = () => {
    let photoImg;
    if (profile.photo === "noPhoto" || profile.photo === "") {
      photoImg = "https://ikoreatm.com/nophoto.png";
    } else {
      photoImg = profile.photo;
    }
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: profile.name + " 님의 KoTI 프로필 입니다",
        description: "KoTI 프로필",
        imageUrl: photoImg,
        link: {
          mobileWebUrl: `https://ikoreatm.com/result?no=${no}&admin=no`,
          webUrl: `https://ikoreatm.com/result?no=${no}&admin=no`,
        },
      },
      buttons: [
        {
          title: "KoTI",
          link: {
            mobileWebUrl: `https://ikoreatm.com/result?no=${no}&admin=no`,
            webUrl: `https://ikoreatm.com/result?no=${no}&admin=no`,
          },
        },
      ],
    });
  };

  return (
    <>
      <div
        onContextMenu={e => {
          if (!isAdmin) {
            e.preventDefault();
            alert("복사 및 유출 방지를 위해 우클릭을 금지하였습니다.");
          }
        }}
      >
        {!isLoading ? (
          <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-white bg-opacity-80 z-50">
            <div className="text-center mt-96">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={
                !imgIsLoading
                  ? "fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-white bg-opacity-80 z-50"
                  : "hidden opacity-0 w-0 h-0"
              }
            >
              <div className="text-center mt-96">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {isAdmin ? (
              <div className="fixed top-0 left-0 right-0 p-2 bg-white drop-shadow-lg mb-3 text-center z-40">
                <div className="container mx-auto  flex justify-center gap-5">
                  <button
                    className="bg-teal-500 hover:bg-teal-700 py-3 px-10 font-medium m-auto text-white rounded-full"
                    onClick={onSaveToImg}
                  >
                    이미지로 저장
                  </button>

                  <button
                    className="bg-yellow-200 hover:bg-yellow-500 py-3 px-10 font-medium m-auto rounded-full"
                    onClick={e => {
                      shareKakao();
                    }}
                  >
                    카카오톡 공유하기
                  </button>

                  <button
                    className="bg-blue-500 hover:bg-blue-700 py-3 px-10 font-medium m-auto text-white rounded-full"
                    onClick={e => navi("/surveylist")}
                  >
                    설문지 리스트로
                  </button>
                </div>
              </div>
            ) : null}
            <div
              className={`flex flex-col container mx-auto  ${
                isAdmin ? "mt-20" : "mt-2 noDrag"
              }`}
            >
              <div
                className="w-11/12 md:w-4/5 mx-auto p-2 rounded mb-3 max-w-2xl bg-teal-500 drop-shadow"
                id="capture"
              >
                <div className="bg-white text-lg box-border border-2 drop-shadow p-1">
                  <ul className="flex flex-col border border-gray-100">
                    <li>
                      <div
                        className={
                          !isCapture
                            ? "px-2 py-3 bg-gray-200 font-medium"
                            : "captureIt px-2 pb-5 bg-gray-200 font-medium"
                        }
                      >
                        지원자명
                      </div>
                      <div
                        className={
                          !isCapture
                            ? "px-2 py-3 bg-gray-100"
                            : "captureIt px-2 pb-5 bg-gray-100"
                        }
                      >
                        {profile.name}
                      </div>
                    </li>
                    {profile.gender && profile.gender !== "" && (
                      <li>
                        <div
                          className={
                            !isCapture
                              ? "px-2 py-3 bg-gray-200 font-medium"
                              : "captureIt px-2 pb-5 bg-gray-200 font-medium"
                          }
                        >
                          성별
                        </div>
                        <div
                          className={
                            !isCapture
                              ? "px-2 py-3 bg-gray-100"
                              : "captureIt px-2 pb-5 bg-gray-100"
                          }
                        >
                          {profile.gender}
                        </div>
                      </li>
                    )}

                    <li>
                      <div
                        className={
                          !isCapture
                            ? "px-2 py-3 bg-gray-200 font-medium"
                            : "captureIt px-2 pb-5 bg-gray-200 font-medium"
                        }
                      >
                        {profile.name}님의 사진
                      </div>
                      <div
                        className={
                          !isCapture
                            ? "px-2 py-3 bg-gray-100"
                            : "captureIt px-2 pb-5 bg-gray-100"
                        }
                      >
                        {profile.photo === "noPhoto" || profile.photo === "" ? (
                          <img
                            src={user}
                            alt="사진이 없습니다"
                            className="max-h-96"
                            onLoad={e => setImgIsLoading(true)}
                          />
                        ) : (
                          <img
                            src={profile.photo}
                            alt="프로필사진"
                            className="max-h-96"
                            onLoad={e => setImgIsLoading(true)}
                            onError={e => handleImgError(e)}
                          />
                        )}
                      </div>
                    </li>
                    <li>
                      <div
                        className={
                          !isCapture
                            ? "px-2 py-3 bg-gray-200 font-medium"
                            : "captureIt px-2 pb-5 bg-gray-200 font-medium"
                        }
                      >
                        {profile.name}님의 MBTI
                      </div>
                      <div
                        className={
                          !isCapture
                            ? "px-2 py-3 bg-gray-100"
                            : "captureIt px-2 pb-5 bg-gray-100"
                        }
                      >
                        {profile.mbti !== "잘 모르겠어요" ? (
                          <Mbti mbti={profile.mbti} />
                        ) : (
                          profile.mbti
                        )}
                      </div>
                    </li>
                  </ul>
                  <ul
                    id="survey"
                    className="flex flex-col border border-gray-100"
                  >
                    {survey &&
                      survey.map((sur, idx) => (
                        <li id={sur.id} key={idx}>
                          <div
                            className={
                              !isCapture
                                ? "px-2 py-3 bg-gray-200 font-medium"
                                : "captureIt px-2 pb-5 bg-gray-200 font-medium"
                            }
                          >
                            {sur.question}
                          </div>
                          <div
                            className={
                              !isCapture
                                ? "px-2 py-3 bg-gray-100"
                                : "captureIt px-2 pb-5 bg-gray-100"
                            }
                          >
                            {sur.answer}
                          </div>
                        </li>
                      ))}
                  </ul>

                  <div id="warning" className="mt-3 text-center text-sm">
                    <div
                      className={
                        !isCapture
                          ? "px-2 py-3 bg-gray-100"
                          : "captureIt px-2 pb-5 bg-gray-100"
                      }
                    >
                      본 자료는{" "}
                      <span className="font-medium">
                        지원자의 소중한 개인정보가 담겨있습니다.
                      </span>{" "}
                      면접시에만 활용해 주세요.{" "}
                      <br className="hidden lg:block" />
                      개인정보를 임의로 보관할 경우 개인정보보호법에 따라
                      불이익을 받을 수 있습니다.{" "}
                      <br className="hidden lg:block" />본 자료양식은{" "}
                      <span className="font-medium text-red-500">
                        코리아티엠
                      </span>
                      의 고유재산이므로 수정 및 재배포를 금지합니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Result;
