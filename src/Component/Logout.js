import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Logout() {
  let navi = useNavigate();
  return (
    <div className="bg-white rounded fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg flex flex-col justify-center p-2 w-11/12 xl:w-1/6">
      <button
        className="bg-indigo-500"
        onClick={e => {
          signOut(auth)
            .then(() => {
              navi("/");
            })
            .catch(error => {
              // An error happened.
            });
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

export default Logout;
