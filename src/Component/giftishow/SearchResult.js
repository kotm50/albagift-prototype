import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase 초기화 후 db 객체를 가져옵니다.

function SearchResult(props) {
  const [goodsResult, setGoodsResult] = useState([]);
  const [brandsResult, setBrandsResult] = useState([]);
  const [loadTxt, setLoadTxt] = useState("검색 중입니다...");
  const [minHeight, setMinHeight] = useState("");

  useEffect(() => {
    getResult(props.keyword);
  }, [props.keyword]);

  useEffect(() => {
    if (goodsResult.length === 0 && brandsResult.length === 0) {
      setMinHeight("min-h-screen");
    } else {
      setMinHeight("");
    }
  }, [goodsResult, brandsResult]);

  const getResult = async keyword => {
    // 검색을 위해 Firestore의 gift 컬렉션에 쿼리를 실행합니다.
    // goodsName에 대한 쿼리
    setGoodsResult([]);
    setBrandsResult([]);
    setLoadTxt("검색 중입니다...");
    const goodsQueryA = query(
      collection(db, "gift"),
      where("keywords", "array-contains", keyword)
    );

    const brandsQueryA = query(
      collection(db, "gift"),
      where("brandName", "==", keyword)
    );

    try {
      const goodsSnapshotA = await getDocs(goodsQueryA);
      const goodsDocsA = goodsSnapshotA.docs.map(doc => doc.data());

      const brandsSnapshotA = await getDocs(brandsQueryA);
      const brandsDocsA = brandsSnapshotA.docs.map(doc => doc.data());

      const totalBrandResult = [...brandsDocsA];

      const totalGoodsResult = [...goodsDocsA];

      if (totalGoodsResult.length === 0 && totalBrandResult.length === 0) {
        setLoadTxt("검색 결과가 없습니다. 다른 키워드를 입력해 보세요");
      }
      setBrandsResult(totalBrandResult);
      setGoodsResult(totalGoodsResult);
    } catch (error) {
      console.error("Firestore 검색 오류:", error);
    }
  };

  return (
    <div className={`container mx-auto p-2 ${minHeight}`}>
      {props.keyword !== "" ? (
        <>
          <div className="font-medium text-sm text-right">
            <span className=" p-2 bg-white">
              키워드 : <span className="text-teal-500">{props.keyword}</span>
            </span>
          </div>
          {minHeight === "min-h-screen" ? (
            <div className="text-center my-2 font-medium">{loadTxt}</div>
          ) : null}
          {brandsResult.length > 0 && (
            <>
              <h3 className="p-2 text-lg font-medium">
                <span className="text-blue-500">{props.keyword}</span> 키워드가
                일치하는 브랜드 검색 결과
              </h3>
              <div className="container mx-auto my-2 rounded grid grid-cols-1 xl:grid-cols-5 gap-3">
                {brandsResult.slice(0, 10).map((g, idx) => (
                  <div key={idx}>
                    {g.discountPrice > 4000 ? (
                      <div
                        className="p-3 border bg-white hover:bg-indigo-500"
                        key={idx}
                      >
                        <Link
                          to={`/giftdetail/${g.goodsCode}`}
                          onClick={e => {
                            if (g.discountPrice < 4000) {
                              e.preventDefault();
                              alert("준비중 입니다");
                            }
                          }}
                        >
                          <div className="p-2 bg-white border">
                            <p className="text-lg font-medium text-gray-700 truncate">
                              <small className="block font-normal">
                                {g.affiliate}
                              </small>
                              {g.goodsName}
                            </p>
                            <img
                              src={g.goodsImgB}
                              alt={g.content}
                              className="max-h-32 mx-auto"
                            />
                            <p className="text-pink-500 text-xl text-right xl:text-right">
                              <span className="text-sm text-black font-medium">
                                가격
                              </span>{" "}
                              {g.kotiPrice}
                              <small className="font-normal text-gray-500">
                                Point
                              </small>
                            </p>
                          </div>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          )}
          {goodsResult.length > 0 && (
            <>
              <h3 className="p-2 text-lg font-medium">
                <span className="text-blue-500">{props.keyword}</span> 키워드 가
                포함된 상품 검색 결과
              </h3>
              <div className="container mx-auto my-2 rounded grid grid-cols-1 xl:grid-cols-5 gap-3">
                {goodsResult.slice(0, 10).map((g, idx) => (
                  <div key={idx}>
                    {g.discountPrice > 4000 ? (
                      <div
                        className="p-3 border bg-white hover:bg-indigo-500"
                        key={idx}
                      >
                        <Link
                          to={`/giftdetail/${g.goodsCode}`}
                          onClick={e => {
                            if (g.discountPrice < 4000) {
                              e.preventDefault();
                              alert("준비중 입니다");
                            }
                          }}
                        >
                          <div className="p-2 bg-white border">
                            <p className="text-lg font-medium text-gray-700 truncate">
                              <small className="block font-normal">
                                {g.affiliate}
                              </small>
                              {g.goodsName}
                            </p>
                            <img
                              src={g.goodsImgB}
                              alt={g.content}
                              className="max-h-32 mx-auto"
                            />
                            <p className="text-pink-500 text-xl text-right xl:text-right">
                              <span className="text-sm text-black font-medium">
                                가격
                              </span>{" "}
                              {g.kotiPrice}
                              <small className="font-normal text-gray-500">
                                Point
                              </small>
                            </p>
                          </div>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : null}
    </div>
  );
}

export default SearchResult;
