import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { sectors } from "../Job/Data";

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
import Banner from "./Banner";
function SectorJob() {
  const { sector } = useParams();
  const [surveys, setSurveys] = useState([]);
  const [last, setLast] = useState(null);
  const [full, setFull] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    getList(sector);
    // eslint-disable-next-line
  }, [sector]);

  const getList = async c => {
    let sectorName;
    let list = [];
    let lastVisible;
    if (sector === undefined) {
      const querySnapshot = await getDocs(
        query(collection(db, "jobs"), orderBy("created", "desc"), limit(12))
      );
      querySnapshot.forEach(doc => {
        list.push({ id: doc.id, info: doc.data() });
      });
      lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    } else {
      sectorName = sectors[c][0];
      const sectorSnapshot = await getDocs(
        query(
          collection(db, "jobs"),
          where("sector", "==", sectorName),
          orderBy("created", "desc"),
          limit(6)
        )
      );
      sectorSnapshot.forEach(doc => {
        list.push({ id: doc.id, info: doc.data() });
      });
      lastVisible = sectorSnapshot.docs[sectorSnapshot.docs.length - 1];
    }
    setLast(lastVisible);
    setSurveys(list);
    setCounter(6);
  };

  const getMoreList = async c => {
    let sectorName;
    let list = surveys;
    let lastVisible;
    if (sector === undefined) {
      const moreSnapshot = await getDocs(
        query(
          collection(db, "jobs"),
          orderBy("created", "desc"),
          startAfter(last),
          limit(3)
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
    } else {
      sectorName = sectors[c][0];
      const moreSectorSnapshot = await getDocs(
        query(
          collection(db, "jobs"),
          where("sector", "==", sectorName),
          orderBy("created", "desc"),
          startAfter(last),
          limit(3)
        )
      );
      moreSectorSnapshot.forEach(doc => {
        list.push({ id: doc.id, info: doc.data() });
      });

      if (moreSectorSnapshot.docs.length === 0) {
        lastVisible = -1;
        setFull(true);
        return alert("모든 리스트를 불러왔습니다");
      } else {
        lastVisible =
          moreSectorSnapshot.docs[moreSectorSnapshot.docs.length - 1];
        setFull(false);
      }
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
        <div className="pb-2 lg:basis-11/12">
          <Banner text={"업종별 공고"} />
          <div className="bg-white border p-2 flex flex-nowrap justify-start gap-2 my-2">
            <div className="font-medium text-indigo-500 flex flex-col justify-center basis-1/4 lg:basis-1/12 px-2">
              <span>업종</span>
            </div>
            <div className="flex flex-wrap justify-start gap-2 basis-3/4  lg:basis-11/12">
              {sectors.map((c, idx) => (
                <div key={idx}>
                  {idx === 0 ? (
                    <div
                      className={
                        sector === undefined
                          ? "p-2 bg-gray-100 hover:cursor-pointer"
                          : "p-2 hover:bg-gray-100 hover:cursor-pointer"
                      }
                    >
                      <Link to="/sectorjob">{c[0]}</Link>
                    </div>
                  ) : (
                    <div
                      className={
                        idx === Number(sector)
                          ? "p-2 bg-gray-100 hover:cursor-pointer"
                          : "p-2 hover:bg-gray-100 hover:cursor-pointer"
                      }
                    >
                      <Link to={`/sectorjob/${c[1]}`}>{c[0]}</Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
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
            getMoreList(counter);
          }}
        >
          <span className="text-xs">▼ </span>더보기
          <span className="text-xs"> ▼</span>
        </button>
      ) : null}
    </>
  );
}

export default SectorJob;
