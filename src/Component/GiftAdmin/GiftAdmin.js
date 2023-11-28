import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function GiftAdmin() {
  const [loaded, setLoaded] = useState(false);
  const user = useSelector(state => state.user);
  const location = useLocation();
  let navi = useNavigate();
  useEffect(() => {
    chkAdmin(user);
    // eslint-disable-next-line
  }, [location]);

  const chkAdmin = user => {
    setTimeout(() => {
      if (!user.admin) {
        alert("관리자 로그인이 필요합니다");
        navi("/adminlogin");
      } else {
        setLoaded(true);
        return true;
      }
    }, 500);
  };

  return (
    <>
      {loaded ? (
        <div className="container mx-auto grid grid-cols-5 h-50">
          <div className="bg-indigo-50 h-full">
            <Link to="/giftadmin/">
              <h2 className="bg-indigo-500 text-white p-2 text-xl font-medium">
                코티 면접샵 관리자 페이지
              </h2>
            </Link>
            <div className="flex flex-col justify-start divide-y-2">
              <Link
                to="/giftadmin/pointboard"
                className="text-lg p-2 hover:bg-indigo-200 font-medium hover:font-bold w-full text-rose-500 hover:text-rose-700"
              >
                지급 신청 목록
              </Link>
              <Link
                to="/giftadmin/apply"
                className="text-lg p-2 hover:bg-indigo-200 hover:font-medium w-full"
              >
                회원현황
              </Link>
              <Link
                to="/giftadmin/pointlog"
                className="text-lg p-2 hover:bg-indigo-200 hover:font-medium w-full"
              >
                포인트 지급 현황
              </Link>
              <Link
                to="/giftadmin/coupon"
                className="text-lg p-2 hover:bg-indigo-200 hover:font-medium w-full"
              >
                쿠폰현황
              </Link>
              <Link
                to="/giftadmin/giftreset"
                className="text-lg p-2 hover:bg-indigo-200 hover:font-medium w-full"
              >
                상품/브랜드 재설정
              </Link>

              <Link
                to="/giftadmin/sublist"
                className="text-lg p-2 hover:bg-indigo-200 hover:font-medium w-full"
              >
                Koti프로필 생성신청
              </Link>

              <Link
                to="/giftadmin/surveylist"
                className="text-lg p-2 hover:bg-indigo-200 hover:font-medium w-full"
              >
                KoTI설문지 리스트
              </Link>
            </div>
          </div>
          <div id="admin" className="bg-white col-span-4 p-2">
            <Outlet />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default GiftAdmin;
