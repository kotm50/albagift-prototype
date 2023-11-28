import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

import { db } from "../../firebase";

function GiftBrand(props) {
  const [brandList, setBrandList] = useState([]);

  useEffect(() => {
    getBrand(props.cateNum);
    //eslint-disable-next-line
  }, []);

  const getBrand = async num => {
    try {
      const q = query(
        collection(db, "brand"),
        where("category1Seq", "==", Number(num)),
        orderBy("brandName")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setBrandList(data);
    } catch (error) {
      console.error("Error fetching brand documents: ", error);
    }
  };
  return (
    <div>
      {brandList.length > 0 ? (
        <div className="container mx-auto text-lg flex flex-row flex-nowrap xl:flex-wrap gap-3 p-2 xl:max-h-72 overflow-auto giftCategoryMenu bg-indigo-100">
          {brandList.map((brand, idx) => (
            <a
              href={`/giftlist/${props.cateNum}/${brand.brandSeq}`}
              className={
                String(brand.brandSeq) === props.brandNum
                  ? "bg-blue-500 py-2 px-4 text-white giftcategory text-sm rounded-lg border xl:w-1/12"
                  : "text-black bg-white py-2 px-4 hover:bg-blue-500 hover:text-white hover:drop-shadow-lg giftcategory text-sm rounded-lg border xl:w-1/12"
              }
              key={idx}
            >
              <div className="w-16 h-16 mx-auto p-1 rounded bg-white overflow-hidden">
                <img
                  src={brand.brandIConImg}
                  alt={`${brand.brandName}의 로고`}
                  className="w-16 h-auto mx-auto"
                />
              </div>
              <div className="w-full overflow-hidden text-ellipsis text-center mt-1">
                {brand.brandName}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="container mx-auto text-lg flex flex-row flex-nowrap xl:flex-wrap gap-3 p-2 xl:max-h-72 overflow-auto giftCategoryMenu bg-indigo-100">
          <div className="aniamte-pulse  bg-white py-2 px-4 giftcategory text-sm rounded-lg border xl:w-1/12">
            <div className="w-16 h-16 mx-auto p-1 rounded bg-slate-200 overflow-hidden"></div>
            <div className="w-full bg-slate-200 h-2 mt-1"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiftBrand;
