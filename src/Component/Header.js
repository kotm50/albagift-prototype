import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { path } from "../path/path";

import GiftCategory from "./giftishow/GiftCategory";
import GiftBrand from "./giftishow/GiftBrand";

import aslogo from "../Asset/albaseonmul.svg";
import amlogo from "../Asset/albamall.svg";

function Header() {
  let domain = window.location.hostname;
  let parts = domain.split(".");
  let domainName = parts[parts.length - 2]; // 'albagift'
  const [isOpen, setIsOpen] = useState(false);
  const [cateNum, setCateNum] = useState("");
  const [brandNum, setBrandNum] = useState("");
  const thisLocation = useLocation();
  useEffect(() => {
    setIsOpen(path.some(chkBg));
    getUrl();
    // eslint-disable-next-line
  }, [thisLocation]);
  const chkBg = (element, index, array) => {
    return thisLocation.pathname.startsWith(element);
  };

  const getUrl = () => {
    const url = window.location.href;
    const regex = /\/(\d+)(?:\/(\d+))?$/;
    const match = url.match(regex);

    if (match) {
      const firstValue = String(match[1]);
      const secondValue = String(match[2]);
      setCateNum(firstValue);
      if (secondValue) {
        setBrandNum(secondValue);
      } else {
        setBrandNum("");
      }
    } else {
      setCateNum("");
    }
  };
  return (
    <>
      {!isOpen ? (
        <>
          <div className="text-center py-5 container mx-auto">
            {domainName === "xn--352blzj6r" ? (
              <a href="/">
                <img
                  src={amlogo}
                  className="h-16 mx-auto"
                  alt="xn--352blzj6r 로고 버전0717"
                />
              </a>
            ) : (
              <a href="/">
                <img
                  src={aslogo}
                  className="h-16 mx-auto"
                  alt="알바선물 로고 버전0717"
                />
              </a>
            )}
          </div>
          <div className="border-b-2 border-indigo-500 bg-white">
            <GiftCategory cateno={cateNum} />
          </div>
          {cateNum !== "" && (
            <div className="bg-indigo-100 container mx-auto">
              <GiftBrand cateNum={cateNum} brandNum={brandNum} />
            </div>
          )}
        </>
      ) : null}
    </>
  );
}

export default Header;
