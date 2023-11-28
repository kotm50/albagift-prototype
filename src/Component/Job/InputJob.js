import React, { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import Loading from "../Loading";
import InputArea from "./InputArea";
import InputWelfare from "./InputWelfare";
import InputLogo from "./InputLogo";
import InputAd from "./InputAd";
import InputPhone from "../InputPhone";

import { sectors, salaries, modules } from "./Data";

import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

function InputJob() {
  const { jid } = useParams();
  const user = useSelector(state => state.user);
  let navi = useNavigate();

  const [correct, setCorrect] = useState(false);
  const [cName, setCName] = useState("");
  const [cNum, setCNum] = useState("");
  const [cCode, setCCode] = useState("");
  const [cLogo, setCLogo] = useState("");
  const [cLogoTask, setCLogoTask] = useState(null);
  const [adImg, setAdImg] = useState("");
  const [adImgTask, setAdImgTask] = useState(null);
  const [adDetail, setAdDetail] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");
  const [town, setTown] = useState("");
  const [deadLine, setDeadLine] = useState("");
  const [manager, setManager] = useState("");
  const [call, setCall] = useState("");
  const [template, setTemplate] = useState("");
  const [day, setDay] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [salary, setSalary] = useState("");
  const [welfare, setWelfare] = useState([]);
  const [premium, setPremium] = useState(false);
  const [gold, setGold] = useState(false);
  const [silver, setSilver] = useState(false);
  const [bronze, setBronze] = useState(true);
  const [timeCon, setTimeCon] = useState(false);
  const [ageCon, setAgeCon] = useState(false);
  const [career, setCareer] = useState("");
  const [educate, setEducate] = useState("");
  const [gender, setGender] = useState("");
  const [interview, setInterview] = useState(0);
  const [interviewDetail, setInterviewDetail] = useState("");
  const [keyWord, setKeyWord] = useState("");
  const [keyWords, setKeyWords] = useState([]);

  useEffect(() => {
    if (jid !== undefined) {
      getJob(jid);
    }
    chkAdmin(user);
    // eslint-disable-next-line
  }, []);

  const getJob = async jid => {
    const modifyRef = doc(collection(db, "jobs"), jid);
    let jobs = await getDoc(modifyRef);
    let result = jobs.data();
    setTitle(result.title ?? "");
    setSubtitle(result.subtitle ?? "");
    setCNum(result.cNum ?? "");
    setCName(result.cName ?? "");
    setCLogo(result.cLogo ?? "");
    setCLogoTask(result.cLogoTask ?? "");
    setCCode(result.cCode ?? "");
    setAdImg(result.adImg ?? "");
    setAdImgTask(result.adImgTask ?? "");
    setAdDetail(result.adDetail ?? "");
    setSector(result.sector ?? "");
    setCity(result.city ?? "");
    setTown(result.town ?? "");
    setDeadLine(result.deadLine ?? "");
    setManager(result.manager ?? "");
    setCall(result.call ?? "");
    setTemplate(result.template ?? "");
    setCareer(result.career ?? "");
    setEducate(result.educate ?? "");
    setGender(result.gender ?? "");
    setMinAge(result.minage ?? "");
    setMaxAge(result.maxage ?? "");
    setAgeCon(result.agecon ?? false);
    setDay(result.day ?? "");
    setStart(result.start ?? "");
    setEnd(result.end ?? "");
    setTimeCon(result.timecon ?? false);
    setSalaryType(result.salaryType ?? "");
    setSalary(result.salary ?? "");
    setWelfare(result.welfare ?? []);
    setPremium(result.premium ?? false);
    setGold(result.gold ?? false);
    setSilver(result.silver ?? false);
    setBronze(result.bronze ?? false);
    setInterview(result.inteview ?? "");
    setKeyWords(result.keywords ?? []);
    setKeyWord(result.keywords.join(",") ?? "");
    setInterview(result.interview ?? "");
    setInterviewDetail(result.interviewdetail ?? "");
  };

  const chkAdmin = user => {
    setTimeout(() => {
      if (!user.admin) {
        alert("관리자 로그인이 필요합니다");
        navi("/adminlogin");
      } else {
        setCorrect(true);
      }
    }, 1000);
  };

  const setJob = async () => {
    const docRef = await addDoc(collection(db, "jobs"), {
      alias: cNum,
      name: cName,
    });
    let body = {
      title: title, // 공고제목
      subtitle: subtitle, // 공고제목
      cName: cName, // 회사명
      cNum: cNum, // 고유번호
      cLogo: cLogo, // 로고이미지
      cLogoTask: cLogoTask, // 로고이미지태스크(스토리지 관리용)
      cCode: cCode, // 고객사코드
      adImg: adImg, // 광고이미지
      adImgTask: adImgTask, // 광고이미지태스크(스토리지관리용)
      adDetail: adDetail, // 광고상세내용(텍스트 입력)
      sector: sector, // 업종
      city: city, // 특별시/광역시/자치시/도
      town: town, // 시/군/구
      deadLine: deadLine, // 모집마감일
      manager: manager, // 채용담당자
      call: call, // 채용담당자 연락처
      template: template, // 문자지원양식
      career: career, // 경력사항
      educate: educate, // 학력
      gender: gender, // 성별
      minage: minAge, // 최소연령
      maxage: maxAge, // 최대연령
      agecon: ageCon, // 연령무관
      day: day, // 근무요일
      start: start, // 근무시작시간
      end: end, // 근무종료시간
      timecon: timeCon, // 시간 협의 가능
      salaryType: salaryType, // 급여종류(시급, 월급, 연봉 등)
      salary: salary, // 급여액
      welfare: welfare, // 복지현황
      premium: premium, // 프리미엄 여부
      gold: gold, // 골드등급 여부
      silver: silver, // 실버등급 여부
      bronze: bronze, // 브론즈등급 여부
      keywords: keyWords, // 검색키워드(배열)
      interview: interview, // 면접비
      interviewdetail: interviewDetail, // 면접비 상세조건
      created: serverTimestamp(), // 생성시간
      updated: serverTimestamp(),
      interest: 0,
    };
    let docId = docRef.id;
    const jobRef = collection(db, "jobs");
    await setDoc(doc(jobRef, `${docId}`), body);
    const companyRef = collection(db, "companies");
    let getCompany = await getDoc(doc(companyRef, `${cNum}`));
    if (getCompany.data() === undefined) {
      await setDoc(doc(companyRef, `${cNum}`), {
        cCode: cCode,
        jobs: [docId],
        ads: [{ url: adImg, ref: adImgTask }],
      });
    } else {
      let jobs = getCompany.data().jobs;
      let ads = getCompany.data().ads;
      jobs.push(docId);
      ads.push({
        url: adImg,
        ref: adImgTask,
      });
      await setDoc(doc(companyRef, `${cNum}`), {
        cCode: cCode,
        jobs: jobs,
        ads: ads,
      });
    }
    alert("광고가 등록되었습니다");
    navi(`/jobdetail/${docId}`);
  };

  const updateJob = async () => {
    let body = {
      title: title, // 공고제목
      subtitle: subtitle, // 공고제목
      cName: cName, // 회사명
      cNum: cNum, // 고유번호
      cLogo: cLogo, // 로고이미지
      cLogoTask: cLogoTask, // 로고이미지태스크(스토리지 관리용)
      cCode: cCode, // 고객사코드
      adImg: adImg, // 광고이미지
      adImgTask: adImgTask, // 광고이미지태스크(스토리지관리용)
      adDetail: adDetail, // 광고상세내용(텍스트 입력)
      sector: sector, // 업종
      city: city, // 특별시/광역시/자치시/도
      town: town, // 시/군/구
      deadLine: deadLine, // 모집마감일
      manager: manager, // 채용담당자
      call: call, // 채용담당자 연락처
      template: template, // 문자지원양식
      career: career, // 경력사항
      educate: educate, // 학력
      gender: gender, // 성별
      minage: minAge, // 최소연령
      maxage: maxAge, // 최대연령
      agecon: ageCon, // 연령무관
      day: day, // 근무요일
      start: start, // 근무시작시간
      end: end, // 근무종료시간
      timecon: timeCon, // 시간 협의 가능
      salaryType: salaryType, // 급여종류(시급, 월급, 연봉 등)
      salary: salary, // 급여액
      welfare: welfare, // 복지현황
      premium: premium, // 프리미엄 여부
      gold: gold, // 골드등급 여부
      silver: silver, // 실버등급 여부
      bronze: bronze, // 브론즈등급 여부
      keywords: keyWords, // 검색키워드(배열)
      interview: interview, // 면접비
      interviewdetail: interviewDetail, // 면접비 상세조건
      created: serverTimestamp(), // 생성시간
      updated: serverTimestamp(),
      interest: 0,
    };
    console.log(body);
    const jobRef = collection(db, "jobs");
    await updateDoc(doc(jobRef, `${jid}`), body);
    const companyRef = collection(db, "companies");
    let getCompany = await getDoc(doc(companyRef, `${cNum}`));
    let jobs = getCompany.data().jobs;
    let ads = getCompany.data().ads;
    jobs.push(jid);
    ads.push({
      url: adImg,
      ref: adImgTask,
    });
    await updateDoc(doc(companyRef, `${cNum}`), {
      cCode: cCode,
      jobs: jobs,
      ads: ads,
    });
    alert("광고가 등록되었습니다");
    navi(`/jobdetail/${jid}`);
  };

  return (
    <>
      {!correct ? (
        <Loading />
      ) : (
        <>
          <div className="w-11/12 lg:container mx-auto bg-white p-2 mb-3 rounded-xl drop-shadow-xl">
            <h1 className="text-3xl font-medium text-center text-indigo-900">
              채용공고 등록
            </h1>
          </div>
          <div className="w-11/12 lg:container mx-auto bg-white p-2 mb-3 rounded-xl drop-shadow-xl">
            <div id="inputTitle" className="text-lg">
              <div className="p-2 bg-gray-200 font-medium">
                <h3>
                  <label htmlFor="title">채용광고 제목을 입력하세요</label>
                </h3>
              </div>
              <div className="p-2 pb-3 bg-gray-100">
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                  placeholder="여기를 눌러서 제목을 입력해 주세요"
                  value={title}
                  onChange={e => setTitle(e.currentTarget.value)}
                  onBlur={e => setTitle(e.currentTarget.value)}
                />
              </div>
            </div>
            <div id="inputSubTitle" className="text-lg">
              <div className="p-2 bg-gray-200 font-medium">
                <h3>
                  <label htmlFor="title">소제목을 입력하세요</label>
                </h3>
              </div>
              <div className="p-2 pb-3 bg-gray-100">
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                  placeholder="여기를 눌러서 소제목을 입력해 주세요"
                  value={subtitle}
                  onChange={e => setSubtitle(e.currentTarget.value)}
                  onBlur={e => setSubtitle(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>
          <div className="w-11/12 lg:container mx-auto p-2 bg-white rounded-lg drop-shadow-lg mb-3">
            <h2 className="text-3xl font-medium text-left pb-2 border-b-2 border-gray-500 my-2">
              회사(근무지) 정보
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-3">
                <div id="inputCNum" className="text-lg">
                  <div className="p-2 bg-gray-200 font-medium">
                    <h3>
                      <label htmlFor="cNum">
                        폼메일 고유번호를 입력해 주세요
                        <small className="font-normal ml-2">
                          내부채용의 경우 0000을 입력하세요
                        </small>
                      </label>
                    </h3>
                  </div>
                  <div className="p-2 pb-3 bg-gray-100">
                    <input
                      type="text"
                      id="cNum"
                      name="cNum"
                      className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                      placeholder="여기를 눌러서 고유번호를 입력해 주세요"
                      value={cNum}
                      onChange={e => setCNum(e.currentTarget.value)}
                      onBlur={e => setCNum(e.currentTarget.value)}
                    />
                  </div>
                </div>
                <div id="inputCCode" className="text-lg">
                  <div className="p-2 bg-gray-200 font-medium">
                    <h3>
                      <label htmlFor="cNum">
                        폼메일 고객사코드를 입력하세요(c로 시작하는 코드)
                        <small className="font-normal ml-2">
                          폼메일 고객사 리스트에서 확인 가능
                        </small>
                      </label>
                    </h3>
                  </div>
                  <div className="p-2 pb-3 bg-gray-100">
                    <input
                      type="text"
                      id="cCode"
                      name="cCode"
                      className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                      placeholder="여기를 눌러서 코드를 입력해 주세요"
                      value={cCode}
                      onChange={e => setCCode(e.currentTarget.value)}
                      onBlur={e => setCCode(e.currentTarget.value)}
                    />
                  </div>
                </div>
              </div>
              <div id="inputCName" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="cName">회사명을 입력해 주세요</label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100">
                  <input
                    type="text"
                    id="cName"
                    name="cName"
                    className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                    placeholder="여기를 눌러서 회사명을 입력해 주세요"
                    value={cName}
                    onChange={e => setCName(e.currentTarget.value)}
                    onBlur={e => setCName(e.currentTarget.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-3">
                <div id="inputSector" className="text-lg">
                  <div className="p-2 bg-gray-200 font-medium">
                    <h3>
                      <label htmlFor="sector">업/직종을 선택하세요</label>
                    </h3>
                  </div>
                  <div className="p-2 pb-3 bg-gray-100">
                    <select
                      id="sector"
                      className={
                        sector === ""
                          ? "block mb-2 font-medium text-gray-400 w-full h-12 p-2 p shadow-sm"
                          : "block mb-2 font-medium  w-full h-12 p-2 p shadow-sm"
                      }
                      value={sector || ""}
                      onChange={e => setSector(e.currentTarget.value)}
                      onKeyDown={e => {
                        return false;
                      }}
                    >
                      <option value="" className="text-gray-400 ">
                        업/직종을 선택하세요
                      </option>
                      {sectors.map(([title, idx]) => (
                        <option value={title} className="text-black" key={idx}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <InputArea
                  city={city}
                  setCity={setCity}
                  town={town}
                  setTown={setTown}
                />
              </div>
              <div id="inputCLogo" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="cName">
                      로고를 업로드 해 주세요
                      <small className="ml-2 font-normal">
                        가로 500px, 세로 200px로 작성해서 올려주세요
                      </small>
                    </label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100">
                  <InputLogo
                    cNum={cNum}
                    cLogo={cLogo}
                    setCLogo={setCLogo}
                    cLogoTask={cLogoTask}
                    setCLogoTask={setCLogoTask}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-11/12 lg:container mx-auto p-2 bg-white rounded-lg drop-shadow-lg mb-3">
            <h2 className="text-3xl font-medium text-left pb-2 border-b-2 border-gray-500 my-2">
              지원자격
            </h2>
            <div className="flex flex-col gap-3">
              <div id="inputGender" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="gender">성별을 선택해주세요</label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100">
                  <div className="flex flex-col lg:flex-row flex-wrap">
                    {["여성", "남성", "성별무관"].map((ans, idx) => (
                      <div className="basis-1/3 p-2" key={idx}>
                        <div className="border rounded p-2 bg-white">
                          <input
                            type="radio"
                            value={ans}
                            id={ans}
                            name="gender"
                            className="peer hidden"
                            onChange={e => {
                              setGender(e.currentTarget.value);
                            }}
                            checked={ans === gender}
                          />
                          <label
                            htmlFor={ans}
                            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-indigo-500"
                          >
                            {ans}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div id="inputCareer" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="career">경력사항을 선택해주세요</label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100">
                  <div className="flex flex-col lg:flex-row flex-wrap">
                    {["신입", "경력", "경력무관"].map((ans, idx) => (
                      <div className="basis-1/3 p-2" key={idx}>
                        <div className="border rounded p-2 bg-white">
                          <input
                            type="radio"
                            value={ans}
                            id={ans}
                            name="career"
                            className="peer hidden"
                            onChange={e => setCareer(e.currentTarget.value)}
                            checked={ans === career}
                          />
                          <label
                            htmlFor={ans}
                            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-indigo-500"
                          >
                            {ans}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div id="inputAge" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="minage">
                      지원 가능연령대를 선택해주세요
                    </label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100 grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    min="19"
                    max="99"
                    id="minage"
                    name="minage"
                    className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                    placeholder="최소 연령대를 입력하세요"
                    value={minAge}
                    onChange={e => setMinAge(e.currentTarget.value)}
                    onBlur={e => setMinAge(e.currentTarget.value)}
                    disabled={ageCon}
                  />
                  <input
                    type="number"
                    min="19"
                    max="99"
                    id="maxage"
                    name="maxage"
                    className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                    placeholder="최고 연령대를 입력하세요"
                    value={maxAge}
                    onChange={e => setMaxAge(e.currentTarget.value)}
                    onBlur={e => setMaxAge(e.currentTarget.value)}
                    disabled={ageCon}
                  />
                  <div className="bg-gray-100">
                    <div className="bg-white p-0 shadow w-full rounded">
                      <input
                        type="checkbox"
                        value="age"
                        id="age"
                        name="ageChk"
                        className="peer hidden"
                        onChange={e => setAgeCon(e.currentTarget.checked)}
                        checked={ageCon}
                      />
                      <label
                        htmlFor="age"
                        className="transition duration-150 md:p-2 text-sm text-center ease-in-out font-medium bg-white text-stone-900  peer-checked:text-white peer-checked:bg-teal-500 flex flex-row justify-center"
                      >
                        <div className="p-1 noDrag text-base md:text-lg">
                          연령무관
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div id="inputEdu" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="educate">학력사항을 선택해주세요</label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100">
                  <div className="flex flex-col lg:flex-row flex-wrap">
                    {["중졸이하", "고졸", "초대졸", "대졸", "학력무관"].map(
                      (ans, idx) => (
                        <div className="basis-1/3 p-2" key={idx}>
                          <div className="border rounded p-2 bg-white">
                            <input
                              type="radio"
                              value={ans}
                              id={ans}
                              name="educate"
                              className="peer hidden"
                              onChange={e => setEducate(e.currentTarget.value)}
                              checked={ans === educate}
                            />
                            <label
                              htmlFor={ans}
                              className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-indigo-500"
                            >
                              {ans}
                            </label>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-11/12 lg:container mx-auto p-2 bg-white rounded-lg drop-shadow-lg mb-3">
            <h2 className="text-3xl font-medium text-left pb-2 border-b-2 border-gray-500 my-2">
              근무조건
            </h2>
            <div className="flex flex-col gap-3">
              <div id="inputDate" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="day">근무요일을 입력해 주세요</label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100">
                  <div className="flex flex-col lg:flex-row flex-wrap">
                    {[
                      "월~금",
                      "월~토",
                      "주1일",
                      "주2일",
                      "주3일",
                      "주4일",
                      "주5일",
                      "주6일",
                      "요일협의",
                    ].map((ans, idx) => (
                      <div className="basis-1/3 p-2" key={idx}>
                        <div className="border rounded p-2 bg-white">
                          <input
                            type="radio"
                            value={ans}
                            id={ans}
                            name={day}
                            className="peer hidden"
                            onChange={e => setDay(e.currentTarget.value)}
                            checked={ans === day}
                          />
                          <label
                            htmlFor={ans}
                            className="block transition duration-150 md:p-2 text-sm py-2 text-center ease-in-out rounded lg:text-base xl:text-lg bg-white text-stone-900  peer-checked:text-white peer-checked:bg-indigo-500"
                          >
                            {ans}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div id="inputTime" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor={start.legnth > 4 ? "end" : "start"}>
                      근무시간을 입력해 주세요
                      <small className="ml-2 font-normal">
                        입력창 오른쪽 시계 아이콘을 눌러주세요
                      </small>
                    </label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100 grid grid-cols-3 gap-2">
                  <input
                    type="time"
                    id="start"
                    name="start"
                    className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                    value={start}
                    onChange={e => setStart(e.currentTarget.value)}
                    onBlur={e => setStart(e.currentTarget.value)}
                    disabled={timeCon}
                  />
                  <input
                    type="time"
                    id="end"
                    name="end"
                    className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                    placeholder="종료시간을 입력하세요. 예)18:00"
                    value={end}
                    onChange={e => setEnd(e.currentTarget.value)}
                    onBlur={e => setEnd(e.currentTarget.value)}
                    disabled={timeCon}
                  />
                  <div className="bg-gray-100">
                    <div className="bg-white p-0 shadow w-full rounded">
                      <input
                        type="checkbox"
                        value="timer"
                        id="timer"
                        name="timeChk"
                        className="peer hidden"
                        onChange={e => setTimeCon(e.currentTarget.checked)}
                        checked={timeCon}
                      />
                      <label
                        htmlFor="timer"
                        className="transition duration-150 md:p-2 text-sm text-center ease-in-out font-medium bg-white text-stone-900  peer-checked:text-white peer-checked:bg-teal-500 flex flex-row justify-center"
                      >
                        <div className="p-1 noDrag text-base md:text-lg">
                          시간협의 가능
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div id="inputSalary" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor={salaryType === "" ? "salaries" : "salary"}>
                      급여조건을 입력하세요
                    </label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100 flex flex-nowrap gap-2">
                  <select
                    id="salaries"
                    className={
                      salaryType === ""
                        ? "block mb-2 font-medium text-gray-400 w-full h-12 p-2 p shadow-sm basis-1/4"
                        : "block mb-2 font-medium  w-full h-12 p-2 p shadow-sm basis-1/4"
                    }
                    value={salaryType || ""}
                    onChange={e => setSalaryType(e.currentTarget.value)}
                  >
                    <option value="" className="text-gray-400 ">
                      급여 종류
                    </option>
                    {salaries.map(([title, idx]) => (
                      <option value={title} className="text-black" key={idx}>
                        {title}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm basis-3/4"
                    placeholder="'원'을 빼고 숫자만 입력하세요. 예) 300만원(x) 300만(x) 3000000(o)"
                    value={salary}
                    onChange={e => setSalary(e.currentTarget.value)}
                    onBlur={e => setSalary(e.currentTarget.value)}
                  />
                </div>
              </div>
              <div id="inputWelfare" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor={salaryType === "" ? "salaries" : "salary"}>
                      복리후생을 골라주세요
                    </label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100  flex flex-row flex-wrap gap-2">
                  <InputWelfare welfare={welfare} setWelfare={setWelfare} />
                </div>
              </div>
            </div>
          </div>
          <div className="w-11/12 lg:container mx-auto p-2 bg-white rounded-lg drop-shadow-lg mb-3">
            <h2 className="text-3xl font-medium text-left pb-2 border-b-2 border-gray-500 my-2">
              모집상세
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-3">
                <div id="inputManager" className="text-lg">
                  <div className="p-2 bg-gray-200 font-medium">
                    <h3>
                      <label htmlFor="manager">채용담당자를 입력하세요</label>
                    </h3>
                  </div>
                  <div className="p-2 pb-3 bg-gray-100">
                    <input
                      type="text"
                      id="manager"
                      name="manager"
                      className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                      placeholder="이름 직책을 입력하세요. 예) 김은영 실장"
                      value={manager}
                      onChange={e => setManager(e.currentTarget.value)}
                      onBlur={e => setManager(e.currentTarget.value)}
                    />
                  </div>
                </div>
                <InputPhone phone={call} setPhone={setCall} Job={true} />
                <div id="inputTemplate" className="text-lg">
                  <div className="p-2 bg-gray-200 font-medium">
                    <h3>
                      <label htmlFor="template">문자양식을 입력해주세요</label>
                    </h3>
                  </div>
                  <div className="p-2 pb-3 bg-gray-100">
                    <input
                      type="text"
                      id="template"
                      name="template"
                      className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                      placeholder="예) [이름/성별/연락처/거주지]"
                      value={template}
                      onChange={e => setTemplate(e.currentTarget.value)}
                      onBlur={e => setTemplate(e.currentTarget.value)}
                    />
                  </div>
                </div>
                <div id="inputDeadLine" className="text-lg">
                  <div className="p-2 bg-gray-200 font-medium">
                    <h3>
                      <label htmlFor="deadLine">
                        모집마감일을 정해주세요
                        <small className="ml-2 font-normal">
                          입력창 오른쪽 달력 아이콘을 눌러주세요
                        </small>
                      </label>
                    </h3>
                  </div>
                  <div className="p-2 pb-3 bg-gray-100">
                    <input
                      type="date"
                      id="deadLine"
                      name="deadLine"
                      className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                      value={deadLine}
                      onChange={e => setDeadLine(e.currentTarget.value)}
                      onBlur={e => setDeadLine(e.currentTarget.value)}
                    />
                  </div>
                </div>
              </div>
              <div id="inputAd" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="ad">채용공고 이미지를 올려주세요</label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100">
                  <InputAd
                    cNum={cNum}
                    adImg={adImg}
                    setAdImg={setAdImg}
                    adImgTask={adImgTask}
                    setAdImgTask={setAdImgTask}
                  />
                </div>
              </div>
              <div id="inputAdDetail" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="ad">공고 상세내용을 입력해 주세요</label>
                  </h3>
                </div>
                <div id="adDetail" className="p-2 pb-3 bg-gray-100">
                  <ReactQuill
                    theme="snow"
                    value={adDetail}
                    onChange={setAdDetail}
                    modules={modules}
                  />
                </div>
              </div>
              <div id="inputKeyWords" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="keyword">
                      검색키워드를 입력하세요
                      <small className="ml-2 font-normal">
                        복수 키워드는 쉼표(,)로 구분하세요.
                        예시:재택가능,주4일제,조기퇴근
                      </small>
                    </label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100">
                  <input
                    type="text"
                    id="keyWord"
                    name="keyWord"
                    className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                    value={keyWord}
                    onChange={e => {
                      setKeyWord(e.currentTarget.value);
                      setKeyWords(e.currentTarget.value.split(","));
                    }}
                    onBlur={e => {
                      setKeyWord(e.currentTarget.value);
                      setKeyWords(e.currentTarget.value.split(","));
                    }}
                    placeholder="복수 키워드는 쉼표(,)로 구분하세요. 예시:재택가능,주4일제,조기퇴근"
                  />
                </div>
                {keyWords.length > 0 && (
                  <div className="bg-gray-100">
                    {keyWords[0] !== "" && (
                      <>
                        <div className="font-medium text-indigo-500 p-2">
                          입력한 키워드 목록
                        </div>
                        <div className="flex flex-wrap gap-1 p-2">
                          {keyWords.map((keyw, idx) => (
                            <div key={idx}>
                              {keyw !== "" && (
                                <div className="border rounded-full px-3 py-1 bg-white">
                                  #{keyw}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div id="inputInterview" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="interview">
                      면접비를 입력하세요
                      <small className="ml-2 font-normal">
                        숫자만 입력해 주세요. 예:2만원(x) 20000원(x) 20000(o)
                        미지급은 0
                      </small>
                    </label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100">
                  <input
                    type="text"
                    id="interview"
                    name="interview"
                    className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                    value={interview}
                    onChange={e => {
                      setInterview(Number(e.currentTarget.value));
                    }}
                    onBlur={e => {
                      setInterview(Number(e.currentTarget.value));
                    }}
                    placeholder="숫자만 입력해 주세요. 예:2만원(x) 20000원(x) 20000(o)"
                  />
                </div>
              </div>
              <div id="inputInterviewDetail" className="text-lg">
                <div className="p-2 bg-gray-200 font-medium">
                  <h3>
                    <label htmlFor="interview">
                      면접비 조건을 입력하세요
                      <small className="ml-2 font-normal">
                        예시 : 면접 후 바로지급, 교육참석시 지급 등
                      </small>
                    </label>
                  </h3>
                </div>
                <div className="p-2 pb-3 bg-gray-100">
                  <input
                    type="text"
                    id="interviewDetail"
                    name="interviewDetail"
                    className="block mb-2 font-medium text-stone-900 w-full h-12 p-2 p shadow-sm"
                    value={interviewDetail}
                    onChange={e => {
                      setInterviewDetail(e.currentTarget.value);
                    }}
                    onBlur={e => {
                      setInterviewDetail(e.currentTarget.value);
                    }}
                    placeholder="예시 : 면접 후 바로지급, 교육참석시 지급 등"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-11/12 lg:container mx-auto p-2 bg-white rounded-lg drop-shadow-lg mb-3">
            <h2 className="text-3xl font-medium text-left pb-2 border-b-2 border-gray-500 my-2">
              프리미엄
            </h2>
            <div className="p-2 bg-gray-100 mb-5">
              <div className="bg-white p-0 shadow w-full rounded">
                <input
                  type="checkbox"
                  value="true"
                  id="premium"
                  name="premiumChk"
                  className="peer hidden"
                  onChange={e => setPremium(e.currentTarget.checked)}
                  checked={premium ? true : false}
                />
                <label
                  htmlFor="premium"
                  className="transition duration-150 md:p-2 text-sm py-4 text-center ease-in-out rounded lg:text-base xl:text-lg font-medium bg-white text-stone-900  peer-checked:text-white peer-checked:bg-teal-500 flex flex-row justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-2 noDrag text-sm md:text-base">
                    {!premium
                      ? "프리미엄 광고라면 클릭해 주세요"
                      : "본 광고는 프리미엄 광고입니다."}
                  </p>
                </label>
              </div>
            </div>
            <div className="p-2 bg-gray-100 mb-5">
              <div className="bg-white p-0 shadow w-full rounded">
                <input
                  type="checkbox"
                  value="true"
                  id="gold"
                  name="goldChk"
                  className="peer hidden"
                  onChange={e => setGold(e.currentTarget.checked)}
                  checked={gold ? true : false}
                />
                <label
                  htmlFor="gold"
                  className="transition duration-150 md:p-2 text-sm py-4 text-center ease-in-out rounded lg:text-base xl:text-lg font-medium bg-white text-stone-900  peer-checked:text-white peer-checked:bg-teal-500 flex flex-row justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-2 noDrag text-sm md:text-base">
                    {!gold
                      ? "골드 광고라면 클릭해 주세요"
                      : "본 광고는 골드 광고입니다."}
                  </p>
                </label>
              </div>
            </div>
            <div className="p-2 bg-gray-100 mb-5">
              <div className="bg-white p-0 shadow w-full rounded">
                <input
                  type="checkbox"
                  value="true"
                  id="silver"
                  name="silverChk"
                  className="peer hidden"
                  onChange={e => setSilver(e.currentTarget.checked)}
                  checked={silver ? true : false}
                />
                <label
                  htmlFor="silver"
                  className="transition duration-150 md:p-2 text-sm py-4 text-center ease-in-out rounded lg:text-base xl:text-lg font-medium bg-white text-stone-900  peer-checked:text-white peer-checked:bg-teal-500 flex flex-row justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-2 noDrag text-sm md:text-base">
                    {!silver
                      ? "실버 광고라면 클릭해 주세요"
                      : "본 광고는 실버 광고입니다."}
                  </p>
                </label>
              </div>
            </div>
            <div className="p-2 bg-gray-100 mb-5">
              <div className="bg-white p-0 shadow w-full rounded">
                <input
                  type="checkbox"
                  value="true"
                  id="bronze"
                  name="bronzeChk"
                  className="peer hidden"
                  onChange={e => setBronze(e.currentTarget.checked)}
                  checked={bronze ? true : false}
                />
                <label
                  htmlFor="bronze"
                  className="transition duration-150 md:p-2 text-sm py-4 text-center ease-in-out rounded lg:text-base xl:text-lg font-medium bg-white text-stone-900  peer-checked:text-white peer-checked:bg-teal-500 flex flex-row justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="ml-2 noDrag text-sm md:text-base">
                    {!bronze
                      ? "브론즈 광고라면 클릭해 주세요"
                      : "본 광고는 브론즈 광고입니다."}
                  </p>
                </label>
              </div>
            </div>
          </div>
          <div className="w-11/12 lg:container mx-auto p-2 bg-white rounded-lg drop-shadow-lg mb-3">
            <button
              className="block w-full bg-indigo-500 hover:bg-indigo-700 text-white font-medium text-xl p-3 rounded-lg"
              onClick={e => {
                e.preventDefault();
                if (jid === undefined) {
                  setJob();
                } else {
                  updateJob();
                }
              }}
            >
              광고 등록하기
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default InputJob;
