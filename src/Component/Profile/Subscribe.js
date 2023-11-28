import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";

import { db } from "../../firebase";

import InputPhoto from "./InputPhoto";
import Agree from "./Agree";
import Template from "./Template";
import Filter from "./Filter";

function Subscribe() {
  const { alias } = useParams();

  const [agree, setAgree] = useState(false);
  const [photo, setPhoto] = useState("");
  const [photoTask, setPhotoTask] = useState("");
  const [center, setCenter] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [career1, setCareer1] = useState("");
  const [career2, setCareer2] = useState("");
  const [career3, setCareer3] = useState("");
  const [etc, setEtc] = useState("");
  const [filter, setFilter] = useState("");
  const [temp, setTemp] = useState([]);

  const submit = async () => {
    if (alias === null || alias === "" || alias === undefined) {
      return alert("고유번호가 없어서 입력이 불가능합니다");
    }
    if (career1 === "" || career2 === "") {
      return alert(
        "경력/수상내역을 2개 이상 입력해주세요\n없다면 자신의 장점을 적어주셔도 됩니다."
      );
    }
    if (!agree) {
      return alert("개인정보 이용에 동의하셔야 제작이 가능합니다");
    } else {
      let body = {
        alias: alias,
        agree: agree,
        photo: photo,
        photoTask: photoTask,
        center: center,
        name: name,
        phone: phone,
        career1: career1,
        career2: career2,
        career3: career3,
        etc: etc,
        filter: filter,
        temp: temp,
        complete: false,
        created: serverTimestamp(),
      };
      let submit = window.confirm(`신청서를 제출합니다. 진행할까요?`);
      if (submit) {
        const profileRef = collection(db, "profile");
        await setDoc(doc(profileRef, `${alias}`), body);
        alert(`신청서 제출이 완료되었습니다.`);
      }
    }
  };
  return (
    <>
      <div className="container mx-auto bg-white rounded-lg my-3 py-3 px-5">
        <h1 className="p-2 border-b text-2xl xl:text-3xl font-bold text-purple-500 mb-3 text-center xl:text-left">
          KoTI 프로필 신청서
        </h1>
        <div className="container mx-auto mb-5">
          <h2 className="py-2 text-md xl:text-2xl font-medium mx-auto">
            1. 프로필에 표시할 사진을 올려주세요
          </h2>
          <InputPhoto
            alias={alias}
            photo={photo}
            setPhoto={setPhoto}
            photoTask={photoTask}
            setPhotoTask={setPhotoTask}
          />
        </div>
        <div className="container mx-auto mb-5">
          <h2 className="py-2 text-md xl:text-2xl font-medium mx-auto">
            2. 사진 스타일을 선택해 주세요.<small>(중복선택 불가)</small>
            <small className="font-normal block">
              필터 적용 시 사진을 카툰 스타일로 보정해 드립니다. 원치 않으시면
              '미적용'을 선택해 주세요
            </small>
          </h2>
          <Filter filter={filter} setFilter={setFilter} />
        </div>
        <div className="container mx-auto mb-5">
          <h2 className="py-2 text-md xl:text-2xl font-medium mx-auto">
            3. 프로필 템플릿을 선택해 주세요
            <small className="font-normal inline ml-2">(1개만 선택 가능)</small>
            <small className="font-normal block">
              (자세히 보시려면 "원본 보기" 버튼을 눌러주세요)
            </small>
          </h2>
          <Template temp={temp} setTemp={setTemp} />
        </div>
        <div className="container mx-auto mb-5">
          <h2 className="py-2 text-md xl:text-2xl font-medium mx-auto">
            <label htmlFor="center">4. 지점명을 입력해 주세요</label>
          </h2>
          <input
            id="center"
            type="text"
            className="w-full bg-purple-50 border-purple-500 border rounded-full p-3"
            value={center}
            onChange={e => setCenter(e.currentTarget.value)}
            onBlur={e => setCenter(e.currentTarget.value)}
          />
        </div>
        <div className="container mx-auto mb-5">
          <h2 className="py-2 text-md xl:text-2xl font-medium mx-auto">
            <label htmlFor="name">
              5. 성함과 직책을 입력해 주세요
              <small className="font-normal block xl:inline xl:ml-2">
                (예 : 홍길동 팀장, 홍길순 매니저)
              </small>
            </label>
          </h2>
          <input
            id="name"
            type="text"
            value={name}
            className="w-full bg-purple-50 border-purple-500 border rounded-full p-3"
            onChange={e => setName(e.currentTarget.value)}
            onBlur={e => setName(e.currentTarget.value)}
          />
        </div>
        <div className="container mx-auto mb-5">
          <h2 className="py-2 text-md xl:text-2xl font-medium mx-auto">
            <label htmlFor="phone">
              6. 연락받으실 전화번호를 입력해 주세요
            </label>
          </h2>
          <input
            id="phone"
            type="text"
            value={phone}
            className="w-full bg-purple-50 border-purple-500 border rounded-full p-3"
            onChange={e => setPhone(e.currentTarget.value)}
            onBlur={e => setPhone(e.currentTarget.value)}
          />
        </div>
        <div className="container mx-auto mb-5">
          <h2 className="py-2 text-md xl:text-2xl font-medium mx-auto">
            <label htmlFor="career">
              7. 경력 및 수상 내역, 자신의 특장점 등을 적어주세요
              <small className="font-normal block xl:inline xl:ml-2">
                (<span className="text-red-500">최소 2개</span>, 최대 3개)
              </small>
            </label>
          </h2>
          <input
            id="career"
            type="text"
            value={career1}
            className="w-full bg-purple-50 border-purple-500 border rounded-full py-3 px-4 mb-2"
            onChange={e => setCareer1(e.currentTarget.value)}
            onBlur={e => setCareer1(e.currentTarget.value)}
          />
          <input
            type="text"
            value={career2}
            className="w-full bg-purple-50 border-purple-500 border rounded-full py-3 px-4 mb-2"
            onChange={e => setCareer2(e.currentTarget.value)}
            onBlur={e => setCareer2(e.currentTarget.value)}
          />
          <input
            type="text"
            value={career3}
            className="w-full bg-purple-50 border-purple-500 border rounded-full py-3 px-4 mb-2"
            onChange={e => setCareer3(e.currentTarget.value)}
            onBlur={e => setCareer3(e.currentTarget.value)}
          />
        </div>
        <div className="container mx-auto mb-5">
          <h2 className="py-2 text-md xl:text-2xl font-medium mx-auto">
            <label htmlFor="etc">
              8. 그 밖에 요청하실 내용이 있다면 입력해 주세요
            </label>
          </h2>
          <textarea
            className="block bg-purple-100 border border-purple-500 w-full p-2 px-3 mt-2 h-28 rounded-lg"
            id="etc"
            value={etc}
            onChange={e => setEtc(e.currentTarget.value)}
            onBlur={e => setEtc(e.currentTarget.value)}
          />
        </div>
        <Agree agree={agree} setAgree={setAgree} />
        <button
          className="w-full p-3 rounded-full bg-purple-500 hover:bg-purple-700 text-white"
          onClick={e => submit()}
        >
          프로필 제작 신청하기
        </button>
      </div>
    </>
  );
}

export default Subscribe;
