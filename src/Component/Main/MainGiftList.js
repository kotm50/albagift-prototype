import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

function MainGiftList() {
  const [goods, setGoods] = useState([]);
  useEffect(() => {
    fetchGifts();
    //eslint-disable-next-line
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? goods.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === goods.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTouchStart = event => {
    setTouchStart(event.targetTouches[0].clientX);
  };

  const handleTouchMove = event => {
    setTouchEnd(event.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNextClick();
    }

    if (touchStart - touchEnd < -50) {
      handlePrevClick();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const fetchGifts = async (after = null) => {
    const randomNum = Math.floor(Math.random() * 4) + 1;
    let giftQuery;
    giftQuery = query(
      collection(db, "gift"),
      where("category1Seq", "==", randomNum),
      orderBy("goodsNo", "desc"),
      limit(4)
    );

    if (after) {
      giftQuery = query(giftQuery, startAfter(after));
    }

    const giftSnapshot = await getDocs(giftQuery);
    const newGifts = giftSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));

    setGoods(prevGoods => [...prevGoods, ...newGifts]);
  };

  return (
    <>
      <div className="w-11/12 mx-auto">
        <h2 className="w-11/12 lg:container lg:mx-auto font-medium text-left text-xl my-3 flex justify-between flex-nowrap">
          <span>
            🛒면접Shop
            <span className="hidden xl:inline">
              {" "}
              - 구직활동이 상품이 됩니다
            </span>
          </span>
          <span className="text-sm flex flex-col justify-center text-gray-500 hover:text-gray-900">
            <a href="/giftlist">전체보기</a>
          </span>
        </h2>
      </div>
      <div className="container hidden xl:block mx-auto">
        <div className="grid gap-2 xl:grid-cols-4">
          {goods.map((g, idx) => (
            <div
              className="p-3 border bg-blue-300 hover:bg-indigo-500"
              key={idx}
            >
              <Link
                to={`/giftdetail/${g.goodsCode}`}
                onClick={e => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="p-2 bg-white border">
                  <p className="text-lg font-medium text-gray-700 truncate">
                    <small className="block font-normal">{g.affiliate}</small>
                    {g.goodsName}
                  </p>
                  <img
                    src={g.goodsImgB}
                    alt={g.content}
                    className="max-h-32 mx-auto"
                  />
                  <p className="text-indigo-500 text-lg xl:text-xl text-right font-bold">
                    {g.realPrice}
                    <small className="font-normal text-gray-500">Point</small>
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative mb-3 xl:hidden block bg-blue-300 py-5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="overflow-hidden">
          <div
            className="flex transition-all duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {goods.map((g, index) => (
              <div
                className="w-full flex-shrink-0 flex items-center justify-center"
                key={index}
              >
                <Link to={`/giftdetail/${g.goodsCode}`}>
                  <div className="p-2 bg-white border w-80 max-w-full">
                    <p className="text-lg font-medium text-gray-700 truncate">
                      <small className="block font-normal">{g.affiliate}</small>
                      {g.goodsName}
                    </p>
                    <img
                      src={g.goodsImgB}
                      alt={g.content}
                      className="max-h-32 mx-auto"
                    />
                    <p className="text-indigo-500 text-lg xl:text-xl text-right font-bold">
                      {g.realPrice}
                      <small className="font-normal text-gray-500">Point</small>
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <button
          className="absolute top-1/2 -translate-y-1/2 left-0  bg-opacity-50 hover:bg-opacity-75 p-2 text-gray-700"
          onClick={handlePrevClick}
        >
          <FaAngleLeft className="h-6 w-6" />
        </button>
        <button
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-opacity-50 hover:bg-opacity-75 p-2 text-gray-700"
          onClick={handleNextClick}
        >
          <FaAngleRight className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}

export default MainGiftList;
