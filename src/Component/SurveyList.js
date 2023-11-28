import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  where,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Loading from "./Loading";
import PhotoErr from "./PhotoErr";

function SurveyList() {
  const user = useSelector(state => state.user);
  let navi = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastIt, setToastIt] = useState(false);
  const [toast, setToast] = useState("");
  const [correct, setCorrect] = useState(false);
  const [counter, setCounter] = useState(0);
  const [searching, setSearching] = useState(false);
  const [full, setFull] = useState(false);
  const [last, setLast] = useState(null);

  useEffect(() => {
    chkAdmin(user);
    getList(1);
    // eslint-disable-next-line
  }, []);

  //리스트 최초호출
  const getList = async e => {
    const querySnapshot = await getDocs(
      query(collection(db, "survey"), orderBy("created", "desc"), limit(10))
    );
    let list = [];
    querySnapshot.forEach(doc => {
      list.push(doc.data());
    });
    let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLast(lastVisible);
    setSurveys(list);
    setIsLoading(true);
    setCounter(10);
  };

  //리스트 추가호출
  const getMoreList = async e => {
    const moreSnapshot = await getDocs(
      query(
        collection(db, "survey"),
        orderBy("created", "desc"),
        startAfter(last),
        limit(5)
      )
    );
    let list = surveys;
    moreSnapshot.forEach(doc => {
      list.push(doc.data());
    });

    let lastVisible;
    if (moreSnapshot.docs.length === 0) {
      lastVisible = -1;
      setFull(true);
      return alert("모든 리스트를 불러왔습니다");
    } else {
      lastVisible = moreSnapshot.docs[moreSnapshot.docs.length - 1];
      setFull(false);
    }
    setSurveys(list);
    setLast(lastVisible);
    setIsLoading(true);
    setCounter(counter + 5);
  };

  //검색결과 첫노출
  const searchIt = async e => {
    setCounter(0);
    setSearching(true);
    const searchSnapshot = await getDocs(
      query(
        collection(db, "survey"),
        where("profile.name", "==", keyword),
        limit(10)
      )
    );
    let searchResult = [];
    searchSnapshot.forEach(doc => {
      searchResult.push(doc.data());
    });
    if (searchResult.length > 0) {
      setSurveys(searchResult);
      onToast(keyword + " 님의 검색결과 입니다");
      let lastVisible = searchSnapshot.docs[searchSnapshot.docs.length - 1];
      setLast(lastVisible);
    } else {
      getList(0);
      setSearching(false);
      onToast("검색결과가 없습니다, 전체목록을 표시합니다");
    }
  };

  //검색결과 추가노출
  const searchMore = async e => {
    setSearching(true);
    const searchMoreSnapshot = await getDocs(
      query(
        collection(db, "survey"),
        where("profile.name", "==", keyword),
        startAfter(last),
        limit(5)
      )
    );
    let searchResult = surveys;
    searchMoreSnapshot.forEach(doc => {
      searchResult.push(doc.data());
    });
    setSurveys(searchResult);
    let lastVisible;
    if (searchMoreSnapshot.docs.length === 0) {
      lastVisible = -1;
      setFull(true);
    } else {
      lastVisible = searchMoreSnapshot.docs[searchMoreSnapshot.docs.length - 1];
      setFull(false);
    }
    setLast(lastVisible);
  };

  const onToast = t => {
    setToast(t);
    if (t !== "") {
      setToastIt(true);
      setTimeout(() => {
        setToastIt(false);
        setToast("");
      }, 2500);
    }
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

  return (
    <>
      {!isLoading ? (
        <Loading />
      ) : (
        <>
          {!correct ? (
            <Loading />
          ) : (
            <>
              {surveys.length >= 1 ? (
                <>
                  <div className="container mx-auto flex justify-around bg-white p-2 mb-2 rounded-xl drop-shadow-xl">
                    <h2 className="text-3xl font-medium mb-2 p-2 text-center text-indigo-900 basis-2/4">
                      KoTI설문지 리스트
                    </h2>
                    <div
                      id="SearchArea"
                      className="basis-3/4 text-center my-auto"
                    >
                      <div className="flex gap-0 justify-between py-2 px-5 rounded-full border-2 border-indigo-500 w-11/12">
                        <input
                          type="text"
                          className="block w-11/12 border-0 p-1 bg-transparent"
                          placeholder="이름을 입력해 주세요"
                          onChange={e => {
                            setKeyword(e.currentTarget.value);
                          }}
                          onBlur={e => {
                            setKeyword(e.currentTarget.value);
                          }}
                          onKeyUp={e => {
                            if (e.key === "Enter") {
                              searchIt();
                            }
                          }}
                        />
                        <button className="w-1/12" onClick={e => searchIt()}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-indigo-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      id="sortArea"
                      className="basis-2/4 text-center my-auto flex flex-col"
                    ></div>
                  </div>
                  <div className="bg-white container mx-auto py-3 my-2 flex flex-wrap justify-start items-start rounded-xl drop-shadow-xl">
                    {surveys.map((s, idx) => (
                      <div
                        className="max-w-1/4 h-auto p-3 m-3 bg-white transition-all duration-300 hover:scale-110 hover:bg-indigo-300 hover:rounded-lg border"
                        key={idx}
                      >
                        <Link
                          to={"/result?no=" + s.surveyId}
                          className="flex flex-col gap-2"
                        >
                          <PhotoErr
                            photo={s.profile.photo}
                            name={s.profile.name}
                          />
                          <div className="text-base">
                            이름 : {s.profile.name}
                          </div>
                          <div className="text-base">
                            연락처 :{" "}
                            {s.profile.phone
                              .replace(/[^0-9]/g, "")
                              .replace(
                                /(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g,
                                "$1-$2-$3"
                              )}
                          </div>
                          <div className="text-base">
                            MBTI : {s.profile.mbti}
                          </div>
                          <div className="text-base">
                            등록일 : {s.date ? s.date : "0000-00-00"}
                          </div>
                          <div className="text-base">
                            유형 :{" "}
                            {s.pw === "basic" ? (
                              <span className="text-indigo-500 font-medium">
                                기본설문지
                              </span>
                            ) : (
                              <span className="text-pink-800 font-medium">
                                커스텀설문지
                              </span>
                            )}
                          </div>
                          <div className="text-base">
                            고유번호 : {s.alias ? s.alias : "0000"}
                            <small className="block">
                              "폼메일에서 고유번호로 지점 확인이 가능합니다"
                            </small>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <>
                    {!full ? (
                      <button
                        className="block mx-auto bg-white border-2 rounded-full hover:cursor-pointer hover:bg-gray-200 p-3 text-sm"
                        onClick={e => {
                          if (searching) {
                            searchMore(counter);
                          } else {
                            getMoreList(counter);
                          }
                        }}
                      >
                        더보기
                      </button>
                    ) : null}
                  </>
                </>
              ) : (
                "로딩에 실패했습니다, 새로고침 후에도 실패할 경우 관리자에 문의하여주세요"
              )}
            </>
          )}
        </>
      )}
      {toastIt ? (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black p-3 text-center rounded-lg text-white bg-opacity-80">
          {toast}
        </div>
      ) : null}
    </>
  );
}

export default SurveyList;
