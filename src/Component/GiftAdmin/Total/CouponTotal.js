import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase"; // Firebase 초기화 후에 db 객체 가져오기

function CouponTotal() {
  const [coupons, setCoupons] = useState(0);
  useEffect(() => {
    getCoupon();
    //eslint-disable-next-line
  }, []);
  const getCoupon = async () => {
    const couponCollectionRef = collection(db, "gifttrade"); // 'coupon' 컬렉션의 참조 가져오기

    try {
      const snapshot = await getDocs(couponCollectionRef); // 컬렉션의 모든 문서 스냅샷 가져오기
      const documentCount = snapshot.size; // 문서 수 계산

      setCoupons(documentCount);
    } catch (error) {
      console.error("문서 수를 가져오는 동안 오류 발생:", error);
    }
  };
  return (
    <div>
      총 거래 쿠폰 수 :{" "}
      <span className="text-emerald-500 text-lg font-medium">{coupons}</span> 개
    </div>
  );
}

export default CouponTotal;
