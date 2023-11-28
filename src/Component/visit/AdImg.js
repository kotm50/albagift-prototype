import React from "react";

import ImgLoading from "./ImgLoading";

function AdImg(props) {
  return (
    <div>
      {props.visit.adImgA && (
        <div className="w-full lg:container lg:mx-auto mb-3 bg-white p-3 rounded drop-shadow-lg">
          <h2 className="text-2xl text-center bg-black text-white p-2">
            코리아티엠 광고
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {props.visit.adImgA && <ImgLoading image={props.visit.adImgA} />}
            {props.visit.adImgB && <ImgLoading image={props.visit.adImgB} />}
            {props.visit.adImgC && <ImgLoading image={props.visit.adImgC} />}
            {props.visit.adImgD && <ImgLoading image={props.visit.adImgD} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdImg;
