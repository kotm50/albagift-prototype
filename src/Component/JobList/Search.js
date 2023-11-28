import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import ListAside from "./ListAside";

import {
  collection,
  getDocs,
  where,
  orderBy,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase";

import ImgReload from "../ImgReload";

function Search() {
  let navi = useNavigate();
  const { searchParam } = useParams();
  const [surveys, setSurveys] = useState([]);
  const [last, setLast] = useState(null);
  const [full, setFull] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (searchParam === undefined) {
      alert("검색어가 잘못되었습니다");
      navi("/");
    }
    getList(searchParam);
    //eslint-disable-next-line
  }, [searchParam]);

  const getList = async s => {
    let keyword = s;
    let list = [];
    let lastVisible;
    const querySnapshot = await getDocs(
      query(
        collection(db, "jobs"),
        where("keywords", "array-contains", keyword),
        orderBy("created", "desc"),
        limit(6)
      )
    );
    querySnapshot.forEach(doc => {
      list.push({ id: doc.id, info: doc.data() });
    });
    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    setLast(lastVisible);
    setSurveys(list);
    setCounter(6);
  };

  const getMoreList = async s => {
    let keyword = s;
    let list = surveys;
    let lastVisible;
    const moreSnapshot = await getDocs(
      query(
        collection(db, "jobs"),
        where("keywords", "array-contains-any", keyword),
        orderBy("created", "desc"),
        startAfter(last),
        limit(6)
      )
    );
    moreSnapshot.forEach(doc => {
      list.push({ id: doc.id, info: doc.data() });
    });

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
    setCounter(counter + 3);
  };
  return (
    <>
      <div className="w-11/12 lg:container mx-auto border-b py-2 lg:flex lg:gap-2">
        <div className="hidden basis-1/12 lg:block sticky">
          <ListAside />
        </div>
        <div className="py-2 lg:basis-11/12">
          <h2 className="border-b border-indigo-500 text-2xl font-medium pb-1 mb-3">
            "<span className="text-indigo-500">{searchParam}</span>"에 대한 검색
            결과입니다
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
            {surveys.length > 0 ? (
              <>
                {surveys.map((sur, idx) => (
                  <div
                    className="w-full p-5 border min-h-16 hover:bg-indigo-100 bg-white"
                    key={idx}
                  >
                    <Link to={`/jobdetail/${sur.id}`}>
                      <div className="flex justify-between gap-3">
                        <div className="mx-auto border flex flex-col justify-center my-auto basis-1/4">
                          <ImgReload
                            image={sur.info.cLogo}
                            cName={sur.info.cName}
                            text={"로고"}
                          />
                        </div>
                        <div className="flex flex-col justify-center basis-3/4 overflow-hidden">
                          <div className="text-xs lg:text-xs font-normal text-left truncate">
                            {sur.info.subtitle}
                          </div>
                          <div className="font-medium text-sm lg:text-base text-left truncate">
                            {sur.info.title}
                          </div>
                          <div className="flex flex-row flex-nowrap gap-3 justify-between mt-2">
                            <div className="text-sm lg:text-base text-left">
                              {sur.info.city} {sur.info.town}
                            </div>
                            <div className="text-sm lg:text-base text-left">
                              {sur.info.salaryType}
                              <span className="pl-2 font-medium text-indigo-500">
                                {sur.info.salary}
                              </span>{" "}
                              원
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              "공고가 아직 없습니다"
            )}
          </div>
        </div>
      </div>

      {!full ? (
        <button
          className="ease-in-out duration-300 block mx-auto hover:cursor-pointer hover:scale-110 hover:font-medium hover:text-red-500 p-3 text-sm my-2"
          onClick={e => {
            getMoreList(searchParam);
          }}
        >
          <span className="text-xs">▼ </span>더보기
          <span className="text-xs"> ▼</span>
        </button>
      ) : null}
    </>
  );
}

export default Search;
