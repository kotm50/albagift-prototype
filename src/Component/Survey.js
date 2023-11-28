import React, { useState, useEffect } from "react";
import {
  collection,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

import { useNavigate, useSearchParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Agree from "./Agree";
import InputName from "./InputName";
import InputMbti from "./InputMbti";
import InputPhoto from "./InputPhoto";
import InputPhone from "./InputPhone";
import Error from "./Error";

import dayjs from "dayjs";

function Survey() {
  let navi = useNavigate();
  const [survey, setSurvey] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [manager, setManager] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [no, setNo] = useState("");
  const [aliasNum, setAliasNum] = useState(0);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [phone, setPhone] = useState("");
  const [mbti, setMbti] = useState("");
  const [profile, setProfile] = useState([]);
  const [start, setStart] = useState(false);
  const [agree, setAgree] = useState(false);
  const [share, setShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ansLength, setAnsLength] = useState(0);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  const getResult = async alias => {
    const resultRef = collection(db, "KoTI");
    let result = await getDoc(doc(resultRef, `${alias}`));
    if (result.data() !== undefined) {
      let manager = result.data().profile;
      setManager(manager);
      let surveys = result.data().survey;
      let surveyArr = [];
      const sampleRef = collection(db, "sample");
      for await (const survey of surveys) {
        const res = await getDoc(doc(sampleRef, `${survey}`));
        surveyArr.push(res.data());
      }
      setSurvey(surveyArr);
    } else {
      return alert("알 수 없는 오류");
    }
  };

  useEffect(() => {
    setNum();
    shareIt();
    setAlias();
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `KoTI 설문지`;
    // eslint-disable-next-line
  }, []);

  const setAlias = () => {
    const alias = searchParams.get("alias");
    setSearchParams(searchParams);
    getResult(alias);
    setAliasNum(Number(alias));
  };

  const setNum = () => {
    const no = searchParams.get("no");
    setSearchParams(searchParams);
    if (no !== null) {
      setNo(Number(no));
    } else {
      alert("오류가 발생했습니다. 관리자에게 문의해주세요");
      setError(true);
    }
  };

  const setGen = () => {
    let gen = searchParams.get("gender");
    setSearchParams(searchParams);
    if (gen !== null) {
      if (gen === "female") {
        gen = "여성";
      } else if (gen === "male") {
        gen = "남성";
      } else {
        gen = "";
      }
    } else {
      gen = "";
    }
    let body = {
      name: name,
      gender: gen,
      mbti: mbti,
      photo: photo,
      agree: true,
    };
    setProfile(body);
  };

  const shareIt = () => {
    const s = searchParams.get("share");
    setSearchParams(searchParams);
    if (s !== null) {
      let str = window.location.href;
      str = str.slice(0, -8);
      setUrl(str);
      setShare(true);
    } else {
      setShare(false);
    }
  };

  const answerHandler = (e, c) => {
    let ansarr = answers;
    let index = ansarr.findIndex(e => e.question === c);
    if (index !== -1) {
      ansarr[index].answer = e;
    } else {
      ansarr.push({
        question: c,
        answer: e,
      });
    }
    setAnswers(ansarr);
    setAnsLength(answers.length);
  };

  const surveyStart = () => {
    if (name === "") {
      return alert("이름을 입력해 주세요");
    }
    if (mbti === "") {
      return alert(
        "MBTI를 골라주세요, 확인이 어려우시면 '잘 모르겠어요'를 선택해 주세요"
      );
    }
    if (photo === "") {
      let noPhoto = window.confirm(
        "사진을 올리지 않았습니다. 그대로 진행할까요?"
      );
      if (noPhoto) {
        setPhoto("noPhoto");
      } else {
        setPhoto("");
        return alert("사진을 업로드 해주세요");
      }
    }
    if (agree) {
      setGen();
      setStart(true);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else {
      return alert("개인정보 수집에 동의하셔야 진행이 가능합니다");
    }
  };

  const surveySubmit = async () => {
    if (survey.length > answers.length) {
      return alert("아직 답변하지 않은 문항이 있습니다. 확인해주세요");
    }
    for (let i = 0; i < answers.length - 1; i++) {
      if (answers[i].answer === "") {
        return alert("아직 답변하지 않은 문항이 있습니다. 확인해주세요");
      }
    }
    let now = dayjs().format("YYYY-MM-DD");
    let body = {
      surveyId: no,
      pw: manager.phone,
      profile: profile,
      answers: answers,
      date: now,
      alias: aliasNum,
      created: serverTimestamp(),
    };
    let submit = window.confirm(
      `${body.profile.name}님의 설문지를 제출합니다. 진행할까요?`
    );
    if (submit) {
      const surveyRef = collection(db, "survey");
      await setDoc(doc(surveyRef, `${no}`), body);
      alert(`제출이 완료되었습니다, 이용해주셔서 감사합니다`);
      navi("/complete?b=survey");
    }
  };

  return (
    <>
      {error && <Error />}
      {share && (
        <div className="w-full p-2 bg-white drop-shadow-lg mb-3">
          <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
            <button className="block w-11/12 container mx-auto bg-indigo-500 rounded p-2 text-white text-lg font-medium">
              주소복사하기
            </button>
          </CopyToClipboard>
          <div className="text-indigo-500 text-center mt-2">
            {copied ? (
              "주소가 복사되었습니다. 원하시는 곳에 붙여넣기 하세요"
            ) : (
              <span>
                <strong className="text-red-500">'주소복사하기'</strong> 버튼을
                클릭하면 자동으로 주소가 복사됩니다
              </span>
            )}
          </div>
        </div>
      )}
      <div className="w-11/12 lg:container mx-auto mb-28">
        <h1 className="text-white text-3xl font-medium text-center my-2">
          KoTI 설문지 입니다 {start && `반갑습니다 ${profile.name}님`}
        </h1>
        {!start ? (
          <div className="bg-gray-100 text-lg w-11/12 lg:container box-border border-2 mx-auto p-3 rounded mb-3 shadow-xl">
            <InputName name={name} setName={setName} />
            <InputPhone phone={phone} setPhone={setPhone} />
            <InputMbti mbti={mbti} setMbti={setMbti} />
            <InputPhoto photo={photo} setPhoto={setPhoto} name={name} />
            <Agree
              agree={agree}
              setAgree={setAgree}
              survey={survey}
              surveyStart={surveyStart}
            />
          </div>
        ) : (
          <>
            {survey &&
              survey.map((sur, idx) => (
                <div
                  className="bg-white p-2 rounded drop-shadow-lg my-2"
                  key={idx}
                >
                  <div className="text-lg">
                    {survey.length - 1 === idx && (
                      <p className="text-sm text-pink-500">
                        마지막 질문입니다, 수고많으셨습니다
                      </p>
                    )}
                    {idx + 1}. {sur.question}
                  </div>
                  {sur.answer.length > 1 ? (
                    <div className="flex flex-col lg:flex-row flex-wrap gap-3 mt-2">
                      {sur.answer.map((ans, idx) => (
                        <div className="border rounded" key={idx}>
                          <input
                            type="radio"
                            value={ans}
                            id={sur.id + idx}
                            name={sur.id}
                            className="peer hidden"
                            onClick={e =>
                              answerHandler(e.currentTarget.value, sur.id, idx)
                            }
                          />
                          <label
                            htmlFor={sur.id + idx}
                            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-teal-50 text-stone-900  peer-checked:text-white peer-checked:bg-blue-500"
                          >
                            {ans}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="block bg-teal-50 w-full border p-2 mt-2"
                      placeholder="주관식 문항입니다"
                      onBlur={e => answerHandler(e.currentTarget.value, sur.id)}
                    />
                  )}
                </div>
              ))}
          </>
        )}
      </div>
      {ansLength > 0 && (
        <div className="fixed bottom-0 left-0 right-0 w-full p-2 mt-3 text-center bg-white border-t border-gray-300">
          <div className="mb-1">
            현재까지 답변한 문항{" "}
            <span className="font-medium text-lg text-indigo-600">
              {answers.length} / {survey.length}
            </span>
          </div>
          <button
            className="block w-11/12 lg:container mx-auto rounded p-2 text-white bg-indigo-500 hover:bg-indigo-700"
            onClick={e => surveySubmit()}
          >
            저장하기
          </button>
        </div>
      )}
    </>
  );
}

export default Survey;
