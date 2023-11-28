import React, { useState } from "react";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

function Generator() {
  const [id, setId] = useState("");
  const [gid, setGid] = useState("");

  const linkgen = async id => {
    if (isNaN(Number(id))) {
      return alert("고유번호는 숫자만 입력해 주세요");
    }
    let idnum = Number(id);
    try {
      const q = query(
        collection(db, "adAgreeSign"),
        where("alias", "==", idnum)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return alert("이미 등록한 고유번호 입니다.\n관리자에게 문의해주세요");
      }
      const docRef = await addDoc(collection(db, "adAgreeSign"), {
        // 여기에 새 문서의 필드와 값을 입력하세요.
        alias: idnum,
        signed: false,
        created: serverTimestamp(),
      });
      setGid(`https://ikoreatm.com/adagree/${docRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text).then(
      () => alert("복사되었습니다, 원하는 채팅창에 붙여넣기 하세요"),
      err => console.error("Error copying to clipboard", err)
    );
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    p-3 bg-white rounded-lg min-w-1 min-h-1 drop-shadow-lg w-11/12 lg:w-2/6"
    >
      <h2 className="text-lg mb-3">동의서 생성</h2>
      <form>
        <div className="mb-3">
          <label
            htmlFor="id"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            고객사 고유번호를 입력해주세요
          </label>
          <input
            type="text"
            id="id"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={id}
            onChange={e => setId(e.currentTarget.value)}
            onBlur={e => setId(e.currentTarget.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="mr-2 text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
          onClick={e => {
            e.preventDefault();
            if (id === "") {
              return alert("고유번호를 입력하세요");
            } else {
              linkgen(id);
            }
          }}
        >
          동의서 url 생성
        </button>
        {gid !== "" ? (
          <div className="mt-3 pt-3 border-t-2 border-indigo-500">
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              링크가 생성되었습니다. 아래 링크를 복사하신 뒤 채팅창에 붙여넣기
              해주세요
            </p>
            <input
              type="text"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
              readOnly
              value={gid}
            />
            <button
              className="mr-2 mt-2 text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
              onClick={e => {
                e.preventDefault();
                copyToClipboard(gid);
              }}
            >
              url 복사하기
            </button>
          </div>
        ) : null}
      </form>
    </div>
  );
}

export default Generator;
