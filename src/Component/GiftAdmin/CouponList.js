import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

import GetName from "./GetName";
import GetCouponStat from "./GetCouponStat";

function CouponList() {
  const [coupons, setCoupons] = useState([]);
  useEffect(() => {
    getCoupon();
    //eslint-disable-next-line
  }, []);
  const getCoupon = async () => {
    const couponCollectionRef = collection(db, "gifttrade"); // 'coupon' 컬렉션의 참조 가져오기

    try {
      const snapshot = await getDocs(couponCollectionRef); // 컬렉션의 모든 문서 스냅샷 가져오기
      const documents = []; // 문서를 저장할 배열

      const snapshotDocs = snapshot.docs;
      for (const doc of snapshotDocs) {
        if (doc.id !== "serial") {
          doc.data().docId = doc.id;
          let docData = doc.data();
          let goodsCode = await getGoodsCode(docData.goodsName);
          docData.docId = doc.id;
          docData.goodsCode = goodsCode;
          documents.push(docData); // 문서 데이터를 배열에 추가
        }
      }
      setCoupons(documents);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
    }
  };

  const getGoodsCode = async goodsName => {
    const goodsRef = collection(db, "gift");

    try {
      const goodsQuery = query(goodsRef, where("goodsName", "==", goodsName));

      const goodsSnapshot = await getDocs(goodsQuery);
      let goodsList = [];
      goodsSnapshot.forEach(doc => {
        let goodsCode = doc.data().goodsCode;
        goodsList.push(goodsCode);
      });
      if (goodsList.length > 0) {
        return goodsList[0];
      } else {
        return "none";
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {coupons.length > 0 ? (
        <div className="flex flex-row flex-wrap justify-start gap-1">
          {coupons.map((coupon, idx) => (
            <a
              href={`/giftdetail/${coupon.goodsCode}`}
              key={idx}
              className="w-1/6"
              target="_blank"
              rel="noreferrer"
              onClick={e => {
                if (coupon.goodsCode === "none") {
                  e.preventDefault();
                  return alert("해당 상품은 판매가 중지된 상품입니다.");
                }
              }}
            >
              <div
                className={
                  coupon.goodsCode === "none"
                    ? "p-2 bg-rose-500 hover:bg-rose-700 text-white w-full"
                    : "p-2 bg-indigo-500 hover:bg-indigo-700 text-white w-full"
                }
                data={coupon.docId}
              >
                <img
                  src={coupon.goodsImgB}
                  alt={coupon.goodsName}
                  className="w-full mb-2"
                />
                <div className="grid grid-cols-1 gap-2">
                  <p
                    className="giftcategory overflow-hidden text-ellipsis"
                    title={coupon.goodsName}
                  >
                    상품명 : {coupon.goodsName}
                  </p>
                  <GetName phone={coupon.phone} />
                  <p
                    className="giftcategory overflow-hidden text-ellipsis"
                    title={coupon.phone}
                  >
                    연락처 : {coupon.phone}
                  </p>

                  <p
                    className="giftcategory overflow-hidden text-ellipsis"
                    title={coupon.phone}
                  >
                    <GetCouponStat trId={coupon.trId} pinId={coupon.pinId} />
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        "불러오는 중입니다"
      )}
    </>
  );
}

export default CouponList;
