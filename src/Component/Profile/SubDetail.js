import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

import InputCard from "./InputCard";

import template1 from "../../Asset/Profile/template1.png";
import template2 from "../../Asset/Profile/template2.png";
import template3 from "../../Asset/Profile/template3.png";
import template4 from "../../Asset/Profile/template4.png";
import template5 from "../../Asset/Profile/template5.png";
import template6 from "../../Asset/Profile/template6.png";

function SubDetail() {
  let navi = useNavigate();
  const [profile, setProfile] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [photo1, setPhoto1] = useState("");
  const [photo2, setPhoto2] = useState("");
  const [photo3, setPhoto3] = useState("");
  const [photo4, setPhoto4] = useState("");
  const [photo5, setPhoto5] = useState("");
  const [photo6, setPhoto6] = useState("");
  const [photoTask1, setPhotoTask1] = useState("");
  const [photoTask2, setPhotoTask2] = useState("");
  const [photoTask3, setPhotoTask3] = useState("");
  const [photoTask4, setPhotoTask4] = useState("");
  const [photoTask5, setPhotoTask5] = useState("");
  const [photoTask6, setPhotoTask6] = useState("");
  const { alias } = useParams();

  useEffect(() => {
    getProfile();
    //eslint-disable-next-line
  }, []);

  const getProfile = async () => {
    const profRef = collection(db, "profile");
    await getDoc(doc(profRef, `${alias}`))
      .then(result => {
        setProfile(result.data());
      })
      .catch(error => {
        alert(error);
      });
  };

  const complete = async () => {
    const submit = window.confirm(
      "한번 완료하면 다시 수정할 수 없습니다. 완료할까요?"
    );
    if (submit) {
      let body = {
        card1: photo1,
        card2: photo2,
        card3: photo3,
        card4: photo4,
        card5: photo5,
        card6: photo6,
        cardTask1: photoTask1,
        cardTask2: photoTask2,
        cardTask3: photoTask3,
        cardTask4: photoTask4,
        cardTask5: photoTask5,
        cardTask6: photoTask6,
        complete: true,
      };
      const profileRef = doc(collection(db, "profile"), `${alias}`);
      await updateDoc(profileRef, body).then(() => {
        alert("저장이 완료되었습니다.");
        window.location.reload(false);
      });
    }
  };
  return (
    <>
      {profile !== {} ? (
        <div
          className={
            loaded
              ? "bg-white w-11/12 xl:container mx-auto p-5 rounded-lg"
              : "opacity-0"
          }
        >
          <h2 className="text-2xl font-medium p-2 border-b border-gray-300 mb-2 bg-indigo-500 text-white">
            {profile.name}님의 신청서입니다
          </h2>
          <div className="mt-5 p-2 bg-indigo-50 text-lg font-medium">
            프로필에 사용할 사진
          </div>
          <div className="p-2">
            <img
              src={profile.photo}
              alt={`${profile.name}님의 사진`}
              className="h-96"
              onLoad={e => setLoaded(true)}
              onError={e => setLoaded(true)}
            />
          </div>
          <div className="mt-5 p-2 bg-indigo-50 text-lg font-medium">
            필터 적용 여부
          </div>
          <div className="p-2 text-lg">{profile.filter}</div>
          <div className="mt-5 p-2 bg-indigo-50 text-lg font-medium">
            사용 템플릿
          </div>
          <div className="p-2 text-lg">
            {profile.temp}
            {profile.temp !== undefined ? (
              <img
                src={
                  profile.temp[0] === "템플릿 1"
                    ? template1
                    : profile.temp[0] === "템플릿 2"
                    ? template2
                    : profile.temp[0] === "템플릿 3"
                    ? template3
                    : profile.temp[0] === "템플릿 4"
                    ? template4
                    : profile.temp[0] === "템플릿 5"
                    ? template5
                    : profile.temp[0] === "템플릿 6"
                    ? template6
                    : null
                }
                alt={profile.temp[0]}
                className="h-96"
              />
            ) : null}
          </div>
          <div className="mt-5 p-2 bg-indigo-50 text-lg font-medium">
            지점명
          </div>
          <div className="p-2 text-lg">{profile.center}</div>
          <div className="mt-5 p-2 bg-indigo-50 text-lg font-medium">
            이름과 직책
          </div>
          <div className="p-2 text-lg">{profile.name}</div>
          <div className="mt-5 p-2 bg-indigo-50 text-lg font-medium">
            연락처
          </div>
          <div className="p-2 text-lg">{profile.phone}</div>
          <div className="mt-5 p-2 bg-indigo-50 text-lg font-medium">
            경력 및 수상내용
          </div>
          <div className="p-2 text-lg">{profile.career1}</div>
          <div className="p-2 text-lg">{profile.career2}</div>
          <div className="p-2 text-lg">{profile.career3}</div>
          <div className="mt-5 p-2 bg-indigo-50 text-lg font-medium">
            그 외 요구사항
          </div>
          <div className="p-2 text-lg mb-10">{profile.etc}</div>
          {!profile.complete ? (
            <>
              <div className="p-2">
                <InputCard
                  no={1}
                  alias={alias}
                  photo={photo1}
                  setPhoto={setPhoto1}
                  photoTask={photoTask1}
                  setPhotoTask={setPhotoTask1}
                />
              </div>
              <div className="p-2">
                <InputCard
                  no={2}
                  alias={alias}
                  photo={photo2}
                  setPhoto={setPhoto2}
                  photoTask={photoTask2}
                  setPhotoTask={setPhotoTask2}
                />
              </div>
              <div className="p-2">
                <InputCard
                  no={3}
                  alias={alias}
                  photo={photo3}
                  setPhoto={setPhoto3}
                  photoTask={photoTask3}
                  setPhotoTask={setPhotoTask3}
                />
              </div>
              <div className="p-2">
                <InputCard
                  no={4}
                  alias={alias}
                  photo={photo4}
                  setPhoto={setPhoto4}
                  photoTask={photoTask4}
                  setPhotoTask={setPhotoTask4}
                />
              </div>
              <div className="p-2">
                <InputCard
                  no={5}
                  alias={alias}
                  photo={photo5}
                  setPhoto={setPhoto5}
                  photoTask={photoTask5}
                  setPhotoTask={setPhotoTask5}
                />
              </div>
              <div className="p-2">
                <InputCard
                  no={6}
                  alias={alias}
                  photo={photo6}
                  setPhoto={setPhoto6}
                  photoTask={photoTask6}
                  setPhotoTask={setPhotoTask6}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mt-5 p-2 bg-indigo-50 text-lg font-medium">
                완성 프로필
              </div>
              <div className="p-2 text-lg">
                <img src={profile.card1} alt="프로필1" />
              </div>
              {profile.card2 ? (
                <div className="p-2 text-lg">
                  <img src={profile.card2} alt="프로필2" />
                </div>
              ) : null}
              {profile.card3 ? (
                <div className="p-2 text-lg">
                  <img src={profile.card3} alt="프로필3" />
                </div>
              ) : null}
              {profile.card4 ? (
                <div className="p-2 text-lg">
                  <img src={profile.card4} alt="프로필4" />
                </div>
              ) : null}
              {profile.card5 ? (
                <div className="p-2 text-lg">
                  <img src={profile.card5} alt="프로필5" />
                </div>
              ) : null}
              {profile.card6 ? (
                <div className="p-2 text-lg">
                  <img src={profile.card6} alt="프로필6" />
                </div>
              ) : null}
            </>
          )}
          {profile.complete ? (
            <div className="grid grid-cols-1 gap-3">
              <button
                className="bg-red-500 hover:bg-red-700 p-2 text-white text-center"
                onClick={e => navi(-1)}
              >
                신청서 리스트로
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                className="bg-indigo-500 hover:bg-indigo-700 p-2 text-white text-center"
                onClick={e => complete()}
              >
                프로필 올리기
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 p-2 text-white text-center"
                onClick={e => navi(-1)}
              >
                신청서 리스트로
              </button>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}

export default SubDetail;
