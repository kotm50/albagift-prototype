import React from "react";

import user from "../Asset/user.png";

function PhotoErr(props) {
  const handleImgError = e => {
    e.target.src = user;
  };

  return (
    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden flex flex-col justify-center bg-indigo-500">
      <img
        src={props.photo}
        alt={props.name}
        className="w-full mx-auto my-auto"
        onError={e => handleImgError(e)}
      />
    </div>
  );
}

export default PhotoErr;
