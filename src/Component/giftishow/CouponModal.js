import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

import Timer from "./Timer";
import MemoList from "./MemoList";

function CouponModal(props) {
  const [allowRightClick, setAllowRightClick] = useState(false);
  const [saveIt, setSaveIt] = useState(false);
  const [memo, setMemo] = useState("");
  const handleCopy = () => {
    alert(
      `쿠폰번호가 복사되었습니다 필요한 곳에 붙여넣기 해주세요\n복사한 쿠폰번호:${props.coupon.pinNo}`
    );
  };
  const handleRightClick = e => {
    if (!allowRightClick) {
      e.preventDefault(); // 기본 우클릭 메뉴를 나타나지 않게 합니다.
      alert("쿠폰 유출을 막기 위해 우클릭을 사용할 수 없습니다."); // 경고창을 띄웁니다.
    } else {
      setTimeout(() => {
        setAllowRightClick(false);
      }, 1000);
    }
  };
  const saveCoupon = () => {
    //return alert("준비중입니다");
    setSaveIt(true);
  };

  const cancelSaveCouponImg = () => {
    setMemo("");
    setSaveIt(false);
  };

  const saveCouponImg = async () => {
    if (memo === "") {
      return alert("메모를 남겨주셔야 저장이 가능합니다");
    }
    const saveIt = window.confirm(
      "저장한 쿠폰이미지가 유출되면 다른사람이 사용할 수 있습니다\n계속할까요?"
    );
    if (saveIt) {
      const dataToSave = {
        uid: props.uid,
        trId: props.coupon.trId,
        memo: memo,
        date: serverTimestamp(),
      };
      try {
        // 'couponmemo' 컬렉션에 문서 추가
        await addDoc(collection(db, "couponmemo"), dataToSave);
        setAllowRightClick(true);
        alert(
          "이제 우클릭을 사용할 수 있게 되었습니다.\n30초 이내로 쿠폰이미지를 저장하세요"
        );
        setSaveIt(false);
        setMemo("");
      } catch (e) {
        alert("문서 저장 중 오류 발생: " + e.message); // 오류 시 오류 메시지 출력
      }
    }
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative lg:w-auto my-6 mx-auto w-11/12 lg:max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-screen p-6">
            <div
              className="relative p-2 lg:p-6 flex-auto overflow-y-auto"
              data={props.coupon.trId}
            >
              <img
                src={props.coupon.couponImgUrl}
                alt="쿠폰이미지"
                onContextMenu={handleRightClick}
                className={!allowRightClick ? "no-context" : null}
              />
            </div>
            {allowRightClick && (
              <Timer
                setAllowRightClick={setAllowRightClick}
                coupon={props.coupon.couponImgUrl}
              />
            )}
            <div className="text-lg font-medium my-3 text-center">
              쿠폰번호 :{" "}
              <span className="text-red-500">{props.coupon.pinNo}</span>
            </div>
            <div className="p-2 grid grid-cols-3 gap-2">
              <CopyToClipboard text={props.coupon.pinNo} onCopy={handleCopy}>
                <button
                  className="bg-teal-500 hover:bg-teal-700 p-2 text-white"
                  disabled={saveIt}
                >
                  쿠폰번호 복사하기
                </button>
              </CopyToClipboard>
              <button
                className="bg-blue-500 hover:bg-blue-700 p-2 text-white"
                onClick={saveCoupon}
                disabled={saveIt}
              >
                쿠폰이미지 저장
              </button>
              <button
                className="bg-gray-500 p-2 text-white"
                onClick={e => {
                  props.setCouponModal(false);
                  setAllowRightClick(false);
                }}
                disabled={saveIt}
              >
                창닫기
              </button>
            </div>
            {saveIt && (
              <div className="absolute w-11/12 p-2 left-1/2 -translate-x-1/2 top-2 bg-white h-1/2 border-2 drop-shadow-lg">
                <div className="grid grid-cols-5 gap-y-2 h-full overflow-auto">
                  <div className="text-sm p-2">메모</div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={memo}
                      className="p-2 border w-full text-sm"
                      placeholder="전달대상, 저장이유 등을 간단하게 남겨주세요"
                      onChange={e => setMemo(e.currentTarget.value)}
                      onBlur={e => setMemo(e.currentTarget.value)}
                    />
                  </div>
                  <div className="col-span-5 text-rose-500 text-center text-sm font-medium">
                    쿠폰이미지는 사용 완료될 때까지 계속 저장할 수 있습니다.
                  </div>
                  <div className="col-span-5 min-h-full">
                    <MemoList trId={props.coupon.trId} />
                  </div>
                  <div className="w-full max-h-fit grid grid-cols-2 gap-3 p-2 col-span-5">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white p-2"
                      onClick={saveCouponImg}
                    >
                      다운로드 활성화
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white p-2"
                      onClick={cancelSaveCouponImg}
                    >
                      취소하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default CouponModal;
