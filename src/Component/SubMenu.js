import React, { useState } from "react";
import { Link } from "react-router-dom";

import { cities1, sectors, careers } from "./Job/Data";

function SubMenu(props) {
  const [areaOpen, setAreaOpen] = useState(false);
  const [sectorOpen, setSectorOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  return (
    <div className="flex flex-col justify-start bg-white text-black  w-full  divide-y mt-2">
      <h3 className="border-b p-2 text-lg bg-indigo-500 text-white">
        채용정보
      </h3>
      <div className="p-2 text-indigo-500">
        <Link onClick={e => props.setMenuOn(false)} to="/premiumlist">
          프리미엄 공고
        </Link>
      </div>
      <div className="p-2">
        <div className="flex justify-between">
          <Link onClick={e => props.setMenuOn(false)} to="/areajob">
            지역별
          </Link>
          <button
            className="bg-indigo-50 px-2"
            onClick={e => setAreaOpen(!areaOpen)}
          >
            {!areaOpen ? "+" : "-"}
          </button>
        </div>
        {!areaOpen ? null : (
          <ul className="bg-gray-50 mt-2">
            {cities1.map((city, id) => (
              <li key={id} className="px-2 py-1 text-sm">
                {id === 0 ? (
                  <Link onClick={e => props.setMenuOn(false)} to={`/areajob`}>
                    {city[0]}
                  </Link>
                ) : (
                  <Link
                    onClick={e => props.setMenuOn(false)}
                    to={`/areajob/${city[1]}`}
                  >
                    {city[0]}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-2">
        <div className="flex justify-between">
          <Link onClick={e => props.setMenuOn(false)} to="/sectorjob">
            업종별
          </Link>
          <button
            className="bg-indigo-50 px-2"
            onClick={e => setSectorOpen(!sectorOpen)}
          >
            {!sectorOpen ? "+" : "-"}
          </button>
        </div>
        {!sectorOpen ? null : (
          <ul className="bg-gray-50 mt-2">
            {sectors.map((sertor, id) => (
              <li key={id} className="px-2 py-1 text-sm">
                <Link
                  onClick={e => props.setMenuOn(false)}
                  to={`/sectorjob/${sertor[1]}`}
                >
                  {sertor[0]}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-2">
        <div className="flex justify-between">
          <Link onClick={e => props.setMenuOn(false)} to="/careerjob">
            경력별
          </Link>
          <button
            className="bg-indigo-50 px-2"
            onClick={e => setCareerOpen(!careerOpen)}
          >
            {!careerOpen ? "+" : "-"}
          </button>
        </div>
        {!careerOpen ? null : (
          <ul className="bg-gray-50 mt-2">
            {careers.map((career, id) => (
              <li key={id} className="px-2 py-1 text-sm">
                {id !== 0 ? (
                  <Link
                    onClick={e => props.setMenuOn(false)}
                    to={`/careerjob/${career[1]}`}
                  >
                    {career[0]}
                  </Link>
                ) : (
                  <Link onClick={e => props.setMenuOn(false)} to={`/careerjob`}>
                    {career[0]}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-2  bg-indigo-100">
        <div className="flex justify-between">
          <Link onClick={e => props.setMenuOn(false)} to="/giftlist">
            면접샵
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SubMenu;
