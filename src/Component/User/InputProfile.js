import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { loginUser } from "../../Reducer/userSlice";

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

import { emails } from "./Email";

import InputArea from "./InputArea";
import InputPhoto from "./InputPhoto";

function InputProfile() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  let navi = useNavigate();
  const { uid, promo } = useParams();

  useEffect(() => {
    setTimeout(() => {
      if (uid !== user.uid) {
        alert("로그인이 필요합니다");
        navi("/login");
      }
    }, 1000);
    if (uid !== undefined) {
      getProfile(uid);
    } else {
      alert("잘못된 접근입니다");
      navi("/");
    }
    if (promo === "promotion") {
      setIsPromo(true);
    } else {
      setIsPromo(false);
    }
    // eslint-disable-next-line
  }, []);

  const domainRef = useRef();
  const [city, setCity] = useState("");
  const [town, setTown] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoTask, setPhotoTask] = useState("");
  const [point, setPoint] = useState(0);
  const [type, setType] = useState("");
  const [promotion, setPromotion] = useState(false);
  const [firstInput, setFirstInput] = useState(true);
  const [isPromo, setIsPromo] = useState(false);

  const getProfile = async () => {
    const modifyRef = doc(collection(db, "apply"), uid);
    let profiles = await getDoc(modifyRef);
    let result = profiles.data();
    setName(result.name ?? "");
    setBirth(result.birth ?? "");
    setPhone(result.phone ?? "");
    setEmail(result.email ?? "");
    setCity(result.city ?? "");
    setTown(result.town ?? "");
    setDomain(result.domain ?? "");
    setGender(result.gender ?? "");
    setPhoto(result.photo ?? "");
    setPhotoTask(result.photoTask ?? "");
    setPoint(result.point ?? 0);
    setType(result.type ?? "");
    setFirstInput(result.firstInput ?? true);
    setPromotion(result.promotion ?? false);
  };

  const InputProfile = async () => {
    console.log(isPromo);
    if (name === "") {
      return alert("이름을 입력해주세요");
    }
    if (birth === "") {
      return alert("생일을 입력해 주세요");
    }
    const isValidNumber = await phoneCheck(phone);
    if (!isValidNumber) {
      return alert("휴대폰번호를 정확히 입력해 주세요");
    }
    if (gender === "") {
      return alert("성별을 선택해 주세요");
    }
    if (email === "" || domain === "") {
      return alert("이메일 주소를 정확히 입력해 주세요");
    }
    if (city === "" || town === "") {
      return alert("거주지를 정확히 선택해 주세요");
    }
    let submit = window.confirm("프로필 입력을 완료하시겠습니까?");
    if (submit) {
      let body = {
        uid: uid,
        name: name,
        birth: birth,
        phone: phone,
        email: email,
        fullEmail: email + "@" + domain,
        city: city,
        town: town,
        domain: domain,
        gender: gender,
        photo: photo,
        photoTask: photoTask,
        point: point,
        firstInput: false,
        updated: serverTimestamp(),
        type: type,
        promotion: promotion,
      };
      if (firstInput) {
        if (isPromo) {
          body.point = 500;
          body.promotion = true;
          await promoPoint();
        } else {
          body.point = 0;
          body.promotion = false;
        }
      }
      const applyRef = collection(db, "apply");
      await setDoc(doc(applyRef, uid), body)
        .then(result => {
          dispatch(
            loginUser({
              uid: user.uid,
              accessToken: user.accessToken,
              admin: false,
              name: body.name,
              point: body.point,
              phone: user.phoneNumber,
            })
          );
          alert("프로필수정을 완료했습니다.");
          navi(`/profile/${user.uid}`);
        })
        .catch(error => {
          alert(error);
        });
    } else {
      return false;
    }
  };

  const promoPoint = async () => {
    const giftPointCollectionRef = collection(db, "giftPoint");
    const serial = await getSerial();
    const pointRef = doc(giftPointCollectionRef, `point_${serial}_${uid}`);
    await setDoc(pointRef, {
      uid: uid,
      name: name,
      date: serverTimestamp(),
      point: 500,
      beforePoint: 0,
      afterPoint: 500,
      increase: true,
      type: "promo",
      interviewData: "모름",
    });
  };

  const getSerial = async () => {
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

  const phoneCheck = p => {
    const regex = /^010\d{8}$/; // 010으로 시작하는 11자리 숫자 정규식

    const isValidNumber = regex.test(p);

    return isValidNumber;
  };

  const changeDomain = e => {
    setDomain(e.currentTarget.value);
    if (e.currentTarget.value === "") {
      domainRef.current.focus();
    }
  };

  return (
    <>
      <h2 className="w-11/12 xl:container mb-2 mx-auto font-medium p-2 bg-indigo-500 text-white text-center text-xl xl:text-3xl">
        프로필 작성
      </h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          InputProfile();
        }}
      >
        <div className="w-11/12 xl:container mx-auto bg-white my-1 border border-collapse">
          <div className="flex flex-col justify-start divide-y">
            <h3 className="border-b-2 border-collapse border-indigo-500 p-2 text-lg font-medium">
              기본정보 입력
            </h3>
            <div
              id="inputName"
              className="flex flex-col xl:flex-row xl:flex-nowrap"
            >
              <div className="bg-gray-50 p-2 flex flex-col justify-center xl:basis-1/12 basis-1/6 xl:text-right">
                <label htmlFor="name">이름</label>
              </div>
              <div className="p-2 flex flex-col justify-center xl:basis-11/12 basis-5/6">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg xl:w-2/3"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={e => setName(e.currentTarget.value)}
                  onBlur={e => {
                    setName(e.currentTarget.value);
                  }}
                />
              </div>
            </div>
            <div
              id="inputBirth"
              className="flex flex-col xl:flex-row xl:flex-nowrap"
            >
              <div className="bg-gray-50 p-2 flex flex-col justify-center xl:basis-1/12 basis-1/6 xl:text-right">
                <label htmlFor="birth">생년월일</label>
              </div>
              <div className="p-2 flex flex-col justify-center xl:basis-11/12 basis-5/6 relative">
                <input
                  type="number"
                  id="birth"
                  name="birth"
                  className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg xl:w-2/3"
                  placeholder="생년월일 8자리를 입력하세요 예) 2000년 1월 1일생 : 20000101"
                  value={birth}
                  onChange={e => setBirth(e.currentTarget.value)}
                  onBlur={e => {
                    setBirth(e.currentTarget.value);
                  }}
                />
              </div>
            </div>
            <div
              id="inputPhone"
              className="flex flex-col xl:flex-row xl:flex-nowrap"
            >
              <div className="bg-gray-50 p-2 flex flex-col justify-center xl:basis-1/12 basis-1/6 xl:text-right">
                <label htmlFor="phone">휴대폰번호</label>
              </div>
              <div className="p-2 flex flex-col justify-center xl:basis-11/12 basis-5/6 relative">
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg xl:w-2/3"
                  placeholder="휴대폰 번호를 입력하세요"
                  value={phone}
                  onChange={e => setPhone(e.currentTarget.value)}
                  onBlur={e => {
                    setPhone(e.currentTarget.value);
                  }}
                />
                <div>
                  <small className="text-red-500 ml-1">
                    정확히 입력하지 않으면 상품 수령이 어렵습니다
                  </small>
                </div>
              </div>
            </div>
            <div
              id="inputGender"
              className="flex flex-col xl:flex-row xl:flex-nowrap"
            >
              <div className="bg-gray-50 p-2 flex flex-col justify-center xl:basis-1/12 basis-1/6 xl:text-right">
                <label htmlFor="phone">성별</label>
              </div>
              <div className="p-2 flex flex-col justify-center xl:basis-11/12 basis-5/6">
                <div className="flex flex-col xl:flex-row flex-nowrap gap-3">
                  {["여성", "남성"].map((ans, idx) => (
                    <div
                      className="border rounded p-1 bg-white basis-1/6"
                      key={idx}
                    >
                      <input
                        type="radio"
                        value={ans}
                        id={ans}
                        name={gender}
                        className="peer hidden"
                        onChange={e => setGender(e.currentTarget.value)}
                        checked={gender === ans}
                      />
                      <label
                        htmlFor={ans}
                        className="block transition duration-150 text-sm p-1 text-center ease-in-out rounded bg-white text-stone-900  peer-checked:text-white peer-checked:bg-indigo-500"
                      >
                        {ans}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              id="inputAddress"
              className="flex flex-col xl:flex-row xl:flex-nowrap"
            >
              <div className="bg-gray-50 p-2 flex flex-col justify-center xl:basis-1/12 basis-1/6 xl:text-right">
                <label htmlFor="city">거주지</label>
              </div>
              <div className="p-2 flex flex-col justify-center xl:basis-11/12 basis-5/6">
                <InputArea
                  city={city}
                  setCity={setCity}
                  town={town}
                  setTown={setTown}
                />
              </div>
            </div>
            <div
              id="inputEmail"
              className="flex flex-col xl:flex-row xl:flex-nowrap"
            >
              <div className="bg-gray-50 p-2 flex flex-col justify-center xl:basis-1/12 basis-1/6 xl:text-right">
                <label htmlFor="email">이메일</label>
              </div>
              <div className="p-2 flex flex-col justify-center xl:basis-11/12 basis-5/6">
                <div className="flex flex-col xl:hidden flex-nowrap justify-start gap-2 xl:w-2/3">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg basis-4/12"
                    placeholder="이메일 계정을 입력하세요"
                    value={email}
                    onChange={e => setEmail(e.currentTarget.value)}
                    onBlur={e => {
                      setEmail(e.currentTarget.value);
                    }}
                  />
                  <div className="flex justify-start gap-2">
                    <div className="basis-2 text-center flex flex-col justify-center">
                      @
                    </div>
                    <select
                      id="domain"
                      className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg"
                      value={domain || ""}
                      onChange={e => {
                        changeDomain(e);
                      }}
                      onKeyDown={e => {
                        return false;
                      }}
                    >
                      <option value="">직접입력</option>
                      {emails.map((title, idx) => (
                        <option value={title} className="text-black" key={idx}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg"
                    placeholder="도메인을 입력하세요"
                    ref={domainRef}
                    value={domain}
                    onChange={e => setDomain(e.currentTarget.value)}
                    onBlur={e => {
                      setDomain(e.currentTarget.value);
                    }}
                  />
                </div>
                <div className="hidden xl:flex flex-nowrap justify-start gap-2 xl:w-2/3">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg basis-4/12"
                    placeholder="이메일 계정을 입력하세요"
                    value={email}
                    onChange={e => setEmail(e.currentTarget.value)}
                    onBlur={e => {
                      setEmail(e.currentTarget.value);
                    }}
                  />
                  <div className="basis-2 text-center flex flex-col justify-center">
                    @
                  </div>
                  <select
                    id="domain"
                    className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg basis-3/12"
                    value={domain || ""}
                    onChange={e => {
                      changeDomain(e);
                    }}
                    onKeyDown={e => {
                      return false;
                    }}
                  >
                    <option value="">직접입력</option>
                    {emails.map((title, idx) => (
                      <option value={title} className="text-black" key={idx}>
                        {title}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    className="block xl:text-sm font-medium text-stone-900 w-full rounded-sm p-2 border border-gray-200 roudned-lg"
                    placeholder="도메인을 입력하세요"
                    ref={domainRef}
                    value={domain}
                    onChange={e => setDomain(e.currentTarget.value)}
                    onBlur={e => {
                      setDomain(e.currentTarget.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              id="inputPhoto"
              className="flex flex-col xl:flex-row xl:flex-nowrap"
            >
              <div className="bg-gray-50 p-2 flex flex-col justify-center xl:basis-1/12 basis-1/6 xl:text-right">
                <label htmlFor="phone">사진</label>
              </div>
              <div className="p-2 flex flex-col justify-center xl:basis-11/12 basis-5/6">
                <InputPhoto
                  phone={phone}
                  photo={photo}
                  setPhoto={setPhoto}
                  photoTask={photoTask}
                  setPhotoTask={setPhotoTask}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-11/12 xl:container mx-auto bg-white my-1 py-2 border border-collapse flex justify-center gap-5">
          <button
            type="submit"
            className="py-2 px-5 bg-indigo-500 hover:bg-indigo-700 rounded text-white font-medium text-lg"
          >
            프로필 작성 완료
          </button>
        </div>
      </form>
    </>
  );
}

export default InputProfile;
