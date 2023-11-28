import React, { useState } from "react";
import { Link } from "react-router-dom";

import { cities1, sectors, careers } from "../Job/Data";

function ListAside() {
  const [areaOpen, setAreaOpen] = useState(false);
  const [sectorOpen, setSectorOpen] = useState(false);
  const [careerOpen, setCareerOpen] = useState(false);
  return (
    <div className="flex flex-col justify-start border bg-white text-black  w-full  divide-y">
      <h3 className="border-b p-2 text-lg bg-indigo-500 text-white">
        채용정보
      </h3>
      <div className="p-2 text-indigo-500">
        <Link to="/premiumlist" className="hover:font-medium">
          프리미엄 공고
        </Link>
      </div>
      <div className="p-2">
        <div className="flex justify-between">
          <Link to="/areajob" className="hover:font-medium">
            지역별
          </Link>
          <button
            className="hover:font-medium bg-indigo-50 px-2"
            onClick={e => setAreaOpen(!areaOpen)}
          >
            {!areaOpen ? "+" : "-"}
          </button>
        </div>
        {!areaOpen ? null : (
          <ul className="bg-gray-50">
            {cities1.map((city, id) => (
              <li key={id} className="px-2 py-1 text-sm">
                {id === 0 ? (
                  <Link to={`/areajob`} className="hover:font-medium">
                    {city[0]}
                  </Link>
                ) : (
                  <Link
                    to={`/areajob/${city[1]}`}
                    className="hover:font-medium"
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
          <Link to="/sectorjob" className="hover:font-medium">
            업종별
          </Link>
          <button
            className="hover:font-medium bg-indigo-50 px-2"
            onClick={e => setSectorOpen(!sectorOpen)}
          >
            {!sectorOpen ? "+" : "-"}
          </button>
        </div>
        {!sectorOpen ? null : (
          <ul className="bg-gray-50">
            {sectors.map((sertor, id) => (
              <li key={id} className="px-2 py-1 text-sm">
                <Link
                  to={`/sectorjob/${sertor[1]}`}
                  className="hover:font-medium"
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
          <Link to="/careerjob" className="hover:font-medium">
            경력별
          </Link>
          <button
            className="hover:font-medium bg-indigo-50 px-2"
            onClick={e => setCareerOpen(!careerOpen)}
          >
            {!careerOpen ? "+" : "-"}
          </button>
        </div>
        {!careerOpen ? null : (
          <ul className="bg-gray-50">
            {careers.map((career, id) => (
              <li key={id} className="px-2 py-1 text-sm">
                {id !== 0 ? (
                  <Link
                    to={`/careerjob/${career[1]}`}
                    className="hover:font-medium"
                  >
                    {career[0]}
                  </Link>
                ) : (
                  <Link to={`/careerjob`} className="hover:font-medium">
                    {career[0]}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ListAside;
