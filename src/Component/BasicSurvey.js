import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useSearchParams } from "react-router-dom";

import Agree from "./Agree";
import InputName from "./InputName";
import InputMbti from "./InputMbti";
import InputPhoto from "./InputPhoto";
import InputPhone from "./InputPhone";
import Error from "./Error";

import dayjs from "dayjs";

function BasicSurvey() {
  let navi = useNavigate();
  const [survey, setSurvey] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [answers, setAnswers] = useState([]);
  const [no, setNo] = useState("");
  const [aliasNum, setAliasNum] = useState(0);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoTask, setPhotoTask] = useState("");
  const [phone, setPhone] = useState("");
  const [mbti, setMbti] = useState("");
  const [profile, setProfile] = useState([]);
  const [start, setStart] = useState(false);
  const [agree, setAgree] = useState(false);
  const [ansLength, setAnsLength] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const getResult = async () => {
    const querySnapshot = await getDocs(collection(db, "basic"));
    let list = [];
    querySnapshot.forEach(doc => {
      list.push(doc.data());
    });
    setSurvey(list);
    const load = setTimeout(() => {
      setLoading(true);
      clearInterval(load);
    }, 1000);
  };

  useEffect(() => {
    setNum();
    setAlias();
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `KoTI 설문지`;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let body = profile;
    body.photo = photo;
    setProfile(body);
    // eslint-disable-next-line
  }, [photo]);

  const setAlias = () => {
    const alias = searchParams.get("alias");
    setSearchParams(searchParams);
    getResult();
    setAliasNum(alias);
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
      photoTask: photoTask,
      phone: phone,
      agree: true,
    };
    setProfile(body);
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

  const checkHandler = (isChecked, value, questionId) => {
    setAnswers(prevAnswers => {
      let updatedAnswers;
      const index = prevAnswers.findIndex(ans => ans.question === questionId);

      if (index !== -1) {
        // 이미 해당 질문에 대한 답변이 있는 경우
        updatedAnswers = [...prevAnswers];
        if (isChecked) {
          // 체크박스가 선택된 경우, 답변 추가
          updatedAnswers[index].answer.push(value);
        } else {
          // 체크박스가 해제된 경우, 답변 삭제
          updatedAnswers[index].answer = updatedAnswers[index].answer.filter(
            ans => ans !== value
          );
          if (updatedAnswers[index].answer.length === 0) {
            // 답변이 없어진 경우, 해당 질문의 답변 삭제
            updatedAnswers.splice(index, 1);
          }
        }
      } else {
        // 해당 질문에 대한 답변이 없는 경우
        if (isChecked) {
          // 체크박스가 선택된 경우, 새로운 답변 추가
          updatedAnswers = [
            ...prevAnswers,
            {
              question: questionId,
              answer: [value],
            },
          ];
        } else {
          // 체크박스가 해제된 경우, 아무 작업 필요 없음
          updatedAnswers = [...prevAnswers];
        }
      }

      console.log("Updated Answers:", updatedAnswers); // 중간 값 확인

      setAnsLength(updatedAnswers.length);
      return updatedAnswers;
    });
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
      pw: "basic",
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
      //signIn(no);
      const surveyRef = collection(db, "survey");
      await setDoc(doc(surveyRef, `${no}`), body);
      alert(`제출이 완료되었습니다, 이용해주셔서 감사합니다`);
      navi("/complete?b=basic");
    }
  };
  /*
  const signIn = async n => {
    let body = {
      surveyId: no,
      name: profile.name,
      id: phone,
      password: phone,
      admin: false,
      created: serverTimestamp(),
    };
    const applyRef = collection(db, "apply");
    await setDoc(doc(applyRef, `${phone}`), body);
  };
  */

  return (
    <>
      {error && <Error />}
      {!loading ? (
        <div className="w-11/12 lg:container mx-auto mb-28 flex flex-col justify-center">
          <div className="bg-white p-3">
            설문지를 불러오고 있습니다. 잠시만 기다려 주세요...
          </div>
        </div>
      ) : (
        <div className="w-11/12 lg:container mx-auto mb-28">
          <h1 className="text-white text-3xl font-bold text-center my-2">
            KoTI 설문지 입니다 {start && `반갑습니다 ${profile.name}님`}
          </h1>
          {!start ? (
            <div className="bg-gray-100 text-lg w-11/12 lg:container box-border border-2 mx-auto p-3 rounded mb-3 shadow-xl">
              <InputName name={name} setName={setName} />
              <InputPhone phone={phone} setPhone={setPhone} />
              <InputMbti mbti={mbti} setMbti={setMbti} />
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
                      {idx + 1}. {sur.question}{" "}
                      {sur.type === "checkbox" && (
                        <span className="text-red-500">(중복선택가능)</span>
                      )}
                    </div>
                    {sur.answer.length > 1 ? (
                      <div className="flex flex-col lg:flex-row flex-wrap gap-3 mt-2">
                        {sur.type === "radio" ? (
                          <>
                            {sur.answer.map((ans, idx) => (
                              <div className="border rounded" key={idx}>
                                <input
                                  type="radio"
                                  value={ans}
                                  id={sur.id + idx}
                                  name={sur.id}
                                  className="peer hidden"
                                  onClick={e =>
                                    answerHandler(
                                      e.currentTarget.value,
                                      sur.id,
                                      idx
                                    )
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
                          </>
                        ) : (
                          <>
                            {sur.answer.map((ans, idx) => (
                              <div className="border rounded" key={idx}>
                                <input
                                  type="checkbox"
                                  value={ans}
                                  id={String(sur.id + idx)}
                                  name={sur.id}
                                  className="peer hidden"
                                  onClick={e =>
                                    checkHandler(
                                      e.currentTarget.checked,
                                      ans,
                                      sur.id
                                    )
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
                          </>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="block bg-teal-50 w-full border p-2 mt-2"
                        placeholder="주관식 문항입니다"
                        onBlur={e =>
                          answerHandler(e.currentTarget.value, sur.id)
                        }
                      />
                    )}
                  </div>
                ))}
              <InputPhoto
                photo={photo}
                setPhoto={setPhoto}
                name={name}
                photoTask={photoTask}
                setPhotoTask={setPhotoTask}
              />
            </>
          )}
        </div>
      )}

      {ansLength > 0 && (
        <div className="fixed bottom-0 left-0 right-0 w-full p-2 mt-3 text-center bg-white border-t border-gray-300">
          <div className="mb-1">
            현재까지 답변한 문항{" "}
            <span className="font-bold text-lg text-indigo-600">
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

export default BasicSurvey;
