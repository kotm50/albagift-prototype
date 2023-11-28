import React from "react";
import ImgLoading from "./ImgLoading";

function ExistImg(props) {
  return (
    <div>
      {props.visit.existImgA && (
        <div className="w-full lg:container lg:mx-auto mb-3 bg-white p-3 rounded drop-shadow-lg">
          <h2 className="text-2xl text-center bg-black text-white p-2">
            기존 사용 광고
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {props.visit.existImgA && (
              <ImgLoading image={props.visit.existImgA} />
            )}
            {props.visit.existImgB && (
              <ImgLoading image={props.visit.existImgB} />
            )}
            {props.visit.existImgC && (
              <ImgLoading image={props.visit.existImgC} />
            )}
            {props.visit.existImgD && (
              <ImgLoading image={props.visit.existImgD} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExistImg;
