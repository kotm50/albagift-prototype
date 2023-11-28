import React, { useState } from "react";

import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../../Job/Data";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

function MemoInput(props) {
  let now = dayjs();
  const [meeting, setMeeting] = useState("");
  const [reward, setReward] = useState("");
  const [koti, setKoti] = useState("");
  const [place, setPlace] = useState("");
  const [parking, setParking] = useState("");
  const [recommend, setRecommend] = useState("");
  const [memo, setMemo] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [memoId, setMemoId] = useState("");
  const [saving, setSaving] = useState(false);

  const chksubmit = () => {
    let txt = "통과";
    if (meeting === "") {
      txt = "미팅 참석자를 입력해 주세요";
      return txt;
    }
    if (reward === "") {
      txt = "면접비 여부를 입력해 주세요";
      return txt;
    }
    if (koti === "") {
      txt = "면접 질의서 여부를 입력해 주세요";
    }
    if (place === "") {
      txt = "면접장소를 입력해 주세요";
      return txt;
    }
    if (parking === "") {
      txt = "면접지 부근 주차구역을 입력해 주세요";
      return txt;
    }
    if (recommend === "") {
      txt = "코리아티엠을 알려준 분을 입력해 주세요";
      return txt;
    }
    if (memo === "") {
      txt = "상세메모를 입력해 주세요";
      return txt;
    }
    return txt;
  };

  const submit = async () => {
    let chk = chksubmit();
    if (chk !== "통과") {
      return alert(chk);
    }
    let confirm;
    if (!isSaved) {
      confirm = window.confirm("메모를 저장하시겠습니까?");
    } else {
      confirm = window.confirm("메모를 수정하시겠습니까?");
    }
    if (confirm) {
      setSaving(true);
      let body = {
        alias: Number(props.id),
        id: props.id,
        cName: props.visit.cName,
        reward: reward,
        koti: koti,
        place: place,
        parking: parking,
        recommend: recommend,
        meeting: meeting,
        memo: memo,
        date: now.format("YYYY-MM-DD"),
      };
      try {
        if (!isSaved) {
          // 문서 추가
          body.created = serverTimestamp();
          const collectionRef = collection(db, "visitmemo");
          const newDocRef = await addDoc(collectionRef, body);
          setMemoId(newDocRef.id);
          setIsSaved(true);
        } else {
          // 문서 수정
          body.updated = serverTimestamp();
          const docRef = doc(db, "visitmemo", memoId);
          await setDoc(docRef, body, { merge: true });
        }
      } catch (error) {
        console.error(
          "문서를 추가 또는 수정하는 중에 오류가 발생했습니다:",
          error
        );
      }
      setSaving(false);
      if (!isSaved) {
        alert("메모를 저장했습니다");
      } else {
        alert("메모를 수정했습니다");
      }
    } else {
      alert("메모를 다시 확인해 주세요");
    }
  };
  return (
    <>
      <h2 className="font-medium text-xl mb-2">
        방문미팅 메모{" "}
        <small className="text-sm font-normal ml-2 text-teal-500">
          창을 닫아도 메모는 남아있으나{" "}
          <span className="text-red-500">
            새로고침하면 메모가 사라질 수 있습니다
          </span>
        </small>
      </h2>
      <div id="company" className="grid grid-cols-10 border-y">
        <div className="p-2 bg-gray-200 col-span-2">방문고객사</div>
        <div className="p-2 col-span-8 bg-gray-50">
          {props.id} - {props.visit.cName}
        </div>
      </div>
      <div id="manager" className="grid grid-cols-10 border-b">
        <div className="p-2 bg-gray-200 col-span-2">방문객</div>
        <div className="p-2 col-span-8 bg-gray-50">{props.visit.manager}</div>
      </div>
      <div id="meeting" className="grid grid-cols-10 border-b">
        <div className="p-2 bg-gray-200 col-span-2">미팅참석</div>
        <div className="p-2 col-span-8 bg-gray-50">
          <input
            type="text"
            className="bg-white border px-2 w-full"
            value={meeting}
            onChange={e => setMeeting(e.currentTarget.value)}
            onBlur={e => setMeeting(e.currentTarget.value)}
            placeholder="예시) ㅇㅇㅇ 실장 / ㅁㅁㅁ 팀장"
          />
        </div>
      </div>
      <div id="reward" className="grid grid-cols-10 border-b">
        <div className="p-2 bg-gray-200 col-span-2">면접비</div>
        <div className="p-2 col-span-8 bg-gray-50">
          <input
            type="text"
            className="bg-white border px-2 w-full"
            value={reward}
            onChange={e => setReward(e.currentTarget.value)}
            onBlur={e => setReward(e.currentTarget.value)}
            placeholder="면접비 이용여부"
          />
        </div>
      </div>
      <div id="koti" className="grid grid-cols-10 border-b">
        <div className="p-2 bg-gray-200 col-span-2">면접질의서</div>
        <div className="p-2 col-span-8 bg-gray-50">
          <input
            type="text"
            className="bg-white border px-2 w-full"
            value={koti}
            onChange={e => setKoti(e.currentTarget.value)}
            onBlur={e => setKoti(e.currentTarget.value)}
            placeholder="면접질의서 이용여부"
          />
        </div>
      </div>
      <div id="place" className="grid grid-cols-10 border-b">
        <div className="p-2 bg-gray-200 col-span-2">면접장소</div>
        <div className="p-2 col-span-8 bg-gray-50">
          <input
            type="text"
            className="bg-white border px-2 w-full"
            value={place}
            onChange={e => setPlace(e.currentTarget.value)}
            onBlur={e => setPlace(e.currentTarget.value)}
            placeholder="면접장소 입력"
          />
        </div>
      </div>
      <div id="parking" className="grid grid-cols-10 border-b">
        <div className="p-2 bg-gray-200 col-span-2">주차여부</div>
        <div className="p-2 col-span-8 bg-gray-50">
          <input
            type="text"
            className="bg-white border px-2 w-full"
            value={parking}
            onChange={e => setParking(e.currentTarget.value)}
            onBlur={e => setParking(e.currentTarget.value)}
            placeholder="면접지 주차가능 여부"
          />
        </div>
      </div>
      <div id="recommend" className="grid grid-cols-10 border-b">
        <div className="p-2 bg-gray-200 col-span-2">추천인</div>
        <div className="p-2 col-span-8 bg-gray-50">
          <input
            type="text"
            className="bg-white border px-2 w-full"
            value={recommend}
            onChange={e => setRecommend(e.currentTarget.value)}
            onBlur={e => setRecommend(e.currentTarget.value)}
            placeholder="코티를 소개해주신 분"
          />
        </div>
      </div>
      <div id="etc" className="grid grid-cols-10 border-b">
        <div className="p-2 bg-gray-200 col-span-2">상세내용</div>
        <div id="visitmemo" className="p-2 col-span-8 bg-gray-50">
          <ReactQuill
            theme="snow"
            modules={modules}
            value={memo}
            onChange={setMemo}
          />
        </div>
      </div>
      <div className="submit w-full text-center mt-2 grid grid-cols-2">
        {saving ? (
          <button
            className="bg-gray-500 py-3 px-10 text-white text-lg rounded-full"
            onClick={submit}
            disabled
          >
            잠시만 기다려주세요
          </button>
        ) : (
          <button
            className="bg-teal-500 hover:bg-teal-700 py-2 px-10 text-white text-lg rounded-full"
            onClick={submit}
          >
            {!isSaved ? "메모 저장하기" : "메모 수정하기"}
          </button>
        )}
        {isSaved ? (
          <p className="flex flex-col justify-center">
            *미팅 진행 중에만 수정이 가능합니다
          </p>
        ) : (
          <p className="flex flex-col justify-center">
            *페이지 이동하기 전에 저장하기를 권장합니다.
          </p>
        )}
      </div>
    </>
  );
}

export default MemoInput;
