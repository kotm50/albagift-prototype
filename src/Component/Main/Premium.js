import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
  where,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";

import ImgReload from "../ImgReload";

function Premium() {
  const [surveys, setSurveys] = useState([]);
  useEffect(() => {
    getList(1);
    // eslint-disable-next-line
  }, []);

  const getList = async e => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "jobs"),
        where("premium", "==", true),
        orderBy("created", "desc"),
        limit(8)
      )
    );
    let list = [];
    querySnapshot.forEach(doc => {
      list.push({ id: doc.id, info: doc.data() });
    });
    setSurveys(list);
  };

  return (
    <div className="border-y" id="premium_bg">
      <div className="bg-indigo-500 bg-opacity-90 py-5">
        <div className="w-11/12 lg:container mx-auto flex justify-between">
          <h2 className="w-11/12 lg:container mx-auto font-medium text-left text-3xl text-white mb-3 basis-3/4">
            프리미엄 채용정보
          </h2>
          <div className="text-right text-sm text-white basis-1/4 flex flex-col justify-center hover:text-yellow-300">
            <Link to="/premiumlist">+전체보기</Link>
          </div>
        </div>
        <div className="w-11/12 lg:container mx-auto p-2 border border-indigo-200 bg-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
            {surveys.length > 0 ? (
              <>
                {surveys.map((sur, idx) => (
                  <div
                    className="w-full p-5 border min-h-56 hover:bg-indigo-100"
                    key={idx}
                  >
                    <Link to={`/jobdetail/${sur.id}`}>
                      <div
                        id="premiumCLogo"
                        className="mx-auto border flex flex-col justify-center"
                      >
                        <ImgReload
                          image={sur.info.cLogo}
                          cName={sur.info.cName}
                          text={"로고"}
                        />
                      </div>
                      <div className="my-2 truncate">
                        {sur.info.keywords.map((keyw, idx) => (
                          <span
                            className="inline-block text-xs p-1 lg:text-base lg:p-2 border border-gray-200 bg-gray-50 hover:border-indigo-700 hover:bg-indigo-500 hover:text-white rounded-full mr-1 mb-1"
                            key={idx}
                          >
                            #{keyw}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs lg:text-sm font-normal text-left mt-3 truncate">
                        {sur.info.subtitle}
                      </div>
                      <div className="font-medium text-sm lg:text-lg text-left truncate">
                        {sur.info.title}
                      </div>
                      <div className="flex flex-col lg:flex-row flex-nowrap gap-3 lg:justify-between mt-3">
                        <div className="text-sm lg:text-lg text-left">
                          {sur.info.city} {sur.info.town}
                        </div>
                        <div className="text-sm lg:text-lg text-left">
                          {sur.info.salaryType}
                          <span className="pl-2 font-medium text-indigo-500">
                            {sur.info.salary}
                          </span>{" "}
                          원
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              "잠시만 기다려주세요"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Premium;
