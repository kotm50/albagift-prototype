import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../Job/Data";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import InputApplyImg from "./InputApplyImg";
import InputAdImg from "./InputAdImg";
import InputExistImg from "./InputExistImg";
import Modal from "./Modal";

import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko"); // 한국어 로케일 설정

function InputVisit() {
  let now = dayjs();
  const [alias, setAlias] = useState("");
  const [cName, setCName] = useState("");
  const [manager, setManager] = useState("");
  const [infoA, setInfoA] = useState("");
  const [adInfo, setAdInfo] = useState("");
  const [propose, setPropose] = useState("");
  const [applyImg, setApplyImg] = useState("");
  const [adImgA, setAdImgA] = useState("");
  const [adImgATask, setAdImgATask] = useState("");
  const [adImgB, setAdImgB] = useState("");
  const [adImgBTask, setAdImgBTask] = useState("");
  const [adImgC, setAdImgC] = useState("");
  const [adImgCTask, setAdImgCTask] = useState("");
  const [existImgA, setExistImgA] = useState("");
  const [existImgATask, setExistImgATask] = useState("");
  const [existImgB, setExistImgB] = useState("");
  const [existImgBTask, setExistImgBTask] = useState("");
  const [existImgC, setExistImgC] = useState("");
  const [existImgCTask, setExistImgCTask] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [toPrint, setToPrint] = useState({});
  const [canPrint, setCanPrint] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const saveIt = async () => {
    let error = getError();
    if (error !== "오류없음") {
      return alert(error);
    }

    let today = now.format("YYYY-MM-DD");
    let body = {
      alias: Number(alias),
      date: today,
      cName: cName,
      manager: manager,
      infoA: infoA,
      adInfo: adInfo,
      propose: propose,
      applyImg: applyImg,
      adImgA: adImgA,
      adImgB: adImgB,
      adImgC: adImgC,
      existImgA: existImgA,
      existImgB: existImgB,
      existImgC: existImgC,
      isNew: isNew,
    };
    let submit = window.confirm(`제안서를 저장합니다. 진행할까요?`);
    if (submit) {
      const meetRef = collection(db, "visit");
      await setDoc(doc(meetRef, `${alias}`), body);
      await setDoc(doc(meetRef, "new"), body);
      alert(`저장이 완료되었습니다.`);
    }
  };

  const printIt = () => {
    let error = getError();
    if (error !== "오류없음") {
      setCanPrint(false);
      return alert(error);
    }
    let today = now.format("YYYY.MM.DD.(dd)");
    let body = {
      alias: Number(alias),
      date: today,
      cName: cName,
      manager: manager,
      infoA: infoA,
      adInfo: adInfo,
      propose: propose,
      applyImg: applyImg,
      adImgA: adImgA,
      adImgB: adImgB,
      adImgC: adImgC,
      existImgA: existImgA,
      existImgB: existImgB,
      existImgC: existImgC,
      isNew: isNew,
    };
    setToPrint(body);
  };

  const handleCheckboxChange = () => {
    setIsNew(!isNew);
  };

  useEffect(() => {
    if (Object.keys(toPrint).length !== 0) {
      setCanPrint(true);
      setModalOpen(true);
    }
  }, [toPrint]);

  const getError = () => {
    if (alias === "") {
      return "고유번호를 입력해 주세요.";
    }
    if (isNaN(Number(alias))) {
      return "고유번호는 숫자만 입력해 주세요";
    }
    if (cName === "") {
      return "고객사명을 입력해 주세요";
    }
    if (!isNew) {
      if (applyImg === "") {
        return "면접현황표를 올려주세요.\n신규고객사의 경우 신규고객사에 체크해주세요";
      }
    }
    if (manager === "") {
      return "고객사명을 입력해 주세요";
    }
    if (infoA === "") {
      return "기본정보를 입력해 주세요";
    }
    if (adInfo === "") {
      return "참고사항을 입력해 주세요";
    }
    if (propose === "") {
      return "제안내용을 입력해 주세요";
    }
    return "오류없음";
  };

  return (
    <>
      <div className="container mx-auto bg-white p-3 rounded-lg mt-3 drop-shadow-md none-print">
        <h1 className="text-3xl mb-3">고객사 방문 미팅 제안 작성</h1>
        <div className="h-full border border-collapse border-gray-300 drop-shadow-md">
          <div className="flex">
            <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 text-lg py-4">
              지정번호 4자리
            </div>
            <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
              <input
                type="text"
                id="alias"
                name="alias"
                className="block mb-1 text-base font-medium text-stone-900 w-full p-2 rounded  border border-gray-300"
                placeholder="여기를 눌러서 직접 입력해 주세요"
                value={alias}
                onChange={e => setAlias(e.currentTarget.value)}
                onBlur={e => setAlias(e.currentTarget.value)}
              />
              <small className="block text-gray-500">
                (사전설문지 출력을 위해 정확히 입력해 주세요)
              </small>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 text-lg py-4">
              고객사명
            </div>
            <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
              <input
                type="text"
                id="cName"
                name="cName"
                className="block mb-1 text-base font-medium text-stone-900 w-full p-2 rounded  border border-gray-300"
                placeholder="여기를 눌러서 직접 입력해 주세요"
                value={cName}
                onChange={e => setCName(e.currentTarget.value)}
                onBlur={e => setCName(e.currentTarget.value)}
              />
            </div>
          </div>
          <div className="flex" id="inputManager">
            <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 text-lg py-4">
              방문자명
            </div>
            <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
              <input
                type="text"
                id="manager"
                name="manager"
                className="block mb-1 text-base font-medium text-stone-900 w-full p-2 rounded  border border-gray-300"
                placeholder="여기를 눌러서 직접 입력해 주세요"
                value={manager}
                onChange={e => setManager(e.currentTarget.value)}
                onBlur={e => setManager(e.currentTarget.value)}
              />
            </div>
          </div>
          <div className="flex" id="inputManager">
            <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 text-lg py-4">
              면접현황
            </div>
            <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={handleCheckboxChange}
                    className="form-checkbox text-indigo-600 h-5 w-5"
                  />
                  <span className="ml-2 text-gray-700">신규고객사 입니다</span>
                </label>
              </div>
              {isNew ? (
                "신규지점으로 해당사항 없음"
              ) : (
                <InputApplyImg applyImg={applyImg} setApplyImg={setApplyImg} />
              )}
            </div>
          </div>
          <div className="flex" id="inputManager">
            <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 text-lg">
              기본정보
            </div>
            <div className="w-5/6 bg-gray-100 border border-gray-300 flex flex-col">
              <div className="p-2 font-normal">
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  value={infoA}
                  onChange={setInfoA}
                />
              </div>
            </div>
          </div>
          <div className="flex" id="inputManager">
            <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 text-lg py-4">
              참고사항
            </div>
            <div className="w-5/6 bg-gray-100 border border-gray-300 flex flex-col">
              <div className="p-2 font-normal">
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  value={adInfo}
                  onChange={setAdInfo}
                />
              </div>
            </div>
          </div>
          <div className="flex" id="inputManager">
            <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 text-lg py-4">
              제안내용
            </div>
            <div className="w-5/6 bg-gray-100 border border-gray-300 flex flex-col">
              <div className="p-2 font-normal">
                <ReactQuill
                  theme="snow"
                  value={propose}
                  onChange={setPropose}
                />
              </div>
            </div>
          </div>
          <div className="flex" id="inputManager">
            <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 text-lg py-4">
              채용광고
            </div>
            <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
              <InputAdImg
                adImgA={adImgA}
                setAdImgA={setAdImgA}
                no={1}
                adImgATask={adImgATask}
                setAdImgATask={setAdImgATask}
              />
              <InputAdImg
                adImgB={adImgB}
                setAdImgB={setAdImgB}
                no={2}
                adImgBTask={adImgBTask}
                setAdImgBTask={setAdImgBTask}
              />
              <InputAdImg
                adImgC={adImgC}
                setAdImgC={setAdImgC}
                no={3}
                adImgCTask={adImgCTask}
                setAdImgCTask={setAdImgCTask}
              />
            </div>
          </div>
          <div className="flex" id="inputManager">
            <div className="w-1/6 bg-gray-200 border border-gray-300 p-2 text-lg py-4">
              기존광고
            </div>
            <div className="w-5/6 bg-gray-100 border border-gray-300 p-2">
              <InputExistImg
                existImgA={existImgA}
                setExistImgA={setExistImgA}
                existImgATask={existImgATask}
                setExistImgATask={setExistImgATask}
                no={1}
              />
              <InputExistImg
                existImgB={existImgB}
                setExistImgB={setExistImgB}
                existImgBTask={existImgBTask}
                setExistImgBTask={setExistImgBTask}
                no={2}
              />
              <InputExistImg
                existImgC={existImgC}
                setExistImgC={setExistImgC}
                existImgCTask={existImgCTask}
                setExistImgCTask={setExistImgCTask}
                no={3}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-3 mt-5 none-print">
        <div className="container mx-auto text-cetner flex flex-row justify-center gap-2">
          <button
            className="block w-60 bg-indigo-500 hover:bg-indigo-700 p-2 px-10 text-center text-white rounded-full mx-auto font-medium text-lg"
            onClick={e => saveIt()}
          >
            저장하기
          </button>
          <button
            className="block w-60 bg-yellow-600 hover:bg-yellow-800 p-2 px-10 text-center text-white rounded-full mx-auto font-medium text-lg"
            onClick={e => printIt()}
          >
            인쇄준비
          </button>
          <button
            className="block w-60 bg-blue-500 hover:bg-blue-700 p-2 px-10 text-center text-white rounded-full mx-auto font-medium text-lg"
            onClick={e => {
              if (canPrint) {
                window.print();
              } else {
                return alert("인쇄준비를 눌러서 자료를 입력해 주세요");
              }
            }}
          >
            인쇄하기
          </button>
          <div
            className={`flex flex-col justify-center font-medium ${
              canPrint ? "text-green-600" : "text-red-500"
            }`}
          >
            {canPrint
              ? "인쇄준비가 완료 되었습니다. 인쇄하기 버튼을 눌러주세요"
              : "인쇄준비가 되지 않았습니다. 인쇄준비 버튼을 눌러주세요"}
          </div>
        </div>
      </div>
      <Modal isOpen={modalOpen} toPrint={toPrint} />
    </>
  );
}

export default InputVisit;
