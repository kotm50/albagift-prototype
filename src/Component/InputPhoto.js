import { useState, useRef, useEffect } from "react";
import { storage } from "../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import dayjs from "dayjs";

function InputPhoto(props) {
  const photoRef = useRef();

  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (props.photo) {
      setUploaded(true);
    }
    // eslint-disable-next-line
  }, []);
  const uploadImage = i => {
    let date = dayjs(new Date()).format("YYMMDDhhmmss");
    let date2 = dayjs(new Date()).format("YYMMDD");
    const storageRef = ref(
      storage,
      `photo/newsurvey/${date2}/${props.name + "_" + date}`
    );
    const uploadTask = uploadBytesResumable(storageRef, i);
    props.setPhotoTask(`photo/newsurvey/${date2}/${props.name + "_" + date}`);
    uploadTask.on(
      "state_changed",
      snapshot => {
        setUploaded(true);
      },
      err => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          props.setPhoto(url);
        });
      }
    );
  };

  const photoUpload = () => {
    if (props.name === "") {
      return alert("성함을 입력해 주세요");
    }
    photoRef.current.click();
  };

  const photoDelete = () => {
    let deleteIt = window.confirm(
      "삭제하면 다시 업로드 하셔야 합니다, 삭제할까요?"
    );
    if (deleteIt) {
      let task = props.photo;
      const deleteRef = ref(storage, task);
      deleteObject(deleteRef)
        .then(() => {
          props.setPhoto("");
          props.setPhotoTask("");
          setUploaded(false);
          photoRef.current.value = "";
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  return (
    <div id="inputPhoto">
      <div className="p-2 bg-gray-200 font-medium">
        <h2>
          <label htmlFor="photo">
            지원자님의 가장 잘 나온 사진을 올려주세요
          </label>
        </h2>
      </div>
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
          업로드
        </button>
        {uploaded && (
          <div className="text-center p-2 my-2 bg-white">
            <h3 className="text-left p-2 mb-2 font-medium">이미지 미리보기</h3>
            <img
              src={props.photo}
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
    </div>
  );
}

export default InputPhoto;
