import React from "react";

function Banner(props) {
  return (
    <div className="w-full mb-2 h-24" id="banner">
      <div className="w-full h-full bg-black bg-opacity-60 flex flex-col justify-center">
        <div className="text-3xl text-white text-center font-medium">
          {props.text}
        </div>
      </div>
    </div>
  );
}

export default Banner;
