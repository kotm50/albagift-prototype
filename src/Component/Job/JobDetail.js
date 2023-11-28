import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

import { db } from "../../firebase";
import { collection, getDoc, doc, deleteDoc } from "firebase/firestore";

import Loading from "../Loading";
import Contact from "../../Asset/contact/contact1.gif";
import Kakao from "../../Asset/contact/kakao1.gif";

import { AiOutlineSchedule } from "react-icons/ai";
import { FaGraduationCap } from "react-icons/fa";
import { TiBusinessCard } from "react-icons/ti";
import { MdPeopleAlt } from "react-icons/md";
import { FcBusinessman, FcBusinesswoman } from "react-icons/fc";

import ImgReload from "../ImgReload";

import dompurify from "dompurify";

function JobDetail() {
  const sanitizer = dompurify.sanitize;
  const { jid } = useParams();
  let navi = useNavigate();
  const user = useSelector(state => state.user);
  const [jobInfo, setJobInfo] = useState({});
  const [correct, setCorrect] = useState(false);
  const [dDay, setDDay] = useState(null);
  const [phone, setPhone] = useState(null);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (jid === undefined) {
      alert("잘못된 경로로 접속하셨습니다, 메인으로 돌아갑니다");
      navi("/");
    }
    setAdmin(user.admin);
    getJobInfo(jid);
    // eslint-disable-next-line
  }, []);
  const getJobInfo = async e => {
    const jobRef = await getDoc(doc(collection(db, "jobs"), `${jid}`));
    setJobInfo(jobRef.data());
    if (jobInfo !== {}) {
      setCorrect(true);
      const deadLine = new Date(jobRef.data().deadLine);
      const today = new Date();
      const diff = deadLine - today;
      const diifDay = Math.floor(diff / (1000 * 60 * 60 * 24));
      const call = jobRef
        .data()
        .call.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
      setPhone(call);
      setDDay(diifDay);
    }
  };

  const deleteJob = async () => {
    console.log(jid);
    let real = window.confirm("삭제하면 복구할 수 없습니다. 정말 삭제할까요?");
    if (real) {
      await deleteDoc(doc(db, "jobs", jid));
    }
    alert("삭제가 완료되었습니다");
    navi("/");
  };
  return (
    <>
      {!correct ? (
        <Loading />
      ) : (
        <>
          <Helmet>
            <title>{jobInfo.title}</title>
            <meta name="description" content={jobInfo.title} />
            <meta property="og:image" content={jobInfo.cLogo} />
            <meta
              property="og:url"
              content={`https://koreatm.cf/jobdetail/${jid}`}
            />
            <meta name="og:title" content={jobInfo.title} />
            <meta name="og:description" content={jobInfo.title} />
          </Helmet>
          <div>
            <div className="lg:block mx-auto lg:container w-11/12 mb-5">
              <div className="flex flex-col lg:flex-row gap-3 mt-2">
                <div className="lg:basis-3/4 flex flex-col">
                  <div className="p-2 border border-gray-200 bg-white">
                    <div className="flex justify-between">
                      <h3 className="text-sm lg:text-xl text-gray-500 lg:pl-5">
                        {jobInfo.subtitle}
                      </h3>
                      <div className="hidden lg:block mr-3 text-sm border py-2 px-3 text-center bg-indigo-50 rounded-full">
                        모집종료까지 <strong>{dDay}</strong>일 남음
                      </div>
                    </div>
                    <h2 className="text-lg lg:text-3xl font-medium  border-b border-gray-200 pb-5 mb-5 lg:pl-5">
                      {jobInfo.title}
                    </h2>
                    <div className="hidden lg:grid grid-cols-5 gap-2 pb-5 pt-4">
                      <div className="p-2">
                        <div className="mx-auto my-auto w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-indigo-500 text-white text-center text-lg p-3 align-middle leading-5 flex flex-col justify-center">
                          <div className="text-2xl font-medium">
                            {jobInfo.salaryType}
                          </div>
                        </div>
                        <div className="text-center text-lg my-3">
                          {jobInfo.salary}원
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="mx-auto my-auto w-20 h-20 lg:w-24 lg:h-24 text-center text-lg p-3 align-middle leading-5 flex flex-col justify-center text-indigo-500">
                          <AiOutlineSchedule size="72" />
                        </div>
                        <div className="text-center text-lg my-3">
                          {jobInfo.day}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="mx-auto my-auto w-20 h-20 lg:w-24 lg:h-24 text-center text-lg p-3 align-middle leading-5 flex flex-col justify-center text-indigo-500">
                          <FaGraduationCap size="72" />
                        </div>
                        <div className="text-center text-lg my-3">
                          {jobInfo.educate}
                          {jobInfo.educate !== "중졸이하" && "이상"}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="mx-auto my-auto w-20 h-20 lg:w-24 lg:h-24 text-center text-lg p-3 align-middle leading-5 flex flex-col justify-center text-indigo-500">
                          <TiBusinessCard size="72" />
                        </div>
                        <div className="text-center text-lg my-3">
                          {jobInfo.career}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="mx-auto my-auto w-20 h-20 lg:w-24 lg:h-24 text-center text-lg p-3 align-middle leading-5 flex flex-col justify-center text-indigo-500">
                          {jobInfo.gender === "성별무관" && (
                            <MdPeopleAlt size="72" />
                          )}
                          {jobInfo.gender === "여성" && (
                            <FcBusinesswoman size="72" />
                          )}
                          {jobInfo.gender === "남성" && (
                            <FcBusinessman size="72" />
                          )}
                        </div>
                        <div className="text-center text-lg my-3">
                          {jobInfo.gender}
                        </div>
                      </div>
                    </div>

                    <div className="grid lg:hidden grid-cols-2 gap-2 pb-5 pt-4">
                      <div className="p-2">
                        <div className="mx-auto my-auto w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-indigo-500 text-white text-center text-lg p-3 align-middle leading-5 flex flex-col justify-center">
                          <div className="text-2xl font-medium">
                            {jobInfo.salaryType}
                          </div>
                        </div>
                        <div className="text-center text-lg my-3">
                          {jobInfo.salary}원
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="mx-auto my-auto w-20 h-20 lg:w-24 lg:h-24 text-center text-lg p-3 align-middle leading-5 flex flex-col justify-center text-indigo-500">
                          <AiOutlineSchedule size="64" />
                        </div>
                        <div className="text-center text-lg my-3">
                          {jobInfo.day}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="mx-auto my-auto w-20 h-20 lg:w-24 lg:h-24 text-center text-lg p-3 align-middle leading-5 flex flex-col justify-center text-indigo-500">
                          <FaGraduationCap size="64" />
                        </div>
                        <div className="text-center text-lg my-3">
                          {jobInfo.educate}
                          {jobInfo.educate !== "중졸이하" && "이상"}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="mx-auto my-auto w-20 h-20 lg:w-24 lg:h-24 text-center text-lg p-3 align-middle leading-5 flex flex-col justify-center text-indigo-500">
                          <TiBusinessCard size="64" />
                        </div>
                        <div className="text-center text-lg my-3">
                          {jobInfo.career}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 bg-white border border-gray-200 py-3">
                    <div className="lg:hidden text-center font-normal lg:text-lg">
                      본 공고의 고유번호는{" "}
                      <span className="text-indigo-500 font-medium">
                        {jobInfo.cNum}
                      </span>{" "}
                      입니다
                    </div>
                    <div className="lg:hidden text-center mb-3 lg:text-lg">
                      상담직원이 고유번호를 물어보면 위 번호를 알려주세요.
                    </div>
                    <a
                      href="https://pf.kakao.com/_xkXneb/chat"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ImgReload
                        image={Kakao}
                        cName={jobInfo.cName}
                        text={"카카오"}
                      />
                    </a>
                    {jobInfo.adImg !== "" && (
                      <a
                        href={`https://milliniensms.cafe24.com/formMail/apply/apply.html?page=26&code=${jobInfo.cCode}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ImgReload
                          image={jobInfo.adImg}
                          cName={jobInfo.cName}
                          text={"광고"}
                        />
                      </a>
                    )}
                    {jobInfo.adDetail !== undefined && (
                      <>
                        {jobInfo.adDetail !== "" && (
                          <div
                            className="p-2 font-normal w-3/4 mx-auto"
                            dangerouslySetInnerHTML={{
                              __html: sanitizer(jobInfo.adDetail),
                            }}
                          />
                        )}
                      </>
                    )}

                    <a href={`tel:${jobInfo.call}`} rel="noreferrer">
                      <ImgReload
                        image={Contact}
                        cName={jobInfo.cName}
                        text={"담당자 연결"}
                      />
                    </a>
                  </div>
                </div>
                <div className="basis-1/4">
                  <div className="sticky top-5">
                    <div className="border border-gray-200 p-2 mb-3 bg-white">
                      <div className="border border-gray-200">
                        <ImgReload
                          image={jobInfo.cLogo}
                          cName={jobInfo.cName}
                          text={"로고"}
                        />
                      </div>
                      <div className="pl-5 my-2">
                        <strong>담당자</strong> : {jobInfo.manager}
                      </div>
                      <div className="pl-5 mb-2">
                        <strong>연락처</strong> : {phone}
                      </div>
                      <div className="pl-5 mb-2">
                        <strong>문자양식</strong> : {jobInfo.template}
                      </div>
                      <div className="pl-5 mb-2">
                        <strong>근무지</strong> : {jobInfo.city} {jobInfo.town}
                      </div>
                    </div>
                    {jobInfo.interview > 0 ? (
                      <div className="border border-gray-200 p-2 text-center text-lg mb-3 grid grid-cols-4 gap-2 bg-white">
                        <div className="text-indigo-500 font-medium text-right">
                          면접비
                        </div>
                        <div className="text-left col-span-3">
                          <strong className="mr-1">
                            {jobInfo.interview
                              ? jobInfo.interview.toLocaleString("ko-KR")
                              : null}
                          </strong>
                          원
                        </div>
                        <div className="text-indigo-500 font-medium text-right">
                          수령조건
                        </div>
                        <div className="text-left col-span-3">
                          {jobInfo.interviewdetail}
                        </div>
                      </div>
                    ) : null}

                    <div className="border border-gray-200 p-2 text-center text-lg mb-3 bg-white">
                      현재{" "}
                      <strong className="text-lg text-indigo-500">
                        {jobInfo.interest}
                      </strong>
                      명의 구직자가
                      <br />이 공고에 관심을 갖고 있습니다.
                    </div>

                    <div className="hidden lg:block border border-gray-200 p-2 text-center text-lg bg-white">
                      본 공고의 고유번호는{" "}
                      <strong className="text-lg text-indigo-500">
                        {jobInfo.cNum}
                      </strong>
                      입니다
                      <br />
                      상담직원이 고유번호를 물어보면 <br />위 고유번호를
                      알려주세요
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 left-0 right-0 w-full bg-white border-t-2 border-gray-300 p-2">
              <div className="mx-auto my-auto w-11/12  lg:container flex flex-col lg:flex-row justify-center gap-3 py-3">
                <a
                  href={`https://milliniensms.cafe24.com/formMail/apply/apply.html?page=26&code=${jobInfo.cCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center w-full lg:w-1/6 transition-all duration-150 ease-in-out bg-teal-500 text-white py-2 px-5 rounded hover:bg-teal-700 font-medium hover:scale-105"
                >
                  온라인 지원하기
                </a>
                <a
                  href="https://pf.kakao.com/_xkXneb/chat"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center transition-all lg:w-1/6  duration-150 ease-in-out bg-yellow-300 py-2 px-5 rounded hover:bg-yellow-400 font-medium hover:scale-105"
                >
                  카카오톡 지원하기
                </a>
                {admin ? (
                  <>
                    <button
                      className="block text-center w-full lg:w-1/6 transition-all duration-150 ease-in-out bg-blue-500 text-white py-2 px-5 rounded hover:bg-blue-700 font-medium hover:scale-105"
                      onClick={e => navi(`/inputjob/${jid}`)}
                    >
                      공고 수정하기
                    </button>
                    <button
                      className="block text-center w-full lg:w-1/6 transition-all duration-150 ease-in-out bg-red-500 text-white py-2 px-5 rounded hover:bg-red-700 font-medium hover:scale-105"
                      onClick={e => deleteJob()}
                    >
                      공고 삭제하기
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default JobDetail;
