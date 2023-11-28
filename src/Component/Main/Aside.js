import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { path } from "../../path/path";

import Rich from "../../Asset/rich.png";

function Aside() {
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
        <div className="hidden fixed top-1/3 -left-px bg-teal-500 w-40 border p-2 text-white xl:flex flex-col justify-between rounded-r-lg z-30">
          <Link to="/interview">
            <div className="text-lg font-medium">
              면접만 봐도
              <br />
              돈이 들어온다!?
            </div>
            <div className="mt-5">
              <img src={Rich} alt="면접비 이벤트" className="w-full" />
            </div>
          </Link>
        </div>
      ) : null}
    </>
  );
}

export default Aside;
