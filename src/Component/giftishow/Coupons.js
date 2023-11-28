import React, { useState, useEffect } from "react";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { buyGift } from "../../Reducer/userSlice";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

import CouponModal from "./CouponModal";
import MemoModal from "./MemoModal";
import CouponLimit from "./CouponLimit";

function Coupons(props) {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [stat, setStat] = useState("");
  const [couponModal, setCouponModal] = useState(false);
  const [memoModal, setMemoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usable, setUsable] = useState(false);
  const [goodsCode, setGoodsCode] = useState("");
  useEffect(() => {
    getCoupon();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (couponModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // eslint-disable-next-line
  }, [couponModal]);

  const getCoupon = async () => {
    setLoading(false);
    try {
      const response = await axios.post("/bizApi/coupons", {
        trId: props.coupon.trId,
      });
      let pinstat = response.data.result[0].couponInfoList[0].pinStatusNm;
      let pinstatcd = response.data.result[0].couponInfoList[0].pinStatusCd;
      let goodsCode = response.data.result[0].couponInfoList[0].goodsCd;
      setGoodsCode(goodsCode);
      if (pinstatcd !== "01" && pinstatcd !== "06") {
        setUsable(false);
      } else {
        setUsable(true);
      }
      setStat(pinstat);
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };

  const cancelCoupon = async () => {
    let confirm = window.confirm(
      `쿠폰을 취소하면 사용할 수 없게 됩니다. 취소할까요?`
    );
    if (confirm) {
      try {
        const response = await axios.post("/bizApi/cancel", {
          trId: props.coupon.trId,
        });
        if (response.data.code === "0000") {
          let cancel = user.point + props.coupon.price;
          let pointRef = doc(db, "apply", `${user.uid}`);
          await updateDoc(pointRef, { point: cancel });
          await dispatch(
            buyGift({
              point: cancel,
            })
          );
          alert(
            `쿠폰이 취소되었습니다 ${props.coupon.price}포인트가 환급됩니다`
          );
          getCoupon();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <>
      {!loading ? (
        <div className="p-2 bg-white border">
          <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded dark:bg-gray-700">
            <svg
              className="w-12 h-12 text-gray-200"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 640 512"
            >
              <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
            </svg>
          </div>
          <div role="status" className="max-w-sm animate-pulse mt-2">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="p-2 bg-white border">
          <img src={props.coupon.goodsImgB} alt="상품이미지" />
          <p className="text-lg font-medium text-gray-700 truncate">
            {props.coupon.goodsName} <br />
            <a
              href={`/giftdetail/${goodsCode}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-700 hover:border-b text-base"
            >
              (상품 페이지 보기)
            </a>
          </p>
          <CouponLimit coupon={props.coupon} usable={usable} />
          <div className="grid grid-cols-4 gap-1">
            {usable ? (
              <div className="col-span-3 divide-x">
                <button
                  className="bg-teal-500 text-white p-2 hover:bg-teal-700"
                  onClick={e => setCouponModal(true)}
                >
                  쿠폰보기
                </button>

                {couponModal ? (
                  <CouponModal
                    setCouponModal={setCouponModal}
                    coupon={props.coupon}
                    uid={user.uid}
                  />
                ) : null}
              </div>
            ) : (
              <div
                className="bg-gray-500 text-white p-2 text-center col-span-3"
                title={`상태 : ${stat}`}
              >
                상태 : {stat}
              </div>
            )}
            <button
              className="bg-teal-500 text-white p-2 hover:bg-teal-700"
              onClick={e => setMemoModal(true)}
            >
              메모
            </button>
            {memoModal ? (
              <MemoModal
                setMemoModal={setMemoModal}
                coupon={props.coupon}
                uid={user.uid}
              />
            ) : null}
          </div>
        </div>
      )}
      <button className="w-0 h-0 hidden" onClick={cancelCoupon}>
        xx
      </button>
    </>
  );
}

export default Coupons;
