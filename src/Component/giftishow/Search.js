import React, { useState, useEffect } from "react";

const Search = props => {
  const [inputValue, setInputValue] = useState("");
  const [searchIt, setSearchIt] = useState(false);

  useEffect(() => {
    const se = setTimeout(() => {
      props.setKeyword(inputValue);
    }, 500);
    return () => clearInterval(se);
    //eslint-disable-next-line
  }, [inputValue]);

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <div className="hidden xl:block">
        <div className="p-1 container mx-auto">
          <div className="p-2 bg-blue-100 rounded-lg">
            <div className="px-1 flex flex-row justify-start">
              <h2 className="py-1 px-2 text-lg font-medium w-fit text-left break-keep flex flex-col justify-center">
                검색
              </h2>
              <div className=" flex flex-col justify-center w-full">
                <input
                  type="text"
                  className="p-2 border rounded-lg w-full"
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="검색할 키워드를 입력하세요"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block xl:hidden">
        <div className="p-1 container mx-auto">
          <div className="p-2 bg-blue-100 rounded-lg">
            <div className="px-1 flex flex-row justify-between">
              <h2 className="py-1 text-lg font-medium">검색</h2>
              <button
                className="py-1 px-4 text-sm bg-blue-500 text-white rounded-lg"
                onClick={e => setSearchIt(!searchIt)}
              >
                {searchIt ? "닫기" : "열기"}
              </button>
            </div>
            {searchIt && (
              <input
                type="text"
                className="p-2 border rounded-lg w-full mt-2"
                value={inputValue}
                onChange={handleChange}
                placeholder="검색할 키워드를 입력하세요"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
