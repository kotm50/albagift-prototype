import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  collection,
  doc,
  setDoc,
  query,
  limit,
  getDocs,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

function GiftReset() {
  const user = useSelector(state => state.user);
  let navi = useNavigate();
  const [allGoods, setAllGoods] = useState([]);
  const [goodsPercent, setGoodsPercent] = useState(0);
  const [goodsCount, setGoodsCount] = useState(0);
  const [allBrands, setAllBrands] = useState([]);
  const [brandsPercent, setBrandsPercent] = useState(0);
  const [brandsCount, setBrandsCount] = useState(0);
  const [goodsStat, setGoodsStat] = useState(
    "상품목록을 리셋하려면 '상품불러오기' 버튼을 눌러주세요"
  );
  const [brandsStat, setBrandsStat] = useState(
    "브랜드목록을 리셋하려면 '브랜드불러오기' 버튼을 눌러주세요"
  );

  useEffect(() => {
    chkAdmin(user);
    // eslint-disable-next-line
  }, []);

  const chkAdmin = user => {
    setTimeout(() => {
      if (!user.admin) {
        alert("관리자 로그인이 필요합니다");
        navi("/adminlogin");
      }
    }, 1000);
  };

  const getAllGoods = async () => {
    let confirm = window.confirm(
      "기프티쇼에서 새로운 상품 목록을 불러옵니다\n기존 상품리스트는 전부 지워집니다. 진행할까요?"
    );
    if (confirm) {
      try {
        const response = await axios.post("/bizApi/getAllGoods", {
          size: "9999999",
        });

        let array = [];

        response.data.result.goodsList.forEach(item => {
          let str = item.srchKeyword; // 이것은 예시입니다. 실제로는 값을 가진 문자열로 바꾸세요.
          let keywords = [];
          let kotiPrice = Number(item.realPrice);
          item.kotiPrice = kotiPrice;
          if (str) {
            keywords = str.includes(",") ? str.split(",") : [str];
            item.keywords = keywords;
          } else {
            keywords = item.goodsName.includes(" ")
              ? item.goodsName.split(" ")
              : [item.goodsName];
            item.keywords = keywords;
          }
          if (item.discountPrice >= 4000) {
            if (item.limitDay < 50) {
              array.push(item);
            }
          }
        });

        let array2 = array.sort((a, b) => {
          if (a.category1Seq !== b.category1Seq) {
            return a.category1Seq - b.category1Seq;
          }
          return a.category2Seq - b.category2Seq;
        });
        let array3 = array2.sort((a, b) => {
          return a.goodsCode.localeCompare(b.goodsCode);
        });
        array3.forEach((item, index) => {
          item.id = index; // index는 0부터 시작하므로 이 값을 id로 사용
          item.ts = serverTimestamp();
        });
        setAllGoods(array3);
      } catch (e) {
        console.log(e);
      }
      setGoodsStat("기존 상품목록을 삭제하고 있습니다 잠시만 기다려 주세요");
      await resetGoods("gift");
    }
  };

  const resetGoods = async collectionPath => {
    const collectionRef = collection(db, collectionPath);
    const limitedQuery = query(collectionRef, limit(100));

    while (true) {
      const snapshot = await getDocs(limitedQuery);

      if (snapshot.size === 0) {
        break;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach(docSnapshot => {
        batch.delete(docSnapshot.ref);
      });

      await batch.commit();
    }
    setGoodsPercent(0);
    setGoodsStat("'상품입력하기' 버튼을 눌러주세요.");
    alert("등록된 상품을 리셋하였습니다.\n상품 입력하기 버튼을 눌러주세요");
  };

  const inputAllGoods = async () => {
    const giftCollection = collection(db, "gift");
    let a = 0;
    await allGoods.forEach(async item => {
      const docId = item.goodsCode;
      const giftDoc = doc(giftCollection, docId);
      await setDoc(giftDoc, item);
      a++;

      const percent = ((a / allGoods.length) * 100).toFixed(2);
      setGoodsCount(a);
      setGoodsPercent(percent);
      console.log(a + "번 입력완료");
    });
    setGoodsStat("상품을 리셋하려면 '상품불러오기' 버튼을 눌러주세요");
    console.log("Data saved to Firestore!");
  };

  const getAllBrands = async () => {
    let confirm = window.confirm(
      "기프티쇼에서 새로운 브랜드 목록을 불러옵니다\n기존 브랜드리스트는 전부 지워집니다. 진행할까요?"
    );
    if (confirm) {
      try {
        const response = await axios.post("/bizApi/getBrandList", {
          size: "9999999",
        });
        console.log(response.data);

        let array = [];

        response.data.result.brandList.forEach(item => {
          array.push(item);
        });

        let array2 = array.sort((a, b) => {
          if (a.category1Seq !== b.category1Seq) {
            return a.category1Seq - b.category1Seq;
          }
          return a.category2Seq - b.category2Seq;
        });
        setAllBrands(array2);
      } catch (e) {
        console.log(e);
      }
      setBrandsStat("기존 브랜드 목록을 제거하는 중입니다...");
      await resetBrands("brand");
    }
  };

  const resetBrands = async collectionPath => {
    const brandCollectionRef = collection(db, collectionPath);
    const brandLimitedQuery = query(brandCollectionRef, limit(100));

    while (true) {
      const snapshot = await getDocs(brandLimitedQuery);

      if (snapshot.size === 0) {
        break;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach(docSnapshot => {
        batch.delete(docSnapshot.ref);
      });

      await batch.commit();
    }
    setBrandsPercent(0);
    setBrandsStat("'브랜드입력하기' 버튼을 눌러주세요");
    alert("등록된 브랜드 목록을 리셋하였습니다. 새로 등록해주세요");
  };

  const inputAllBrands = async () => {
    const brandCollection = collection(db, "brand");
    let a = 0;
    await allBrands.forEach(async item => {
      const brandId = item.brandCode;
      const brandDoc = doc(brandCollection, brandId);
      await setDoc(brandDoc, item);
      a++;
      const percent = ((a / allBrands.length) * 100).toFixed(2);
      setBrandsCount(a);
      setBrandsPercent(percent);
      console.log(a + "번 입력완료");
    });
    setBrandsStat("브랜드목록을 리셋하려면 '브랜드불러오기' 버튼을 눌러주세요");
    console.log("Data saved to Firestore!");
  };

  return (
    <div>
      <div className="container mx-auto h-48 bg-white">
        <button
          className="mx-auto bg-indigo-500 p-2 text-white"
          onClick={e => getAllGoods()}
        >
          상품불러오기
        </button>{" "}
        <button
          className="mx-auto bg-indigo-500 p-2 text-white"
          onClick={e => inputAllGoods()}
        >
          상품입력하기
        </button>
        <div className="mt-2 border-t pt-2">{goodsStat}</div>
        {allGoods.length > 1 && (
          <div className="mt-2 border-t pt-2">
            <div className="mb-1 text-base font-medium dark:text-white">
              {goodsCount < allGoods.length
                ? `${goodsCount} / ${allGoods.length}`
                : "완료"}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
              <div
                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${goodsPercent}%` }}
              >
                {goodsPercent}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="container mx-auto h-48 bg-gray-100">
        <button
          className="mx-auto bg-teal-500 p-2 text-white"
          onClick={e => getAllBrands()}
        >
          브랜드불러오기
        </button>{" "}
        <button
          className="mx-auto bg-teal-500 p-2 text-white"
          onClick={e => inputAllBrands()}
        >
          브랜드입력하기
        </button>
        <div className="mt-2 border-t pt-2">{brandsStat}</div>
        {allBrands.length > 1 && (
          <div className="mt-2 border-t pt-2">
            <div className="mb-1 text-base font-medium dark:text-white">
              {brandsCount < allBrands.length
                ? `${brandsCount} / ${allBrands.length}`
                : "완료"}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
              <div
                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${brandsPercent}%` }}
              >
                {brandsPercent}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GiftReset;
