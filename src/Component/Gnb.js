import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { path } from "../path/path";

function Gnb() {
  const [isOpen, setIsOpen] = useState(false);
  const thisLocation = useLocation();

  useEffect(() => {
    setIsOpen(path.some(chkBg));
    // eslint-disable-next-line
  }, [thisLocation]);
  const chkBg = (element, index, array) => {
    return thisLocation.pathname.startsWith(element);
  };

  return (
    <>
      {!isOpen ? (
        <div className="relative">
          <div className="lg:py-2 border-b-2 border-indigo-500">
            <div className="hidden lg:flex container mx-auto">
              <nav className="flex gap-5 justify-start grow">
                {[
                  ["채용정보", "/giftlist"],
                  ["업종별", "/giftlist"],
                  ["지역별", "/giftlist"],
                  ["경력별", "/giftlist"],
                  ["프리미엄", "/giftlist"],
                  ["면접샵", "/giftlist"],
                ].map(([title, url]) => (
                  <Link
                    to={url}
                    className={
                      title === "면접샵"
                        ? "rounded-lg px-3 py-2 text-slate-700 font-normal bg-indigo-100 hover:bg-indigo-200 hover:text-slate-900 text-lg hover:font-medium"
                        : "rounded-lg px-3 py-2 text-slate-700 font-normal hover:bg-slate-100 hover:text-slate-900 text-lg hover:font-medium"
                    }
                    key={title}
                    onClick={e => {
                      if (title !== "면접샵") {
                        alert("준비중입니다.");
                      }
                    }}
                  >
                    {title}
                  </Link>
                ))}
              </nav>
              <span
                to="/"
                className="rounded-lg px-3 py-2 text-slate-700 font-normal hover:bg-slate-100 hover:text-slate-900 text-lg hover:font-medium cursor-pointer"
                onClick={e => {
                  e.preventDefault();
                  return alert(
                    "채용광고 등록은 아래 번호로 문의바랍니다\n채용문의 : 1644-4223"
                  );
                }}
              >
                채용등록문의
              </span>
              <span
                className="rounded-lg px-3 py-2 text-slate-700 font-normal hover:bg-slate-100 hover:text-slate-900 text-lg hover:font-medium cursor-pointer"
                onClick={e => {
                  e.preventDefault();
                  return alert(
                    "궁금하신 사항은 아래 번호로 문의바랍니다\n채용문의 : 1644-4223"
                  );
                }}
              >
                고객센터
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Gnb;
