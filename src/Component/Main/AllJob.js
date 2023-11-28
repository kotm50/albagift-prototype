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

function JobList() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    getList(1);
    // eslint-disable-next-line
  }, []);

  const getList = async e => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "jobs"),
        where("bronze", "==", true),
        orderBy("created", "desc"),
        limit(20)
      )
    );
    let list = [];
    querySnapshot.forEach(doc => {
      list.push({ id: doc.id, info: doc.data() });
    });
    setSurveys(list);
  };

  return (
    <div className="py-5">
      <div className="w-full">
        <h2 className="w-11/12 lg:container lg:mx-auto font-medium text-left text-xl mb-2">
          🥉Bronze
        </h2>
        <div className="flex flex-col divide-y-1">
          {surveys.length > 0 ? (
            <>
              {surveys.map((sur, idx) => (
                <div
                  className="w-full p-2 border min-h-16 hover:bg-indigo-100 bg-white"
                  key={idx}
                >
                  <Link to={`/jobdetail/${sur.id}`}>
                    <div className="flex flex-row justify-start overflow-hidden gap-3">
                      <div className="hidden text-xs lg:text-xs font-normal text-left truncate xl:flex flex-col justify-center xl:basis-3/12">
                        {sur.info.subtitle}
                      </div>
                      <div className="pl-5 font-medium text-sm lg:text-base text-left truncate flex flex-col justify-center basis-5/12">
                        {sur.info.title}
                      </div>
                      <div className="hidden xl:flex text-xs lg:text-base text-left flex-col justify-center xl:basis-2/12">
                        {sur.info.city} {sur.info.town}
                      </div>
                      <div className="text-sm lg:text-base text-left flex flex-col justify-center basis-4/12 xl:basis-2/12">
                        <span>
                          {sur.info.salaryType}
                          <span className="pl-2 font-medium text-indigo-500">
                            {sur.info.salary}
                          </span>{" "}
                          원
                        </span>
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
  );
}

export default JobList;
