import { useState, useRef, useEffect } from "react";
import { storage } from "../../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import dayjs from "dayjs";

function InputLogo(props) {
  const photoRef = useRef();
  const InputLogo = useRef();

  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (props.cLogo) {
      setUploaded(true);
    }
    // eslint-disable-next-line
  }, []);

  const sizeChk = i => {
    const reader = new FileReader();
    reader.readAsDataURL(i);
    return new Promise(resolve => {
      reader.onload = e => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const { height, width } = img;
          if (width / height !== 2.5) {
            alert("이미지 크기가 다릅니다. 500x200으로 수정해서 올려주세요");
            return false;
          } else {
            uploadImage(i);
            return true;
          }
        };
      };
    });
  };

  const uploadImage = i => {
    let date = dayjs(new Date()).format("YYMMDDhhmmss");
    const storageRef = ref(storage, `photo/logo/${props.cNum + "_" + date}`);
    const uploadTask = uploadBytesResumable(storageRef, i);
    props.setCLogoTask(`photo/logo/${props.cNum + "_" + date}`);
    uploadTask.on(
      "state_changed",
      snapshot => {
        setUploaded(true);
      },
      err => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          props.setCLogo(url);
        });
      }
    );
  };

  const photoUpload = () => {
    if (props.cNum === "") {
      return alert("고유번호를 입력해 주세요");
    }
    photoRef.current.click();
  };

  const photoDelete = () => {
    let deleteIt = window.confirm(
      "삭제하면 다시 업로드 하셔야 합니다, 삭제할까요?"
    );
    if (deleteIt) {
      const deleteRef = ref(storage, props.cLogoTask);
      deleteObject(deleteRef)
        .then(() => {
          props.setCLogo("");
          props.setCLogoTask("");
          setUploaded(false);
          photoRef.current.value = "";
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  return (
    <div id="InputLogo" ref={InputLogo}>
      <div className="p-2 pb-3 bg-gray-100">
        <input
          type="file"
          accept="image/*"
          ref={photoRef}
          id="photo"
          name="photo"
          className="hidden"
          onChange={e => sizeChk(e.target.files[0])}
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
              src={props.cLogo}
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

export default InputLogo;
