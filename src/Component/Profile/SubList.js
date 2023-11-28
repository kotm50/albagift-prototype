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
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Loading from "../Loading";
import Sub from "./Sub";

function SubList() {
  const user = useSelector(state => state.user);
  let navi = useNavigate();
  const [applies, setApplies] = useState([]);
  const [alias, setAlias] = useState("");
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
      query(collection(db, "profile"), orderBy("created", "desc"), limit(10))
    );
    let list = [];
    querySnapshot.forEach(doc => {
      list.push(doc.data());
    });
    let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    setLast(lastVisible);
    setApplies(list);
    setIsLoading(true);
    setCounter(10);
  };

  //리스트 추가호출
  const getMoreList = async e => {
    const moreSnapshot = await getDocs(
      query(
        collection(db, "profile"),
        orderBy("created", "desc"),
        startAfter(last),
        limit(5)
      )
    );
    let list = applies;
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
    setApplies(list);
    setLast(lastVisible);
    setIsLoading(true);
    setCounter(counter + 5);
  };

  //검색결과 첫노출
  const searchIt = async e => {
    e.preventDefault();
    console.log("검색시작");
    setCounter(0);
    setSearching(true);
    let searchSnapshot = await getDocs(
      query(collection(db, "profile"), where("alias", "==", alias), limit(10))
    );
    let searchResult = [];
    searchSnapshot.forEach(doc => {
      searchResult.push(doc.data());
    });
    if (searchResult.length > 0) {
      setApplies(searchResult);
      onToast(alias + " 검색결과 입니다");
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
    let searchMoreSnapshot;

    searchMoreSnapshot = await getDocs(
      query(
        collection(db, "profile"),
        where("alias", "==", alias),
        startAfter(last),
        limit(5)
      )
    );
    let searchResult = applies;
    searchMoreSnapshot.forEach(doc => {
      searchResult.push(doc.data());
    });
    setApplies(searchResult);
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
              {applies.length >= 1 ? (
                <>
                  <div className="container mx-auto flex justify-around bg-white p-2 mb-2 rounded-xl drop-shadow-xl">
                    <h2 className="text-3xl font-medium mb-2 p-2 text-center text-indigo-900 basis-2/4">
                      KoTI 프로필 신청서 리스트
                    </h2>
                    <div
                      id="SearchArea"
                      className="basis-3/4 text-center my-auto grid grid-cols-2"
                    >
                      <div className="flex gap-0 justify-start py-2 px-5 rounded-full">
                        <label
                          htmlFor="searchName"
                          className="basis-5/12 flex flex-col justify-center bg-indigo-500 text-white"
                        >
                          고유번호
                        </label>
                        <input
                          type="text"
                          id="searchName"
                          className="block basis-6/12 p-2 bg-transparent  border-2 border-indigo-500"
                          placeholder="지점 고유번호 4자리를 입력하세요"
                          onChange={e => {
                            setAlias(e.currentTarget.value);
                          }}
                          onBlur={e => {
                            setAlias(e.currentTarget.value);
                          }}
                          onKeyUp={e => {
                            if (e.key === "Enter") {
                              searchIt();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div
                      id="searchbtn"
                      className="basis-1/4 text-center my-auto flex flex-col pr-5"
                    >
                      <button
                        className="bg-indigo-500 hover:bg-indigo-700 text-white p-2"
                        onClick={e => searchIt(e)}
                      >
                        검색
                      </button>
                    </div>
                  </div>
                  <div className="bg-white container mx-auto py-3 my-2 flex flex-wrap justify-start items-start rounded-xl drop-shadow-xl">
                    {applies.map((s, idx) => (
                      <div
                        className="max-w-1/4 h-auto p-3 m-3 bg-indigo-50 transition-all duration-300 hover:scale-110 hover:bg-indigo-100 hover:rounded-lg border border-indigo-500"
                        key={idx}
                      >
                        <Sub s={s} idx={idx} />
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

export default SubList;
