import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

function Recommend(props) {
  const [goodsList, setGoodsList] = useState([]);
  useEffect(() => {
    getGoodsList();
    //eslint-disable-next-line
  }, []);

  const getGoodsList = async () => {
    const giftCollectionRef = collection(db, "gift"); // 'gift' 컬렉션의 참조 가져오기
    let random = Math.floor(Math.random() * 7) + 1;
    try {
      const q = query(giftCollectionRef, where("category1Seq", "==", random)); // 조건에 맞는 문서를 가져오는 쿼리

      const snapshot = await getDocs(q); // 쿼리 결과의 스냅샷 가져오기
      const documents = []; // 문서를 저장할 배열
      const docLength = snapshot.size;

      const randomNumbers = await getRandomNumbers(0, docLength - 1, 4);
      snapshot.forEach(doc => {
        documents.push(doc.data()); // 문서 데이터를 배열에 추가
      });

      let document2 = [];
      randomNumbers.forEach(doc => {
        document2.push(documents[doc]);
      });

      setGoodsList(document2);
    } catch (error) {
      console.error("문서를 불러오는 동안 오류 발생:", error);
    }
  };

  function getRandomNumbers(min, max, count) {
    const numbers = [];

    // count 개수만큼 랜덤 숫자 추출
    while (numbers.length < count) {
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

      // 중복된 숫자가 없도록 확인
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }

    return numbers;
  }
  return (
    <>
      <div className="xl:container w-11/12 mx-auto bg-white mt-3 p-2">
        {goodsList.length > 0 ? (
          <div className="grid gap-2 grid-cols-1 xl:grid-cols-4">
            {goodsList.map((g, idx) => (
              <div
                className={
                  idx > 1
                    ? "hidden xl:block p-3 border bg-indigo-50 hover:bg-indigo-500"
                    : "p-3 border bg-indigo-50 hover:bg-indigo-500"
                }
                key={idx}
                onClick={e => props.setModalOn(true)}
              >
                <div className="p-2 bg-white border hover:cursor-pointer">
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
              </div>
            ))}

            <div className="text-base xl:text-lg text-center mt-2 xl:col-span-4">
              회원가입을 하시면 <br className="block xl:hidden" />더 많은
              상품들을 확인할 수 있습니다
            </div>
            <div className="xl:col-span-4 text-center mb-2">
              <button
                className="w-1/2 mx-auto bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded-full font-medium xl:text-xl"
                onClick={e => props.setModalOn(true)}
              >
                회원가입하기
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-2 grid-cols-1 xl:grid-cols-4">
            <div className="p-3 border bg-indigo-50">
              <div className="p-2 bg-white border animate-pluse">
                <p className="text-lg font-medium bg-slate-200 h-2 w-1/2 truncate"></p>
                <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded dark:bg-gray-700">
                  <svg
                    className="w-12 h-12 text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                  >
                    <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"></path>
                  </svg>
                </div>
                <p className="bg-slate-500 h-3 w-3/4"></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Recommend;
