import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

import Coupons from "./Coupons";

function CouponList() {
  const location = useLocation();
  let navi = useNavigate();
  const { uid } = useParams();
  const user = useSelector(state => state.user);
  const [coupons, setCoupons] = useState([]);
  useEffect(() => {
    if (uid === undefined) {
      if (user.uid !== "") {
        navi(`/couponlist/${user.uid}`);
      } else {
        alert("잘못된 경로입니다");
        navi("/");
      }
    } else {
      getCoupons(uid);
    }
    // eslint-disable-next-line
  }, [location]);

  const getCoupons = async u => {
    // uid 필드값이 a인 문서들을 가져올 쿼리
    const q = query(collection(db, "gifttrade"), where("uid", "==", u));

    // 문서들을 가져와서 리스트 만들기
    const docsSnapshot = await getDocs(q);
    const docsList = docsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCoupons(docsList);
  };

  return (
    <>
      <div className="w-11/12 xl:container mx-auto bg-white mb-3 text-xl text-center">
        <span className="font-bold">{user.name}</span> 님이 보유한 쿠폰입니다
      </div>
      <div className="w-11/12 xl:container mx-auto bg-white">
        <ul className="container mx-auto my-2 rounded grid grid-cols-1 xl:grid-cols-5 gap-3">
          {coupons.map((coupon, idx) => (
            <li className="p-3 border bg-white hover:bg-indigo-500" key={idx}>
              <Coupons coupon={coupon} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default CouponList;
