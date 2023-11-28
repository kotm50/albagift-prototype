import React, { useState, useEffect } from "react";
import axios from "axios";

function GetCouponStat(props) {
  const [stat, setStat] = useState("");
  useEffect(() => {
    getCoupon();
    // eslint-disable-next-line
  }, []);

  const getCoupon = async () => {
    if (props.pinNo !== "null") {
      try {
        const response = await axios.post("/bizApi/coupons", {
          trId: props.trId,
        });
        let pinstat = response.data.result[0].couponInfoList[0].pinStatusNm;
        setStat(pinstat);
      } catch (e) {
        setStat("오류쿠폰");
      }
    }
  };

  return <>상태 : {stat}</>;
}

export default GetCouponStat;
