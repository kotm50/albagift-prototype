import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearUser, buyGift } from "../../Reducer/userSlice";

import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "../../firebase";

import { collection, doc, getDoc } from "firebase/firestore";

import Loading from "../Loading";
import { path } from "../../path/path";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";

function UserInfo() {
  const thisLocation = useLocation();
  const user = useSelector(state => state.user);
  const [isLogin, setIsLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [detail, setDetail] = useState(false);

  useEffect(() => {
    setIsOpen(path.some(chkBg));
    // eslint-disable-next-line
  }, [thisLocation]);
  const chkBg = (element, index, array) => {
    return thisLocation.pathname.startsWith(element);
  };

  useEffect(() => {
    if (user.accessToken === "") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
    // eslint-disable-next-line
  }, [user]);
  let navi = useNavigate();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (user.uid !== "") {
      setProfile(user);
      setAdmin(user.admin);
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (user.uid !== "") {
      getPoint();
    }
    //eslint-disable-next-line
  }, [thisLocation]);

  const getPoint = async () => {
    const pointRef = doc(collection(db, "apply"), user.uid);
    let point = await getDoc(pointRef);
    let pp = point?.data()?.point || 0; // 수정된 부분
    if (pp !== user.point) {
      await dispatch(
        buyGift({
          point: pp,
        })
      );
    }
  };

  const logout = async () => {
    await signOut(auth)
      .then(() => {
        alert("로그아웃 되었습니다, 이용해주셔서 감사합니다");
        onAuthStateChanged(auth, user => {
          if (user !== null) {
            dispatch(
              loginUser({ uid: user.uid, accessToken: user.accessToken })
            );
          } else {
            dispatch(clearUser());
          }
        });
        navi("/");
      })
      .catch(error => {
        // An error happened.
      });
  };

  return (
    <>
      {!isOpen ? (
        <>
          <div className="hidden xl:block container mx-auto font-medium lg:text-3xl mt-0 text-center">
            <div className="w-full p-2 flex gap-2 justify-around border bg-white border-gray-200 my-2">
              {!isLogin ? (
                <>
                  <div className="w-full grid grid-cols-2">
                    <div className="text-lg p-2">로그인이 필요합니다</div>
                    <div className="w-full flex justify-around">
                      <button
                        className="w-full max-w-xs transition-all duration-300 rounded-lg bg-indigo-500 hover:bg-indigo-700 text-base font-normal text-white mx-auto"
                        onClick={e => {
                          navi("/login");
                        }}
                      >
                        회원가입/로그인
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {profile === null ? (
                    <Loading />
                  ) : (
                    <>
                      <div className="w-full flex flex-row flex-nowrap gap-3 justify-between">
                        <div className="w-full grid grid-cols-2  basis-1/3">
                          {!admin ? (
                            <>
                              <div className="text-black text-base font-normal flex flex-col justify-center">
                                안녕하세요!{" "}
                                {profile.name ? profile.name + "님" : null}
                              </div>
                              <div className="text-black text-base font-normal flex flex-col justify-center">
                                <span>
                                  면접포인트{" "}
                                  {profile.point ? (
                                    <span className="text-lg text-indigo-500 font-bold">
                                      {String(profile.point)}
                                    </span>
                                  ) : (
                                    <span className="text-lg text-indigo-500 font-bold">
                                      0
                                    </span>
                                  )}{" "}
                                  point
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-black text-base font-normal flex flex-col justify-center basis-1/2">
                              안녕하세요!{" "}
                              {profile.name ? profile.name + " 관리자님" : null}
                            </div>
                          )}
                        </div>
                        <div className="basis-2/3">
                          {!admin ? (
                            <div className="grid grid-cols-4 gap-2">
                              <div className="flex flex-col justify-center">
                                <button
                                  className="w-full max-w-xs transition-all duration-300 rounded-lg bg-orange-500 hover:bg-orange-700 text-base font-normal text-white mx-auto p-2"
                                  onClick={e => {
                                    navi(`/getpoint`);
                                  }}
                                >
                                  포인트 지급 신청
                                </button>
                              </div>
                              <div className="flex flex-col justify-center">
                                <button
                                  className="w-full max-w-xs transition-all duration-300 rounded-lg bg-indigo-500 hover:bg-indigo-700 text-base font-normal text-white mx-auto p-2"
                                  onClick={e => {
                                    navi(`/profile/${profile.uid}`);
                                  }}
                                >
                                  프로필 확인/수정
                                </button>
                              </div>
                              <div className="flex flex-col justify-center">
                                <button
                                  className="w-full max-w-xs transition-all duration-300 rounded-lg bg-teal-500 hover:bg-teal-700 text-base font-normal text-white mx-auto p-2"
                                  onClick={e => {
                                    navi(`/couponlist/${profile.uid}`);
                                  }}
                                >
                                  보유 쿠폰 확인
                                </button>
                              </div>
                              <div className="flex flex-col justify-center">
                                <button
                                  className="w-full max-w-xs transition-all duration-300 rounded-lg bg-gray-200 hover:bg-gray-300 border-indigo-500 text-base font-normal text-black p-2 mx-auto"
                                  onClick={e => {
                                    logout();
                                  }}
                                >
                                  로그아웃
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col justify-center">
                              <button
                                className="w-full max-w-xs transition-all duration-300 rounded-lg bg-gray-200 hover:bg-gray-300 border-indigo-500 text-base font-normal text-black p-2 mx-auto"
                                onClick={e => {
                                  logout();
                                }}
                              >
                                로그아웃
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="xl:hidden block w-11/12 mx-auto font-medium lg:text-3xl mt-0 text-center">
            <div className="w-full p-2 gap-2 border bg-white border-gray-200 my-2">
              {!isLogin ? (
                <>
                  <div className="w-full grid grid-cols-1">
                    <div className="text-lg p-2">로그인이 필요합니다</div>
                    <div className="w-full flex justify-around">
                      <button
                        className="w-full max-w-xs transition-all duration-300 rounded-lg bg-indigo-500 hover:bg-indigo-700 text-base font-normal text-white mx-auto py-2"
                        onClick={e => {
                          navi("/login");
                        }}
                      >
                        회원가입/로그인
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {profile === null ? (
                    <Loading />
                  ) : (
                    <>
                      <div className="w-full flex flex-col gap-3 justify-start">
                        <div className="w-full grid grid-cols-1 md:grid-cols-2">
                          {!admin ? (
                            <>
                              <div className="text-black text-base font-normal flex flex-col justify-center">
                                <div>
                                  안녕하세요!{" "}
                                  <strong>
                                    {profile.name ? profile.name : null}
                                  </strong>{" "}
                                  님
                                </div>
                              </div>
                              <div className="text-black text-base font-normal flex flex-col justify-center">
                                <button
                                  className="border bg-indigo-500 text-white p-1 rounded-lg text-center font-medium"
                                  onClick={e => setDetail(!detail)}
                                >
                                  {!detail ? (
                                    <FaAngleDown size={24} className="inline" />
                                  ) : (
                                    <FaAngleUp size={24} className="inline" />
                                  )}{" "}
                                  상세정보 {!detail ? "열기" : "닫기"}{" "}
                                  {!detail ? (
                                    <FaAngleDown size={24} className="inline" />
                                  ) : (
                                    <FaAngleUp size={24} className="inline" />
                                  )}
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-black text-base font-normal flex flex-col justify-center basis-1/2">
                              안녕하세요!{" "}
                              {profile.name ? profile.name + " 관리자님" : null}
                            </div>
                          )}
                        </div>
                        <>
                          {detail ? (
                            <>
                              {!admin ? (
                                <div className="grid grid-cols-1 gap-1">
                                  <div className="flex flex-col justify-center">
                                    <div>
                                      면접포인트{" "}
                                      {profile.point ? (
                                        <span className="text-lg text-indigo-500 font-bold">
                                          {profile.point}
                                        </span>
                                      ) : (
                                        <span className="text-lg text-indigo-500 font-bold">
                                          0
                                        </span>
                                      )}{" "}
                                      point
                                    </div>
                                  </div>
                                  <div className="flex flex-col justify-center">
                                    <button
                                      className="w-full max-w-xs transition-all duration-300 rounded-lg bg-orange-500 hover:bg-orange-700 text-base font-normal text-white mx-auto p-2"
                                      onClick={e => {
                                        navi(`/getpoint`);
                                      }}
                                    >
                                      포인트 지급 신청
                                    </button>
                                  </div>
                                  <div className="flex flex-col justify-center">
                                    <button
                                      className="w-full max-w-xs transition-all duration-300 rounded-lg bg-indigo-500 hover:bg-indigo-700 text-base font-normal text-white mx-auto p-2"
                                      onClick={e => {
                                        navi(`/profile/${profile.uid}`);
                                      }}
                                    >
                                      프로필 확인/수정
                                    </button>
                                  </div>
                                  <div className="flex flex-col justify-center">
                                    <button
                                      className="w-full max-w-xs transition-all duration-300 rounded-lg bg-teal-500 hover:bg-teal-700 text-base font-normal text-white mx-auto p-2"
                                      onClick={e => {
                                        navi(`/couponlist/${profile.uid}`);
                                      }}
                                    >
                                      보유 쿠폰 확인
                                    </button>
                                  </div>
                                  <div className="flex flex-col justify-center">
                                    <button
                                      className="w-full max-w-xs transition-all duration-300 rounded-lg bg-gray-200 hover:bg-gray-300 border-indigo-500 text-base font-normal text-black p-2 mx-auto"
                                      onClick={e => {
                                        logout();
                                      }}
                                    >
                                      로그아웃
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col justify-center">
                                  <button
                                    className="w-full max-w-xs transition-all duration-300 rounded-lg bg-gray-200 hover:bg-gray-300 border-indigo-500 text-base font-normal text-black p-2 mx-auto"
                                    onClick={e => {
                                      logout();
                                    }}
                                  >
                                    로그아웃
                                  </button>
                                </div>
                              )}
                            </>
                          ) : null}
                        </>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default UserInfo;
