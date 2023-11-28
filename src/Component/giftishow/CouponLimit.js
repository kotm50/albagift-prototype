import React, { useState, useEffect } from "react";

function CouponLimit(props) {
  const [limit, setLimit] = useState("모름");
  const [period, setPeriod] = useState(0);
  useEffect(() => {
    if (props.coupon.limitDate !== undefined) {
      const date = props.coupon.limitDate.toDate();
      const dateString = date.toLocaleDateString();
      // 현재 날짜를 가져옴
      const currentDate = new Date();

      // 두 날짜의 차이를 밀리초 단위로 계산
      const diffInMilliseconds = date - currentDate;

      // 밀리초를 일로 변환. Math.ceil을 사용하여 올림 처리.
      const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
      setPeriod(diffInDays);
      setLimit(dateString);
    }
    //eslint-disable-next-line
  }, []);
  return (
    <>
      {props.usable ? (
        <p className="text-lg font-medium text-gray-700 truncate">
          만료일 : {limit}{" "}
          {period <= 5 ? (
            <>
              <span className="text-rose-500 font-bold text-lg">만료임박</span>
            </>
          ) : null}
        </p>
      ) : (
        <p className="text-lg font-medium text-rose-700 truncate">
          사용완료쿠폰
        </p>
      )}
    </>
  );
}

export default CouponLimit;
