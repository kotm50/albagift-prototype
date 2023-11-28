import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { db, storage } from "../../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { BiCheck } from "react-icons/bi";

import dayjs from "dayjs";
import SignaturePad from "react-signature-canvas";

function AdAgree() {
  let navi = useNavigate();
  const signatureRef = useRef(null);
  const scrollRef = useRef(null);
  let now = dayjs().locale("ko");
  const { gid } = useParams();

  const [todayDate, setTodayDate] = useState("");

  const [alias, setAlias] = useState("");

  const [name, setName] = useState("");
  const [comp, setComp] = useState("");

  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);
  const [agree4, setAgree4] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const saveSignature = async () => {
    if (signatureRef.current) {
      const signatureDataURL = signatureRef.current.toDataURL("image/png");
      // Upload signature image to Firebase Storage
      const today = new Date().toISOString().slice(0, 10);
      const filePath = `sign/${today}/${alias}/${Date.now()}.png`;
      const storageRef = ref(storage, filePath);
      const signatureBlob = dataURLToBlob(signatureDataURL);
      await uploadBytes(storageRef, signatureBlob);

      // Get the download URL and save it to Firestore
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    }
  };

  const dataURLToBlob = dataURL => {
    const binaryString = atob(dataURL.split(",")[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: "image/png" });
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  useEffect(() => {
    setTodayDate(now.format("YYYY년 MM월 DD일"));
    getAlias(gid);
    //eslint-disable-next-line
  }, []);

  const getAlias = async gid => {
    let result = await getDoc(doc(db, "adAgreeSign", gid));
    if (result.data()?.signed) {
      alert("이미 작성된 동의서 입니다. 관리자에게 문의해 주세요");
      navi("/error");
    }
    setAlias(result.data().alias);
  };

  const handleCheckboxChange = (index, event) => {
    const isChecked = event.target.checked;

    switch (index) {
      case 1:
        setAgree1(isChecked);
        break;
      case 2:
        setAgree2(isChecked);
        break;
      case 3:
        setAgree3(isChecked);
        break;
      case 4:
        setAgree4(isChecked);
        break;
      default:
        break;
    }
  };

  const handleSelectAllChange = event => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setAgree1(isChecked);
    setAgree2(isChecked);
    setAgree3(isChecked);
    setAgree4(isChecked);
  };

  const scrollToBottom = () => {
    const { current } = scrollRef;
    if (current) {
      const divPosition = current.offsetTop; // 특정 div의 위치(offsetTop)를 가져옵니다.
      window.scrollTo({
        top: divPosition,
        behavior: "smooth", // 스크롤 애니메이션을 부드럽게 적용합니다. 필요에 따라 제거할 수도 있습니다.
      });
    }
  };

  const submit = async () => {
    let confirm = window.confirm("동의서를 제출하시겠습니까?");
    if (confirm) {
      let url = await saveSignature();

      let body = {
        agree1: agree1,
        agree2: agree2,
        agree3: agree3,
        agree4: agree4,
        name: name,
        company: comp,
        sign: url,
        signed: true,
        date: todayDate,
        updated: serverTimestamp(),
      };

      const agreeRef = doc(db, "adAgreeSign", gid);
      try {
        await setDoc(agreeRef, body, { merge: true });
        alert("제출이 완료되었습니다. 감사합니다.");
        navi(`/agreeresult/${gid}`);
      } catch (error) {
        console.error(
          "Firestore에 값을 저장하는 중 오류가 발생했습니다:",
          error
        );
        alert("제출 중 오류가 발생했습니다. 관리자에게 문의해주세요");
      }
    }
  };

  return (
    <>
      <div className="xl:container xl:mx-auto px-2 py-2 xl:py-5">
        <div className="p-5 w-full xl:w-5/6 bg-white rounded-lg drop-shadow-xl mx-auto">
          <h1 className="text-center text-xl xl:text-3xl font-bold">
            코리아티엠 광고 진행에 대한 이용동의
          </h1>
          <div className="my-2 text-base text-center">
            광고진행과 채용효율 증진을 위해, <br className="xl:hidden block" />
            아래 내용에 대해 동의를 요청합니다
          </div>
          <div className="bg-gray-50 border">
            <ol className="flex flex-col divide-y">
              <li className="xl:text-lg flex flex-row flex-nowrap justify-between">
                <div className="basis-5/6 xl:basis-11/12 p-2 border-r">
                  광고에 대한 이해가 선행되어야, 원활한 면접진행이 가능함을 알고
                  있으며 광고 문구 등에 대해{" "}
                  <strong className="block xl:inline">
                    &lt;이해 및 동의 합니다.&gt;
                  </strong>
                </div>
                <div className="basis-1/6 xl:basis-1/12 p-1 text-center">
                  <label>
                    <input
                      className="hidden peer"
                      id="agreeCheckbox1"
                      type="checkbox"
                      checked={agree1}
                      onChange={e => handleCheckboxChange(1, e)}
                    />
                    <div className="transition duration-300 ease-in-out text-gray-300 peer-checked:text-white peer-checked:bg-teal-500 py-2 px-1 rounded-lg h-full flex flex-col justify-center">
                      동의
                    </div>
                  </label>
                </div>
              </li>
              <li className="xl:text-lg flex flex-row flex-nowrap justify-between">
                <div className="basis-5/6 xl:basis-11/12 p-2 border-r">
                  광고변경 요청시, 광고팀과 사전 상의하며 / 광고팀의 의견과
                  반하는 광고로 변경시, 이로 인해 발생될 수 있는{" "}
                  <strong className="block xl:inline">
                    &lt;지원율의 저조도 감수 합니다.&gt;
                  </strong>
                </div>

                <div className="basis-1/6 xl:basis-1/12 p-1 text-center">
                  <label>
                    <input
                      className="hidden peer"
                      id="agreeCheckbox1"
                      type="checkbox"
                      checked={agree2}
                      onChange={e => handleCheckboxChange(2, e)}
                    />
                    <div className="transition duration-300 ease-in-out text-gray-300 peer-checked:text-white peer-checked:bg-teal-500 py-2 px-1 rounded-lg h-full flex flex-col justify-center">
                      동의
                    </div>
                  </label>
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

                <div className="basis-1/6 xl:basis-1/12 p-1 text-center">
                  <label>
                    <input
                      className="hidden peer"
                      id="agreeCheckbox1"
                      type="checkbox"
                      checked={agree3}
                      onChange={e => handleCheckboxChange(3, e)}
                    />
                    <div className="transition duration-300 ease-in-out text-gray-300 peer-checked:text-white peer-checked:bg-teal-500 py-2 px-1 rounded-lg h-full flex flex-col justify-center">
                      동의
                    </div>
                  </label>
                </div>
              </li>
              <li className="xl:text-lg flex flex-row flex-nowrap justify-between">
                <div className="basis-5/6 xl:basis-11/12 p-2 border-r">
                  광고 저작물을 존중하여 광고를{" "}
                  <strong className="block xl:inline">
                    &lt;도용 및 유출 하지 않겠습니다&gt;
                  </strong>
                </div>

                <div className="basis-1/6 xl:basis-1/12 p-1 text-center">
                  <label>
                    <input
                      className="hidden peer"
                      id="agreeCheckbox1"
                      type="checkbox"
                      checked={agree4}
                      onChange={e => handleCheckboxChange(4, e)}
                    />
                    <div className="transition duration-300 ease-in-out text-gray-300 peer-checked:text-white peer-checked:bg-teal-500 py-2 px-1 rounded-lg h-full flex flex-col justify-center">
                      동의
                    </div>
                  </label>
                </div>
              </li>
            </ol>
          </div>
          <div className="my-2 xl:text-lg text-left p-1 border">
            <label>
              <input
                className="hidden peer"
                id="agreeCheckbox1"
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
              <div className="transition duration-300 ease-in-out text-black peer-checked:text-white peer-checked:bg-teal-500 p-2 flex flex-row justify-between rounded-lg">
                <div className="flex flex-col justify-center">
                  위 내용에 전부 동의합니다
                </div>
                <div className="text-white xl:text-right flex flex-col justify-center">
                  <BiCheck size={28} />
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className="p-5 w-full xl:w-5/6 bg-white rounded-lg drop-shadow-xl mt-5">
          <div className="my-2 xl:text-right text-xl">{todayDate}</div>
          <div className="my-2 xl:text-right xl:text-xl">
            지점명
            <input
              type="text"
              className="px-2 ml-2 border-b max-w-full"
              onChange={e => setComp(e.currentTarget.value)}
              placeholder="여기를 눌러 지점명을 입력하세요"
              value={comp}
            />
          </div>
          <div className="my-2 xl:text-right xl:text-xl">
            동의자
            <input
              type="text"
              className="px-2 ml-2 border-b  max-w-full"
              placeholder="여기를 눌러 이름을 입력하세요"
              onChange={e => setName(e.currentTarget.value)}
              value={name}
            />
          </div>
          <div className="w-full xl:text-right">
            <div className="w-full flex flex-row flex-nowrap justify-between">
              <button
                className="my-2 p-2 bg-indigo-500 text-white tounded-lg"
                onClick={clearSignature}
              >
                서명 다시하기
              </button>
              <button
                className="my-2 p-2 bg-orange-500 text-white tounded-lg"
                onClick={e => scrollToBottom()}
              >
                제출하기
              </button>
            </div>
            <SignaturePad
              ref={signatureRef}
              canvasProps={{
                className: "signature-canvas",
              }}
            />
          </div>
        </div>
        <div
          ref={scrollRef}
          className="p-5 w-full xl:w-5/6 bg-white rounded-lg drop-shadow-xl mt-5"
        >
          <button
            className="container mx-auto p-2 bg-teal-500 text-white rounded-lg"
            onClick={e => submit()}
          >
            동의서 제출하기
          </button>
        </div>
      </div>
    </>
  );
}

export default AdAgree;
