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

function SpecialList() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    getList(1);
    // eslint-disable-next-line
  }, []);

  const getList = async e => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "jobs"),
        where("gold", "==", true),
        orderBy("created", "desc"),
        limit(6)
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
        <h2 className="w-11/12 lg:container lg:mx-auto font-medium text-left text-xl mb-3">
          🥇Gold
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
                      <div className="mx-auto border flex flex-col justify-center my-auto basis-1/3">
                        <ImgReload
                          image={sur.info.cLogo}
                          cName={sur.info.cName}
                          text={"로고"}
                        />
                      </div>
                      <div className="flex flex-col justify-center basis-2/3 overflow-hidden">
                        <div className="text-xs lg:text-xs font-normal text-left truncate">
                          {sur.info.subtitle}
                        </div>
                        <div className="font-medium text-sm lg:text-base text-left truncate">
                          {sur.info.title}
                        </div>
                        <div className="flex flex-col lg:flex-row flex-nowrap gap-3 lg:justify-between mt-2">
                          <div className="text-xs lg:text-base text-left">
                            {sur.info.city} {sur.info.town}
                          </div>
                          <div className="text-xs lg:text-base text-left">
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
            "잠시만 기다려주세요"
          )}
        </div>
      </div>
    </div>
  );
}

export default SpecialList;
