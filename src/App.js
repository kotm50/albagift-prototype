import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, clearUser } from "./Reducer/userSlice";
import { db, auth } from "./firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Helmet } from "react-helmet-async";

import { path } from "./path/path";

import Header from "./Component/Header";
import Footer from "./Component/Footer";
import ToTop from "./Component/ToTop";
import Bg from "./Component/Bg";
import Complete from "./Component/Complete";
import SurveySample from "./Component/SurveySample";
import BasicSurvey from "./Component/BasicSurvey";
import Survey from "./Component/Survey";
import SurveyList from "./Component/SurveyList";
import ApplyList from "./Component/Apply/ApplyList";
import Result from "./Component/Result";
import Error from "./Component/Error";
import Meeting from "./Component/Meeting";
import Meet from "./Component/Meet";
import Test from "./Component/Test";
import AdminRegist from "./Component/AdminRegist";
import AdminLogin from "./Component/AdminLogin";
import Login from "./Component/Login";
import LoginMain from "./Component/Login/LoginMain";
import EmailLogin from "./Component/Login/EmailLogin";
import EmailRegist from "./Component/Login/EmailRegist";
import PhoneLogin from "./Component/Login/PhoneLogin";
import Logout from "./Component/Logout";
import UserInfo from "./Component/User/UserInfo";
import InputVisit from "./Component/visit/InputVisit";
import BeforeVisit from "./Component/visit/BeforeVisit";
import VisitInfo from "./Component/visit/VisitInfo";
import VisittoAdmin from "./Component/visit/VisittoAdmin";
import GiftList from "./Component/giftishow/GiftList";
import GiftReset from "./Component/giftishow/GiftReset";
import GiftDetail from "./Component/giftishow/GiftDetail";
import BuyComplete from "./Component/giftishow/BuyComplete";
import CouponList from "./Component/giftishow/CouponList";
import Loading from "./Component/Loading";
import Tv from "./Component/Tv";
import InputProfile from "./Component/User/InputProfile";
import Profile from "./Component/User/Profile";
import TotalTable from "./Component/Second/TotalTable";
import After from "./Component/visit/After";
import InputAfter from "./Component/visit/InputAfter";
import Subscribe from "./Component/Profile/Subscribe";
import SubList from "./Component/Profile/SubList";
import SubDetail from "./Component/Profile/SubDetail";
import SubscribeGenerator from "./Component/Profile/SubscribeGenerator";
import AdAgree from "./Component/Agree/AdAgree";
import AgreeResult from "./Component/Agree/AgreeResult";
import AdGenerator from "./Component/Agree/Generator";
import AgreeList from "./Component/Agree/AgreeList";
import Admin from "./Component/AdminBeta/Admin";
import GiftAdmin from "./Component/GiftAdmin/GiftAdmin";
import GiftAdminMain from "./Component/GiftAdmin/Main";
import GiftAdminApply from "./Component/GiftAdmin/ApplyList";
import GiftAdminCoupon from "./Component/GiftAdmin/CouponList";
import GiftAdminReport from "./Component/GiftAdmin/ReportList";
import GiftAdminPointBoard from "./Component/GiftAdmin/ApplyBoard";
import Promo from "./Component/Promotion/Promo";
import GetPoint from "./Component/User/GetPoint";
import InputPoint from "./Component/GiftAdmin/InputPoint";
import PointLog from "./Component/GiftAdmin/PointLog";
import GiftInfo from "./Component/giftishow/GiftInfo";
import CompanySurvey from "./Component/Company/CompanySurvey";
import Main from "./Component/Homepage/Main";

