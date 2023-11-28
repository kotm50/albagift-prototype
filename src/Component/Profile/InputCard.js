import { useState, useRef, useEffect } from "react";
import { storage } from "../../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import dayjs from "dayjs";

function InputCard(props) {
  const cardRef = useRef();

  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (props.photo) {
      setUploaded(true);
    }
    // eslint-disable-next-line
  }, []);

  const uploadImage = i => {
    let date = dayjs(new Date()).format("YYMMDDhhmmss");
    const storageRef = ref(
      storage,
      `profile/${date}_card/${date}_${props.alias}_card`
    );
    const uploadTask = uploadBytesResumable(storageRef, i);
    props.setPhotoTask(`profile/${date}_card/${date}_${props.alias}_card`);
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

  const cardUpload = () => {
    cardRef.current.click();
  };

  const cardDelete = () => {
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
          cardRef.current.value = "";
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  return (
    <>
      <div className="mx-auto">
        <input
          type="file"
          accept="image/*"
          ref={cardRef}
          id={`card${props.alias}`}
          name={`card${props.alias}`}
          className="hidden"
          onChange={e => uploadImage(e.target.files[0])}
          disabled={uploaded ? true : false}
        />
        <button
          onClick={e => {
            e.preventDefault();
            cardUpload();
          }}
          className="block transition duration-150 rounded-full bg-purple-500 p-3 text-white font-medium w-full hover:bg-purple-900"
        >
          {props.no}번째 프로필 업로드
        </button>
        {uploaded && (
          <div className="text-center p-3 my-2 bg-white">
            <h3 className="text-left p-3 mb-2 font-medium">사진 미리보기</h3>
            <img
              src={props.photo}
              alt="업로드중입니다"
              className="max-h-28 ml-2"
            />
            <div className="text-left pl-2 mt-2">
              이미지 우클릭 후 "새 탭에서 열기"를 선택하시면 원본 이미지 크기로
              확인 가능합니다.
            </div>
            <button
              onClick={e => {
                e.preventDefault();
                cardDelete();
              }}
              className="block transition duration-150 rounded bg-pink-500 p-3 mt-4 text-white font-medium w-full hover:bg-pink-900"
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

export default InputCard;
