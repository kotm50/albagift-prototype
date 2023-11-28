import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

function Login() {
  const location = useLocation();
  const [isMain, setIsMain] = useState(true);
  useEffect(() => {
    setIsMain(checkURL(location.pathname));
  }, [location.pathname]);
  const checkURL = url => {
    return url.endsWith("/login");
  };
  return (
    <>
      <div
        id="loginPopup"
        className="bg-white rounded fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg flex flex-col justify-center px-2 py-4 w-11/12 xl:w-1/2 z-40"
      >
        {!isMain && (
          <div className="grid grid-cols-1 mb-2">
            <Link
              to="/login"
              className="border border-indigo-500 hover:border-indigo-700 p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 block text-center rounded-full"
            >
              다른 방식으로 로그인
            </Link>
          </div>
        )}
        <Outlet />
      </div>
      <div className="fixed z-20 top-0 bottom-0 left-0 right-0 w-full h-screen"></div>
    </>
  );
}

export default Login;
