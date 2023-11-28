import React from "react";

function TemplateModal(props) {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed z-50 outline-none focus:outline-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full xl:w-fit p-2">
        <div className="relative lg:w-auto my-6 mx-auto">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none max-h-screen xl:p-6 p-2">
            <img src={props.template[0]} className="my-auto" alt="쿠폰이미지" />
          </div>
        </div>
      </div>

      <div
        className="opacity-25 fixed inset-0 z-40 bg-black"
        onClick={e => props.setTemplateModal(false)}
      ></div>
    </>
  );
}

export default TemplateModal;