function App() {
  const [loginChk, setLoginChk] = useState(false);
  const [title, setTitle] = useState("알바선물 | 면접보고 선물받자!");
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user !== null) {
        getAdmin(user);
      } else {
        dispatch(clearUser());
      }
    });
    setLoginChk(true);
    // eslint-disable-next-line
  }, [dispatch]);

  const thisLocation = useLocation();
  useEffect(() => {
    where(path.some(chkBg));
  });

  const chkBg = (element, index, array) => {
    return thisLocation.pathname.startsWith(element);
  };
  const where = e => {
    if (e) {
      if (
        thisLocation.pathname !== "/promo" ||
        thisLocation.pathname !== "/login" ||
        thisLocation.pathname !== "/join"
      ) {
        setTitle("채용 No.1 코리아티엠");
      } else {
        setTitle("알바선물 | 면접보고 선물받자!");
      }
    } else {
      setTitle("알바선물 | 면접보고 선물받자!");
    }
  };

  const getAdmin = async user => {
    if (user.displayName !== "admin") {
      if (user.uid !== "") {
        let applyRef = collection(db, "apply");
        let result = await getDoc(doc(applyRef, `${user.uid}`));
        if (!result.data()) {
          dispatch(
            loginUser({
              uid: user.uid,
              accessToken: user.accessToken,
              admin: false,
              name: "",
              point: 0,
              phone: "",
            })
          );
        } else {
          dispatch(
            loginUser({
              uid: user.uid,
              accessToken: user.accessToken,
              admin: false,
              name: result.data().name,
              point: result.data().point,
              phone: result.data().phone,
            })
          );
        }
      }
    } else {
      if (user.uid !== "") {
        let applyRef = collection(db, "admin");
        let result = await getDoc(doc(applyRef, `${user.uid}`));
        dispatch(
          loginUser({
            uid: user.uid,
            accessToken: user.accessToken,
            admin: true,
            name: result.data().name,
            point: 0,
            phone: 0,
          })
        );
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {!loginChk ? (
        <Loading />
      ) : (
        <>
          <Bg />
          <Header />
          <UserInfo />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/promo" element={<Promo />} />
            <Route path="/tv" element={<Tv />} />
            <Route path="/test" element={<Test />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/complete" element={<Complete />} />
            <Route path="/surveysample" element={<SurveySample />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/surveylist" element={<SurveyList />} />
            <Route path="/applylist" element={<ApplyList />} />
            <Route path="/result" element={<Result />} />
            <Route path="/error" element={<Error />} />
            <Route path="/meeting" element={<Meeting />} />
            <Route path="/meet" element={<Meet />} />
            <Route path="/after" element={<After />} />
            <Route path="/inputafter" element={<InputAfter />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/companysurvey" element={<CompanySurvey />} />
            <Route
              path="/inputprofile/:uid?/:promo?"
              element={<InputProfile />}
            />
            <Route path="/profile/:uid?" element={<Profile />} />
            <Route path="/inputvisit" element={<InputVisit />} />
            <Route path="/beforevisit" element={<BeforeVisit />} />
            <Route path="/visit/:aliasNum?" element={<VisitInfo />} />
            <Route path="/visitadmin/:aliasNum?" element={<VisittoAdmin />} />
            <Route path="/giftlist/:cateno?/:brandno?" element={<GiftList />} />
            <Route path="/giftdetail/:goodsCode?" element={<GiftDetail />} />
            <Route path="/giftinfo" element={<GiftInfo />} />
            <Route path="/giftadmin" element={<GiftAdmin />}>
              <Route path="" element={<GiftAdminMain />} />
              <Route path="apply/:phone?" element={<GiftAdminApply />} />
              <Route path="coupon" element={<GiftAdminCoupon />} />
              <Route path="report" element={<GiftAdminReport />} />
              <Route path="pointboard" element={<GiftAdminPointBoard />} />
              <Route path="inputpoint" element={<InputPoint />} />
              <Route path="pointlog" element={<PointLog />} />
              <Route path="giftreset" element={<GiftReset />} />
              <Route path="sublist" element={<SubList />} />
              <Route path="surveylist" element={<SurveyList />} />
            </Route>
            <Route path="/buycomplete" element={<BuyComplete />} />
            <Route path="/couponlist/:uid?" element={<CouponList />} />
            <Route path="/adminregist" element={<AdminRegist />} />
            <Route path="/login" element={<Login />}>
              <Route path="" element={<LoginMain />} />
              <Route path="phone" element={<PhoneLogin />} />
              <Route path="emailregist" element={<EmailRegist />} />
              <Route path="email" element={<EmailLogin />} />
            </Route>
            <Route path="/totaltable" element={<TotalTable />} />
            <Route path="/subscribe/:alias?" element={<Subscribe />} />
            <Route path="/subdetail/:alias?" element={<SubDetail />} />
            <Route
              path="/subscribegenerator"
              element={<SubscribeGenerator />}
            />
            <Route path="/sublist" element={<SubList />} />
            <Route path="/adagree/:gid?" element={<AdAgree />} />
            <Route path="/agreeresult/:gid?" element={<AgreeResult />} />
            <Route path="/adgenerator" element={<AdGenerator />} />
            <Route path="/agreelist" element={<AgreeList />} />
            <Route path="/macbook" element={<Admin />} />
            <Route path="/getpoint" element={<GetPoint />} />
          </Routes>
          <Footer />
          <ToTop />
        </>
      )}
    </>
  );
}

export default App;
