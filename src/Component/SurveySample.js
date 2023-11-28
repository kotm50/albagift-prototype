import React, { useState, useEffect } from "react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Guide from "./Guide";
import Error from "./Error";

function SurveySample() {
  let navi = useNavigate();
  const [sample, setSample] = useState([]);
  const [guide, setGuide] = useState(true);
  const [start, setStart] = useState(false);
  const [selected, setSelected] = useState([]);
  const [cName, setCName] = useState("");
  const [mName, setMName] = useState("");
  const [phone, setPhone] = useState("");
  const [profile, setProfile] = useState({});
  const [pAlert, setPAlert] = useState(false);
  const [alias, setAlias] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [url, setUrl] = useState("");
  const [share, setShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chkCount, setChkCount] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAlias();
    shareIt();
    getSample();
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `KoTI 설문지`;
    // eslint-disable-next-line
  }, []);

  const getAlias = () => {
    const alias = searchParams.get("alias");
    setSearchParams(searchParams);
    if (alias !== null) {
      setAlias(alias);
      window.scrollTo(0, 1);
    } else {
      setError(true);
      return alert("부정적인 경로로 접속하셨습니다");
    }
  };

  const getSample = async () => {
    const querySnapshot = await getDocs(collection(db, "sample"));
    let list = [];
    querySnapshot.forEach(doc => {
      list.push(doc.data());
    });
    setSample(list);
  };

  const checkedHandler = (e, s) => {
    let isChecked = e.currentTarget.checked;
    let chkValue = s;
    if (isChecked) {
      if (chkCount <= 10) {
        setSelected(selected => [...selected, chkValue]);
        setChkCount(chkCount + 1);
      } else {
        e.currentTarget.checked = false;
        return alert("최대 10개까지만 작성 가능합니다");
      }
    } else {
      setSelected(selected.filter(select => select !== chkValue));
      setChkCount(chkCount - 1);
    }
  };

  const saveIt = async () => {
    let body = {
      id: alias,
      overlap: true,
      profile: profile,
      survey: selected,
    };
    let submit = window.confirm(
      `선택하신 문항은 총 ${selected.length}개 입니다. 등록하시겠습니까?`
    );
    if (submit) {
      const kotiRef = collection(db, "KoTI");
      await setDoc(doc(kotiRef, `${alias}`), body);
      alert(`제출이 완료되었습니다. 이용해주셔서 감사합니다`);
      navi("/complete?b=sample");
    }
  };

  const startIt = () => {
    if (cName === "") {
      return alert("업체, 또는 지점명을 입력해 주세요");
    }
    if (mName === "") {
      return alert("담당자님의 성함을 입력해 주세요");
    }
    if (phone === "") {
      return alert("연락처를 입력해주세요");
    }
    setProfile({
      cName: cName,
      mName: mName,
      phone: phone,
    });
    setStart(true);
    setGuide(false);
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

  const reset = () => {
    let warning = window.confirm(
      "지금까지 진행한 기록이 다 사라집니다.\n진행할까요?"
    );
    if (warning) {
      window.location.reload();
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
      <h1 className="text-white text-3xl font-medium text-center my-2">
        KoTI 설문지 만들기
        {start && (
          <span className="ml-2 font-normal">
            안녕하세요! {profile.mName}님!
          </span>
        )}
      </h1>
      <input type="hidden" value={alias} />
      <Guide guide={guide} setGuide={setGuide} />
      {!start ? (
        <div className="w-11/12 lg:container container mx-auto p-5 bg-white rounded drop-shadow-lg">
          <div className="text-lg text-center mb-2">
            업체 또는 지점명을 입력해 주세요
          </div>
          <input
            type="text"
            className="block w-full lg:w-1/2 mx-auto bg-transparent border-2 border-indigo-500 text-center py-3 rounded mt-2 mb-5"
            onChange={e => setCName(e.currentTarget.value)}
            onBlur={e => setCName(e.currentTarget.value)}
          />
          <div className="text-lg  text-center mb-2">
            담당자님의 성함을 입력해 주세요
          </div>
          <input
            type="text"
            className="block w-full lg:w-1/2 mx-auto bg-transparent border-2 border-indigo-500 text-center py-3 rounded mt-2 mb-5"
            onChange={e => setMName(e.currentTarget.value)}
            onBlur={e => setMName(e.currentTarget.value)}
          />
          <div className="text-lg text-center mb-2">
            연락처를 '-' 없이 입력해 주세요.
          </div>
          <input
            type="text"
            className={
              !pAlert
                ? "block w-full lg:w-1/2 mx-auto bg-transparent border-2 border-indigo-500 text-center py-3 rounded mt-2 mb-5"
                : "block w-full lg:w-1/2 mx-auto bg-transparent border-2 border-indigo-500 text-center py-3 rounded my-2"
            }
            value={phone}
            onKeyDown={event => {
              if (!/[0-9]/.test(event.key)) {
                if (event.key === "Delete" || event.key === "Backspace") {
                  setPAlert(false);
                } else {
                  event.preventDefault();
                  setPAlert(true);
                }
              } else {
                setPAlert(false);
              }
            }}
            onChange={e => setPhone(e.currentTarget.value)}
            onBlur={e => setPhone(e.currentTarget.value)}
          />
          {pAlert && (
            <div className="text-indigo-500 text-base text-center mb-5">
              연락처는 숫자만 입력해 주세요
            </div>
          )}
          <button
            className="block w-full lg:w-1/2 mx-auto bg-indigo-500 text-white text-center py-3 rounded my-2 hover:bg-indigo-700"
            onClick={e => startIt()}
          >
            시작하기
          </button>
        </div>
      ) : (
        <div className="w-11/12 lg:container mx-auto mb-28">
          {sample !== [] ? (
            <>
              {sample.map((s, idx) => (
                <div key={idx}>
                  <input
                    type="checkbox"
                    value={s.id}
                    name="surveyChk"
                    className="hidden peer"
                    id={s.id}
                    onClick={e => checkedHandler(e, s.id)}
                  />
                  <label
                    htmlFor={s.id}
                    className="block p-3 bg-white my-3 peer-checked:bg-indigo-500 peer-checked:text-white rounded drop-shadow-lg"
                  >
                    <div className="break-words px-2">{s.question}</div>
                    {s.answer.length > 1 ? (
                      <div className="flex flex-col lg:flex-row flex-wrap">
                        {s.answer.map((a, idx) => (
                          <div
                            className="border bg-teal-50 p-2 m-2 text-sm text-center lg:text-left text-black"
                            key={idx}
                          >
                            {a}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border bg-teal-50 p-2 m-2 text-sm text-center lg:text-left text-black">
                        주관식 문항입니다
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </>
          ) : (
            "잠시만 기다려 주세요..."
          )}
        </div>
      )}

      {selected.length > 0 && (
        <div className="fixed bottom-0 w-full p-2 text-center bg-white border-t border-gray-300">
          <div className="mb-1">
            현재까지 선택한 문항은 총{" "}
            <span className="font-medium text-lg text-indigo-600">
              {selected.length}
            </span>{" "}
            개 입니다
          </div>
          <div className="flex flex-col w-11/12 lg:container mx-auto lg:flex-row gap-1">
            <button
              className="block lg:basis-3/4 rounded p-2 text-white bg-indigo-500 hover:bg-indigo-700"
              onClick={e => saveIt()}
            >
              저장하기
            </button>
            <button
              className="block lg:basis-1/4 bg-red-500 hover:bg-red-700 text-white p-2 rounded"
              onClick={e => reset()}
            >
              처음부터
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SurveySample;
