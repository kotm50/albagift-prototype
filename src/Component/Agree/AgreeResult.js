import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

import Loading from "../Loading";
import html2canvas from "html2canvas";

function AgreeResult() {
  const user = useSelector(state => state.user);
  const { gid } = useParams();
  let navi = useNavigate();

  const [todayDate, setTodayDate] = useState("");

  const [name, setName] = useState("");
  const [comp, setComp] = useState("");

  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);
  const [agree4, setAgree4] = useState(false);

  const [sign, setSign] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [correct, setCorrect] = useState(false);

  const [nameChk, setNameChk] = useState("");
  const [compChk, setCompChk] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    chkAdmin(user);
    getAgree(gid);
    //eslint-disable-next-line
  }, []);

  const chkAdmin = user => {
    setTimeout(() => {
      if (!user.admin) {
        setIsAdmin(false);
      } else {
        setCorrect(true);
        setIsAdmin(true);
      }
    }, 1000);
  };

  const getAgree = async gid => {
    let result = await getDoc(doc(db, "adAgreeSign", gid));
    setName(result.data().name);
    setComp(result.data().company);
    setAgree1(result.data().agree1);
    setAgree2(result.data().agree2);
    setAgree3(result.data().agree3);
    setAgree4(result.data().agree4);
    setSign(result.data().sign);
    setTodayDate(result.data().date);
  };

  const chkSigned = () => {
    if (nameChk === name && compChk === comp) {
      alert(`안녕하세요 ${name}님, 인증 되셨습니다`);
      setCorrect(true);
    } else {
      return alert(
        "이름 또는 지점명이 잘못되었습니다.\n정확히 입력해도 나오지 않으면 관리자에게 문의해 주세요"
      );
    }
  };

  const saveAsImage = async () => {
    const element = document.getElementById("capture");

    // 이미지 로딩을 기다립니다.
    await new Promise(resolve => {
      const images = element.getElementsByTagName("img");
      let loadedCount = 0;

      const checkAllImagesLoaded = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          resolve();
        }
      };

      Array.from(images).forEach(image => {
        if (image.complete) {
          checkAllImagesLoaded();
        } else {
          image.addEventListener("load", checkAllImagesLoaded);
        }
      });
    });

    // 이미지를 포함하여 화면을 캡처합니다.
    const canvas = await html2canvas(element);

    // 이미지를 PNG로 저장합니다.
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${comp}_${name}동의서_${todayDate}.png`; // 저장할 이미지의 파일 이름을 지정합니다.
    link.click();
  };

  return (
    <>
      <img
        src={sign}
        alt=""
        className="w-0 h-0 opacity-0 fixed bottom-0 left-0 z-0"
        onLoad={e => {
          setIsLoading(true);
        }}
      />
      {!isLoading ? (
        <Loading />
      ) : (
        <>
          {!correct ? (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    p-3 bg-white rounded-lg min-w-1 min-h-1 drop-shadow-lg w-11/12 lg:w-2/6"
            >
              <h2 className="text-lg mb-3">동의서 확인</h2>
              <form>
                <div className="mb-3">
                  <label
                    htmlFor="companychk"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    지점명을 입력해 주세요
                  </label>
                  <input
                    type="text"
                    id="companychk"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
                    value={compChk}
                    onChange={e => setCompChk(e.currentTarget.value)}
                    onBlur={e => setCompChk(e.currentTarget.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="namechk"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    이름을 입력해 주세요
                  </label>
                  <input
                    type="text"
                    id="namechk"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
                    value={nameChk}
                    onChange={e => setNameChk(e.currentTarget.value)}
                    onBlur={e => setNameChk(e.currentTarget.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                  onClick={e => {
                    e.preventDefault();
                    chkSigned();
                  }}
                >
                  동의서 확인하기
                </button>
              </form>
            </div>
          ) : (
            <div className="xl:container xl:mx-auto px-2 py-2 xl:py-5">
              <div className="text-white text-xl">이용동의서 확인</div>
              <div
                id="capture"
                className="p-5 w-full xl:w-5/6 bg-white rounded-lg drop-shadow-xl mx-auto"
              >
                <h1 className="text-center text-xl xl:text-3xl font-bold">
                  코리아티엠 광고 진행에 대한 이용동의
                </h1>
                <div className="my-2 text-base text-center">
                  광고진행과 채용효율 증진을 위해,{" "}
                  <br className="xl:hidden block" />
                  아래 내용에 대해 동의를 요청합니다
                </div>
                <div className="bg-gray-50 border">
                  <ol className="flex flex-col divide-y">
                    <li className="xl:text-lg flex flex-row flex-nowrap justify-between">
                      <div className=" basis-3/4 xl:basis-11/12 p-2 border-r">
                        광고에 대한 이해가 선행되어야, 원활한 면접진행이
                        가능함을 알고 있으며 광고 문구 등에 대해{" "}
                        <strong className="block xl:inline">
                          &lt;이해 및 동의 합니다.&gt;
                        </strong>
                      </div>
                      <div className="basis-1/4 p-1 text-center flex flex-col justify-center">
                        <span
                          className={agree1 ? "text-green-500" : "text-red-500"}
                        >
                          {agree1 ? "동의함" : "동의안함"}
                        </span>
                      </div>
                    </li>
                    <li className="xl:text-lg flex flex-row flex-nowrap justify-between">
                      <div className="basis-3/4 xl:basis-11/12 p-2 border-r">
                        광고변경 요청시, 광고팀과 사전 상의하며 / 광고팀의
                        의견과 반하는 광고로 변경시, 이로 인해 발생될 수 있는{" "}
                        <strong className="block xl:inline">
                          &lt;지원율의 저조도 감수 합니다.&gt;
                        </strong>
                      </div>

                      <div className="basis-1/4 p-1 text-center flex flex-col justify-center">
                        <span
                          className={agree2 ? "text-green-500" : "text-red-500"}
                        >
                          {agree2 ? "동의함" : "동의안함"}
                        </span>
                      </div>
                    </li>
                    <li className="xl:text-lg flex flex-row flex-nowrap justify-between">
                      <div className="basis-3/4 xl:basis-11/12 p-2 border-r">
                        광고게재 매체 및 상품은 코리아티엠이{" "}
                        <strong className="block xl:inline">
                          &lt;광고효율을 감안하여 선정하고 있음을 이해하며 이에
                          동의합니다&gt;
                        </strong>
                      </div>
                      <div className="basis-1/4 p-1 text-center flex flex-col justify-center">
                        <span
                          className={agree3 ? "text-green-500" : "text-red-500"}
                        >
                          {agree3 ? "동의함" : "동의안함"}
                        </span>
                      </div>
                    </li>
                    <li className="xl:text-lg flex flex-row flex-nowrap justify-between">
                      <div className="basis-3/4 xl:basis-11/12 p-2 border-r">
                        광고 저작물을 존중하여 광고를{" "}
                        <strong className="block xl:inline">
                          &lt;도용 및 유출 하지 않겠습니다&gt;
                        </strong>
                      </div>
                      <div className="basis-1/4 p-1 text-center flex flex-col justify-center">
                        <span
                          className={agree4 ? "text-green-500" : "text-red-500"}
                        >
                          {agree4 ? "동의함" : "동의안함"}
                        </span>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="my-2 text-center text-xl">{todayDate}</div>
                <div className="my-2 xl:text-right xl:text-xl">
                  지점명 : {comp}
                </div>
                <div className="my-2 xl:text-right xl:text-xl">
                  동의자 : {name}
                </div>
                <div className="my-2 xl:text-right xl:text-xl bg-gray-50 border">
                  <img src={sign} alt={`${name}님의 서명`} />
                </div>
              </div>
              <div className="mt-5 p-5 w-full xl:w-5/6 bg-white rounded-lg drop-shadow-xl">
                <div className="grid grid-cols-2">
                  {isAdmin ? (
                    <div>
                      <button
                        className="bg-sky-500 hover:bg-sky-700 text-white p-2 rounded-lg w-1/2"
                        onClick={e => navi("/agreelist")}
                      >
                        동의서 리스트 보기
                      </button>
                    </div>
                  ) : null}
                  <div>
                    <button
                      className="bg-emerald-500 hover:bg-emerald-700 text-white p-2 rounded-lg w-1/2"
                      onClick={saveAsImage}
                    >
                      이미지로 저장
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default AgreeResult;
