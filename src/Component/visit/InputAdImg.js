import { useState, useRef } from "react";
import { storage } from "../../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import dayjs from "dayjs";

function InputApplyImg(props) {
  const photoRef = useRef();

  const [uploaded, setUploaded] = useState(false);

  const uploadImage = i => {
    let date = dayjs(new Date()).format("YYMMDDhhmmss");
    const storageRef = ref(storage, `visit/ad/${date}_${props.no}`);
    const uploadTask = uploadBytesResumable(storageRef, i);
    if (props.no === 1) props.setAdImgATask(`visit/ad/${date}_${props.no}`);
    if (props.no === 2) props.setAdImgBTask(`visit/ad/${date}_${props.no}`);
    if (props.no === 3) props.setAdImgCTask(`visit/ad/${date}_${props.no}`);
    uploadTask.on(
      "state_changed",
      snapshot => {
        setUploaded(true);
      },
      err => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          if (props.no === 1) props.setAdImgA(url);
          if (props.no === 2) props.setAdImgB(url);
          if (props.no === 3) props.setAdImgC(url);
        });
      }
    );
  };

  const photoUpload = () => {
    photoRef.current.click();
  };

  const photoDelete = () => {
    let deleteIt = window.confirm(
      "삭제하면 다시 업로드 하셔야 합니다, 삭제할까요?"
    );
    if (deleteIt) {
      let task;
      if (props.no === 1) task = props.adImgATask;
      if (props.no === 2) task = props.adImgBTask;
      if (props.no === 3) task = props.adImgCTask;
      const deleteRef = ref(storage, task);
      deleteObject(deleteRef)
        .then(() => {
          if (props.no === 1) {
            props.setAdImgA("");
            props.setAdImgATask("");
          }
          if (props.no === 2) {
            props.setAdImgB("");
            props.setAdImgBTask("");
          }
          if (props.no === 3) {
            props.setAdImgC("");
            props.setAdImgCTask("");
          }
          setUploaded(false);
          photoRef.current.value = "";
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  return (
    <>
      <div className="p-2 bg-gray-200 font-medium">
        <h2>
          <label htmlFor={`photo${props.no}`}>
            {props.no}번째 이미지를 올려주세요
          </label>
        </h2>
      </div>
      <div className="p-2 pb-3 bg-gray-100">
        <input
          type="file"
          accept="image/*"
          ref={photoRef}
          id={`photo${props.no}`}
          name={`photo${props.no}`}
          className="hidden"
          onChange={e => uploadImage(e.target.files[0])}
          disabled={uploaded ? true : false}
        />
        <button
          onClick={photoUpload}
          className="block transition duration-150 rounded bg-blue-500 p-2 text-white font-medium w-full hover:bg-blue-900"
        >
          {props.no}번 이미지 업로드
        </button>
        {uploaded && (
          <div className="text-center p-2 my-2 bg-white">
            <h3 className="text-left p-2 mb-2 font-medium">이미지 미리보기</h3>
            {props.no === 1 ? (
              <img
                src={props.adImgA}
                alt="업로드중입니다"
                className="max-h-28 ml-2"
              />
            ) : props.no === 2 ? (
              <img
                src={props.adImgB}
                alt="업로드중입니다"
                className="max-h-28 ml-2"
              />
            ) : props.no === 3 ? (
              <img
                src={props.adImgC}
                alt="업로드중입니다"
                className="max-h-28 ml-2"
              />
            ) : null}
            <div className="text-left pl-2 mt-2">
              이미지 우클릭 후 "새 탭에서 열기"를 선택하시면 원본 이미지 크기로
              확인 가능합니다.
            </div>
            <button
              onClick={photoDelete}
              className="block transition duration-150 rounded bg-pink-500 p-2 mt-4 text-white font-medium w-full hover:bg-pink-900"
            >
              다시 올리기
              <br className="lg:hidden" />
              <small className="lg:ml-2">(기존 사진은 삭제됩니다)</small>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default InputApplyImg;
