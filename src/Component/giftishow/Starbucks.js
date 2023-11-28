import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function Starbucks() {
  const [bucks, setBucks] = useState([]);

  useEffect(() => {
    getBucks();
    //eslint-disable-next-line
  }, []);

  const getBucks = async () => {
    const giftRef = collection(db, "gift");
    const q1 = query(
      giftRef,
      where("goodsName", "==", "아이스 카페 아메리카노 T")
    );
    const q2 = query(giftRef, where("goodsName", "==", "카페 아메리카노 T"));
    const q3 = query(giftRef, where("goodsName", "==", "아이스 카페 라떼 T"));
    const q4 = query(giftRef, where("goodsName", "==", "카페 라떼 T"));

    const querySnapshot1 = await getDocs(q1);
    const querySnapshot2 = await getDocs(q2);
    const querySnapshot3 = await getDocs(q3);
    const querySnapshot4 = await getDocs(q4);

    const documents = [];
    querySnapshot1.forEach(doc => {
      documents.push(doc.data());
    });

    querySnapshot2.forEach(doc => {
      documents.push(doc.data());
    });

    querySnapshot3.forEach(doc => {
      documents.push(doc.data());
    });

    querySnapshot4.forEach(doc => {
      documents.push(doc.data());
    });

    setBucks(documents);
  };

  return (
    <>
      <h2 className="text-2xl container mx-auto font-bold ml-2 xl:ml-0">
        제일 잘 팔리는 상품
      </h2>
      {bucks.length > 0 ? (
        <div className="container mx-auto my-2 rounded grid grid-cols-2 xl:grid-cols-4 gap-3">
          {bucks.map((g, idx) => (
            <div className="p-3 border bg-white hover:bg-indigo-500" key={idx}>
              <Link to={`/giftdetail/${g.goodsCode}`}>
                <div className="p-2 bg-white border">
                  <p className="text-sm xl:text-lg font-medium text-gray-700 truncate">
                    <small className="block font-normal">{g.affiliate}</small>
                    {g.goodsName}
                  </p>
                  <img
                    src={g.goodsImgB}
                    alt={g.content}
                    className="max-h-32 mx-auto"
                  />

                  <p className="text-pink-500 text-xl text-right xl:text-right mt-3">
                    <span className="text-sm text-black font-medium hidden xl:inline">
                      가격
                    </span>{" "}
                    {g.kotiPrice}
                    <small className="font-normal text-gray-500">Point</small>
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="container mx-auto my-2 rounded grid grid-cols-1 xl:grid-cols-5 gap-3">
          <div className="p-3 border bg-white">
            <div className="p-2 bg-white border animate-pulse h-64 relative">
              <p className="text-lg w-1/2 h-3 bg-slate-200 truncate" />
              <div className="w-full h-44 bg-slate-200 my-3" />
              <div className="absolute bottom-2 w-full">
                <p className="text-sm text-right h-2 xl:text-right bg-slate-200 w-2/3" />
                <p className=" bg-slate-200 h-3 w-3/4 text-xl text-right xl:text-right mt-2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Starbucks;
