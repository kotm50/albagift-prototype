import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import Loading from "../Loading";

import user2 from "../../Asset/user2.png";

function Profile() {
  const today = new Date();
  let navi = useNavigate();
  const { uid } = useParams();
  const user = useSelector(state => state.user);
  const [profile, setProfile] = useState({});
  const [age, setAge] = useState(null);
  const [birthYear, setBirthYear] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    getProfile(uid);
    // eslint-disable-next-line
  }, []);
  const getProfile = async uid => {
    const applyRef = collection(db, "apply");
    await getDoc(doc(applyRef, `${uid}`))
      .then(result => {
        console.log(result.data());
        setProfile(result.data());
        let birthY = result.data().birth.substring(0, 4);
        let age = today.getFullYear() - birthY;
        setBirthYear(birthY);
        setAge(age);
      })
      .catch(error => {
        alert(error);
      });
    if (profile !== {}) {
      setLoaded(true);
    }
  };
  return (
    <>
      {!loaded ? (
        <Loading />
      ) : (
        <>
          <div className="bg-white w-11/12 xl:container mx-auto">
            <h2 className="text-xl xl:text-3xl font-medium p-2 indent-10 py-3 border-b border-gray-300 mb-2 bg-indigo-500 text-white">
              {profile.name}님의 프로필입니다
            </h2>
            <div className="xl:container mx-auto">
              <div className="flex flex-col justify-start gap-1 p-2">
                <div className="mx-auto">
                  <div className="w-48 h-48 xl:w-72 xl:h-72 rounded-full overflow-hidden flex flex-col justify-center bg-indigo-500 mx-auto">
                    {profile.photo !== "" ? (
                      <img src={profile.photo} alt="프로필" />
                    ) : (
                      <img src={user2} className="w-full" alt="프로필" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5 mx-auto">
                  <div className="flex flex-row flex-nowrap gap-3 xl:text-xl">
                    <div className="font-normal">유형</div>
                    <div className="font-medium">{profile.type}</div>
                  </div>
                  <div className="flex flex-row flex-nowrap gap-3 xl:text-xl">
                    <div className="font-normal">이름</div>
                    <div className="font-medium">{profile.name}</div>
                  </div>
                  <div className="flex flex-row flex-nowrap gap-3 xl:text-xl">
                    <div className="font-normal">나이</div>
                    <div className="font-medium">
                      {age}세<small className="ml-2">({birthYear}년생)</small>
                    </div>
                  </div>
                  <div className="flex flex-row flex-nowrap gap-3 xl:text-xl">
                    <div className="font-normal">지역</div>
                    <div className="font-medium">
                      {profile.city} {profile.town}
                    </div>
                  </div>
                  <div className="flex flex-row flex-nowrap gap-3 xl:text-xl">
                    <div className="font-normal">연락처</div>
                    {uid === user.uid ? (
                      <div className="font-medium">
                        {profile.phone
                          .replace(/[^0-9]/g, "")
                          .replace(
                            /(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g,
                            "$1-$2-$3"
                          )}
                      </div>
                    ) : (
                      <div className="font-medium">비공개</div>
                    )}
                  </div>
                  <div className="flex flex-row flex-nowrap gap-3 xl:text-xl">
                    <div className="font-normal">포인트</div>
                    <div className="font-medium text-lg text-indigo-500">
                      {profile.point}
                    </div>
                  </div>
                  <div className="hidden xl:flex flex-row flex-nowrap gap-3  xl:text-xl">
                    <div className="font-normal">이메일</div>
                    <div className="font-medium">
                      {profile.email}@{profile.domain}
                    </div>
                  </div>
                </div>

                <div className="xl:hidden flex flex-row flex-nowrap gap-3 text-lg mt-2">
                  <div className="font-normal">이메일</div>
                  <div className="font-medium">
                    {profile.email}@{profile.domain}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white my-2 w-full text-center py-2">
              <div className="mx-auto ">
                <button
                  className="bg-indigo-500 hover:bg-indigo-700 text-white p-2 rounded px-10"
                  onClick={e => navi(`/inputprofile/${uid}`)}
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Profile;
