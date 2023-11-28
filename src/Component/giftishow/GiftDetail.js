import React, { useState, useEffect } from "react";

import axios from "axios";
import dompurify from "dompurify";

import { useSelector, useDispatch } from "react-redux";
import { buyGift } from "../../Reducer/userSlice";

import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Loading from "../Loading";

import {
  doc,
  collection,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

import dayjs from "dayjs";
import Recommend from "./Recommend";
import GiftModal from "./GiftModal";

function GiftDetail() {
  const sanitizer = dompurify.sanitize;
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navi = useNavigate();
  const [goods, setGoods] = useState({});
  const [correct, setCorrect] = useState(false);
  const [content, setContent] = useState("");
  const [modalOn, setModalOn] = useState(false);
  //const [viewCount, setViewCount] = useState(0);
  //const [buyCount, setBuyCount] = useState(0);
  const { goodsCode } = useParams();

  useEffect(() => {
    getGoods(goodsCode);
    //eslint-disable-next-line
  }, [goodsCode]);

  const getGoods = async g => {
    setCorrect(false);

    const docRef = doc(db, "gift", goodsCode.toString());
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let goodsData = docSnap.data();
      if (docSnap.data().category1Seq > 10) {
        goodsData.category1Seq = Math.floor(Math.random() * 10) + 1;
      }
      setGoods(goodsData);
      const regex = // eslint-disable-next-line
        /(^|[^\w\/])(https?:\/\/[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
      let contentText = docSnap.data().content;
      let contentWB = contentText.replace(/(?:\r\n|\r|\n)/g, " <br />");
      let replacedText = contentWB.replace(
        regex,
        '<a href="$2" rel="noopener noreferrer" class="text-indigo-500 hover:cursor-pointer hover:underline-offset-2">$2</a>'
      );

      setContent(replacedText);
      setCorrect(true);
    } else {
      console.log("No such document!");
    }
  };

  const modalChk = () => {
    if (user.uid !== "") {
      setModalOn(true);
    } else {
      let goLogin = window.confirm(
        "로그인이 필요합니다, 로그인을 진행해 주세요"
      );
      if (goLogin) {
        navi("/login");
      }
    }
  };

  const buyIt = async () => {
    if (user.uid !== "") {
      let confirm = window.confirm(
        `${goods.kotiPrice}면접포인트가 차감됩니다. 구매하시겠습니까?`
      );
      if (confirm) {
        if (goods.kotiPrice > user.point) {
          return alert("포인트가 부족합니다");
        }
        let buy = Number(user.point) - Number(goods.kotiPrice);
        let pointRef = doc(db, "apply", `${user.uid}`);
        await updateDoc(pointRef, { point: Number(buy) });
        await dispatch(
          buyGift({
            point: buy,
          })
        );
        let complete = await getCoupon();
        if (complete) {
          const tradeRef = collection(db, "gifttrade");
          await setDoc(doc(tradeRef, `${complete.trId}`), complete);

          const PointSerial = await getPointSerial();
          const giftPointCollectionRef = collection(db, "giftPoint");
          const pointRef = doc(
            giftPointCollectionRef,
            `point_${PointSerial}_${user.uid}`
          );

          await setDoc(pointRef, {
            uid: user.uid,
            name: user.name,
            date: serverTimestamp(),
            point: Number(goods.kotiPrice),
            realPrice: Number(goods.discountPrice),
            beforePoint: Number(user.point),
            afterPoint: Number(buy),
            increase: false,
            type: "bought",
            interviewData: "쿠폰구매",
          });
          alert(`구매가 완료되었습니다. ${buy} 면접포인트 남았습니다`);
          navi("/buycomplete");
        }
      }
    } else {
      alert("로그인이 필요합니다, 로그인을 진행해 주세요");
      navi("/login");
    }
  };

  const getPointSerial = async () => {
    const serialRef = doc(db, "giftPoint", "serial");

    const serialSnapshot = await getDoc(serialRef);
    if (serialSnapshot.exists()) {
      const currentNumber = serialSnapshot.data().number;
      let newNumber = currentNumber + 1;
      if (newNumber > 99999999) {
        newNumber = 0;
      }

      // Update the number in Firestore
      await updateDoc(serialRef, { number: newNumber });

      // Format the number to 8 digits with leading zeros
      const formattedNumber = String(newNumber).padStart(8, "0");
      return formattedNumber;
    } else {
      console.error("Serial number document does not exist.");
    }
  };

  const getCoupon = async () => {
    const serial = await getSerial();
    try {
      const today = dayjs(new Date()).format("YYYYMMDD");
      const tr_id = `koti_${today}_${serial}`;
      const order_no = `${today}${serial}`;
      let body = {
        trId: tr_id,
        orderNo: order_no,
        success: true,
        goodsName: goods.goodsName,
        goodsCode: goods.goodsCode,
        uid: user.uid,
        phone: user.phone.replace("+82", "0"),
      };
      const response = await axios.post("/bizApi/sendCoupon", {
        goodsName: goods.goodsName,
        goodsCode: goodsCode,
        orderNo: order_no,
        trId: tr_id,
        phone: user.phone.replace("+82", "0"),
      });
      let res = response.data.code;
      body.pinNo = response.data.result.result.pinNo;
      body.couponImgUrl = response.data.result.result.couponImgUrl;
      body.bought = serverTimestamp();
      body.goodsImgB = goods.goodsImgB;
      body.price = goods.kotiPrice;
      let futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Number(goods.limitDay));
      body.limitDate = Timestamp.fromDate(futureDate);
      if (res === "0000") {
        const response = await axios.post("/bizApi/coupons", {
          trId: tr_id,
        });
        body.endDate = response.data.result[0].couponInfoList[0].validPrdEndDt;
        return body;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const getSerial = async () => {
    const serialRef = doc(db, "gifttrade", "serial");

    const serialSnapshot = await getDoc(serialRef);
    if (serialSnapshot.exists()) {
      const currentNumber = serialSnapshot.data().number;
      let newNumber = currentNumber + 1;
      if (newNumber > 99999999) {
        newNumber = 0;
      }

      // Update the number in Firestore
      await updateDoc(serialRef, { number: newNumber });

      // Format the number to 8 digits with leading zeros
      const formattedNumber = String(newNumber).padStart(8, "0");
      return formattedNumber;
    } else {
      console.error("Serial number document does not exist.");
    }
  };

  return (
    <>
      {!correct ? (
        <Loading />
      ) : (
        <>
          <Helmet>
            <title>{`${goods.goodsName} - 코리아티엠 면접샵`}</title>
            <meta name="description" content={goods.goodsName} />
            <meta property="og:image" content={goods.mmsGoodsImg} />
            <meta
              property="og:url"
              content={`https://ikoreatm.com/giftdetail/${goodsCode}`}
            />
            <meta name="og:title" content={goods.goodsName} />
            <meta name="og:description" content={goods.goodsName} />
          </Helmet>
          <div className="xl:container w-11/12 mx-auto bg-white p-2 flex flex-col xl:flex-row xl:justify-center gap-3">
            <div className="xl:basis-4/12 p-1">
              <img
                src={goods.goodsImgB}
                alt={goods.goodsName}
                className="border bg-gray-100 mx-auto w-3/4"
              />
            </div>
            <div className="xl:basis-6/12 p-1 flex flex-col justify-start">
              <div className="xl:text-lg">{goods.brandName}</div>
              <h2 className="text-lg xl:text-2xl font-bold">
                {goods.goodsName}
              </h2>
              <div className="mt-5">
                <span className="text-sm xl:text-lg font-bold text-gray-500">
                  가격
                </span>
              </div>
              <div className="border-b pb-5">
                <span className="text-2xl xl:text-4xl font-bold text-pink-500">
                  {goods.kotiPrice}
                </span>
                <span className="text-xl xl:text-2xl ml-1">Point</span>
              </div>
              <div className="mt-5 flex justify-start gap-3">
                <span className="xl:text-lg font-bold basis-1/4 xl:basis-1/6">
                  교환처
                </span>
                <span className="xl:text-lg basis-3/4 xl:basis-5/6">
                  {goods.affiliate}
                </span>
              </div>
              <div className="mt-5 flex justify-start gap-3">
                <span className="xl:text-lg font-bold basis-1/4 xl:basis-1/6">
                  유효기간
                </span>
                <span className="xl:text-lg basis-3/4 xl:basis-5/6">
                  {goods.limitDay}일/유효기간 만료 후 연장 및 환불 불가
                </span>
              </div>
              <div className="mt-5 flex justify-start gap-3">
                <span className="xl:text-lg font-bold basis-1/4 xl:basis-1/6">
                  구매방식
                </span>
                <span className="xl:text-lg basis-3/4 xl:basis-5/6">
                  모바일 쿠폰 발송
                </span>
              </div>
              <div className="mt-5 flex flex-col lg:flex-row justify-start gap-3">
                <button
                  className="block text-center w-full lg:w-1/2 transition-all duration-150 ease-in-out bg-indigo-500 text-white py-2 px-5 rounded hover:bg-indigo-700 font-medium"
                  onClick={e => buyIt()}
                >
                  포인트로 구입하기
                </button>
                {user.phone !== "" && (
                  <button
                    className="block text-center w-full lg:w-1/3 transition-all duration-150 ease-in-out border border-gray-500 py-2 px-5 rounded hover:bg-teal-100 font-medium"
                    onClick={e => modalChk()}
                  >
                    오류제보
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="xl:container w-11/12 mx-auto bg-white mt-3 p-2">
            <h3 className="xl:text-center p-3 xl:text-2xl font-bold mb-3 pb-3 border-b">
              상품 상세정보 및 유의사항
            </h3>
            <div
              className="xl:w-5/6 mx-auto"
              dangerouslySetInnerHTML={{
                __html: sanitizer(content).replace(
                  /href/g,
                  "target='_blank' href"
                ),
              }}
            />
          </div>
          <Recommend category={goods.category1Seq} />
          <div className="sticky bottom-0 left-0 right-0 w-full bg-gray-50 border-t-2 border-gray-300 p-2">
            <div className="mx-auto my-auto w-11/12  lg:container flex flex-col lg:flex-row justify-center gap-3 py-3">
              <div className="flex flex-col lg:flex-row lg:flex-nowrap justify-center gap-2 w-full lg:w-2/3 mx-auto">
                <button
                  className="block text-center w-full lg:w-1/2 transition-all duration-150 ease-in-out bg-indigo-500 text-white py-2 px-5 rounded hover:bg-indigo-700 font-medium"
                  onClick={e => buyIt()}
                >
                  포인트로 구입하기
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {modalOn ? (
        <GiftModal user={user} goods={goods} setModalOn={setModalOn} />
      ) : null}
    </>
  );
}

export default GiftDetail;
