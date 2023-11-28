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

  const [imgNow, setImgNow] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const uploadImage = i => {
    let date = dayjs(new Date()).format("YYMMDDhhmmss");
    setImgNow(date);
    const storageRef = ref(storage, `visit/apply/${date}`);
    const uploadTask = uploadBytesResumable(storageRef, i);
    uploadTask.on(
      "state_changed",
      snapshot => {
        setUploaded(true);
      },
      err => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          props.setApplyImg(url);
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
      const deleteRef = ref(storage, `visit/apply/${imgNow}`);
      deleteObject(deleteRef)
        .then(() => {
          props.setApplyImg("");
          setUploaded(false);
          photoRef.current.value = "";
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  return (
    <div className="p-2 pb-3 bg-gray-100">
      <input
        type="file"
        accept="image/*"
        ref={photoRef}
        id="photo"
        name="photo"
        className="hidden"
        onChange={e => uploadImage(e.target.files[0])}
        disabled={uploaded ? true : false}
      />
      <button
        onClick={photoUpload}
        className="block transition duration-150 rounded bg-blue-500 p-2 text-white font-medium w-full hover:bg-blue-900"
      >
        채용현황 이미지 업로드
      </button>
      {uploaded && (
        <div className="text-center p-2 my-2 bg-white">
          <h3 className="text-left p-2 mb-2 font-medium">이미지 미리보기</h3>
          <img
            src={props.applyImg}
            alt="업로드중입니다"
            className="max-h-96 ml-2"
          />
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
  );
}

export default InputApplyImg;
