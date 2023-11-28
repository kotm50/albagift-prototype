import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearUser } from "../../Reducer/userSlice";
import {
  setPageNumber,
  setLastDocumentFields,
  setFirstDocumentFields,
} from "../../Reducer/paginationSlice";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

import bgpc from "../../Asset/bg_sub.png";
import bgmo from "../../Asset/bg_int.png";
import Starbucks from "./Starbucks";
import Search from "./Search";
import { category } from "./Category";
import SearchResult from "./SearchResult";

function GiftList() {
  const location = useLocation();
  let navi = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const pageNumber = useSelector(state => state.pagination.pageNumber);
  const firstField = useSelector(state => state.pagination.firstDocumentFields);
  const lastField = useSelector(state => state.pagination.lastDocumentFields);
  const [loading, setLoading] = useState(false);
  const [goods, setGoods] = useState([]);
  const [cateName, setCateName] = useState();
  const { cateno, brandno } = useParams();
  const [keyword, setKeyword] = useState("");
  const [total, setTotal] = useState();
  const [lastPage, setLastPage] = useState();

  const [searching, setSearching] = useState(false);

  useEffect(() => {
    dispatch(setPageNumber(1));
    dispatch(setLastDocumentFields({}));
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    if (keyword === "") {
      setSearching(false);
    } else {
      setSearching(true);
    }
  }, [keyword]);

  useEffect(() => {
    chkAdmin(user);
    // eslint-disable-next-line
  }, []);

  const chkAdmin = user => {
    setTimeout(() => {
      if (user.admin) {
        let confirm = window.confirm(
          "관리자로 로그인하셨습니다. 관리자 페이지로 이동하시겠습니까?\n확인을 누르면 관리자 페이지로 이동하고, 취소를 누르면 로그아웃 됩니다."
        );
        if (confirm) {
          navi("/giftadmin");
        } else {
          logout();
        }
      }
    }, 100);
  };

  const logout = async () => {
    await signOut(auth)
      .then(() => {
        onAuthStateChanged(auth, user => {
          if (user !== null) {
            dispatch(
              loginUser({ uid: user.uid, accessToken: user.accessToken })
            );
          } else {
            dispatch(clearUser());
          }
        });
        window.location.reload(false);
      })
      .catch(error => {
        // An error happened.
      });
  };
  //eslint-disable-next-line
  const fetchGifts = async (after = null) => {
    setLoading(true);
    let giftQuery;
    let giftQueryLimit;
    if (brandno === undefined) {
      if (cateno !== undefined) {
        giftQuery = query(
          collection(db, "gift"),
          where("category1Seq", "==", Number(cateno))
        );
        giftQueryLimit = query(
          collection(db, "gift"),
          where("category1Seq", "==", Number(cateno)),
          orderBy("ts"), // discountPrice 필드를 기준으로 정렬
          limit(20)
        );
      } else {
        giftQuery = query(
          collection(db, "gift"),
          orderBy("discountPrice") // discountPrice 필드를 기준으로 정렬
        );
        giftQueryLimit = query(
          collection(db, "gift"),
          orderBy("ts"), // discountPrice 필드를 기준으로 정렬
          limit(20)
        );
      }
    } else {
      const brandName = await getBrandName(brandno);
      giftQuery = query(
        collection(db, "gift"),
        where("brandName", "==", brandName)
      );
      giftQueryLimit = query(
        collection(db, "gift"),
        where("brandName", "==", brandName),
        orderBy("ts"), // discountPrice 필드를 기준으로 정렬
        limit(20)
      );
    }

    if (after) {
      giftQueryLimit = query(giftQueryLimit, startAfter(after.ts));
    }

    const total = await getTotal(giftQuery);
    let page = total / 20;
    setTotal(total);
    setLastPage(Math.ceil(page));
    const giftSnapshot = await getDocs(giftQueryLimit);

    // 문서가 없는 경우에 대한 처리
    if (giftSnapshot.docs.length === 0) {
      setGoods([]);
      setLoading(false);
      return; // 함수를 종료하고 나머지 로직을 실행하지 않습니다.
    }

    const newGifts = giftSnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      num: doc.data().id,
    }));

    // firstDocumentFields를 설정
    const firstDocumentSnapshot = giftSnapshot.docs[0];
    const firstDocumentFields = {
      ts: firstDocumentSnapshot.data().ts,
    }; // 예시 필드
    dispatch(setFirstDocumentFields(firstDocumentFields));

    // lastDocumentFields를 설정
    const lastDocumentSnapshot =
      giftSnapshot.docs[giftSnapshot.docs.length - 1];
    const lastDocumentFields = {
      ts: lastDocumentSnapshot.data().ts,
    }; // 예시 필드
    dispatch(setLastDocumentFields(lastDocumentFields));
    setGoods(newGifts);
    setLoading(false);
  };

  const getTotal = async q => {
    const querySnapshot = await getDocs(q);

    // 쿼리에 일치하는 문서의 총 수를 'total' 변수에 저장
    const total = querySnapshot.size;

    return total;
  };

  const getBrandName = async no => {
    try {
      const brandCollectionRef = collection(db, "brand");
      const q = query(brandCollectionRef, where("brandSeq", "==", Number(no)));
      const querySnapshot = await getDocs(q);
      let brandList = [];
      querySnapshot.forEach(doc => {
        const brandData = doc.data();
        const brandName = brandData.brandName;
        brandList.push(brandName);
      });

      return brandList[0];
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (cateno !== undefined) {
      setCateName(getCategoryName(cateno));
    }
    if (firstField) {
      fetchGifts();
    } else {
      fetchGifts();
    }
    //eslint-disable-next-line
  }, [location]);
  const getCategoryName = seq => {
    const result = category.find(item => item.category1Seq === Number(seq));

    if (result) {
      return result.category1Name;
    } else {
      return "Category not found";
    }
  };

  const fetchNextGifts = async () => {
    setLoading(true);
    let giftQueryNext;
    if (brandno === undefined) {
      if (cateno !== undefined) {
        giftQueryNext = query(
          collection(db, "gift"),
          where("category1Seq", "==", Number(cateno)),
          orderBy("ts"),
          startAfter(lastField.ts), // 저장된 마지막 문서의 필드
          limit(20)
        );
      } else {
        giftQueryNext = query(
          collection(db, "gift"),
          orderBy("ts"),
          startAfter(lastField.ts), // 저장된 마지막 문서의 필드
          limit(20)
        );
      }
    } else {
      const brandName = await getBrandName(brandno);
      giftQueryNext = query(
        collection(db, "gift"),
        where("brandName", "==", brandName),
        orderBy("ts"),
        startAfter(lastField.ts), // 저장된 마지막 문서의 필드
        limit(20)
      );
    }

    const giftSnapshot = await getDocs(giftQueryNext);
    if (giftSnapshot.docs.length > 0) {
      const newGifts = giftSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        num: doc.data().id,
      }));
      // 새로운 첫 번째 문서와 마지막 문서를 저장
      const firstDocumentFields = {
        ts: giftSnapshot.docs[0].data().ts,
      };
      const lastDocumentFields = {
        ts: giftSnapshot.docs[giftSnapshot.docs.length - 1].data().ts,
      };
      dispatch(setFirstDocumentFields(firstDocumentFields));
      dispatch(setLastDocumentFields(lastDocumentFields));
      dispatch(setPageNumber(pageNumber + 1));

      setGoods(newGifts);
    } else {
      console.log("No more documents found");
    }
    setLoading(false);
  };

  const fetchPreviousGifts = async () => {
    setLoading(true);

    let giftQueryPrev;
    if (brandno === undefined) {
      if (cateno !== undefined) {
        giftQueryPrev = query(
          collection(db, "gift"),
          where("category1Seq", "==", Number(cateno)),
          orderBy("ts", "desc"), // 역순 정렬
          startAfter(firstField.ts), // 저장된 첫 번째 문서의 필드
          limit(20)
        );
      } else {
        giftQueryPrev = query(
          collection(db, "gift"),
          orderBy("ts", "desc"), // 역순 정렬
          startAfter(firstField.ts), // 저장된 첫 번째 문서의 필드
          limit(20)
        );
      }
    } else {
      const brandName = await getBrandName(brandno);
      giftQueryPrev = query(
        collection(db, "gift"),
        where("brandName", "==", brandName),
        orderBy("ts", "desc"), // 역순 정렬
        startAfter(firstField.ts), // 저장된 첫 번째 문서의 필드
        limit(20)
      );
    }

    const giftSnapshot = await getDocs(giftQueryPrev);
    const newGifts = giftSnapshot.docs
      .map(doc => ({
        ...doc.data(),
        id: doc.id,
        num: doc.data().id,
      }))
      .reverse(); // 다시 정순으로

    // 새로운 첫 번째 문서와 마지막 문서를 저장
    const firstDocumentFields = {
      ts: newGifts[0].ts,
    };
    const lastDocumentFields = {
      ts: newGifts[newGifts.length - 1].ts,
    };
    dispatch(setFirstDocumentFields(firstDocumentFields));
    dispatch(setLastDocumentFields(lastDocumentFields));

    dispatch(setPageNumber(pageNumber - 1));

    setGoods(newGifts);
    setLoading(false);
  };
  return (
    <>
      <div className="hidden xl:block w-full pb-0 bg-blue-500">
        <Link to="/giftinfo">
          <img
            src={bgpc}
            alt="면접샵"
            className="max-w-full mx-auto bg-blue-500"
          />
        </Link>
      </div>
      <div className="block xl:hidden w-full pb-0 bg-blue-500">
        <Link to="/giftinfo">
          <img
            src={bgmo}
            alt="면접샵"
            className="max-w-full mx-auto bg-blue-500"
          />
        </Link>
      </div>
      <hr className="my-2" />
      <Search setKeyword={setKeyword} />
      <hr className="my-2" />
      {searching ? (
        <SearchResult keyword={keyword} />
      ) : (
        <>
          {cateno !== undefined && (
            <>
              <div className="w-11/12 xl:container mx-auto my-2 text-2xl font-bold">
                {cateName}{" "}
                <small className="font-normal text-sm xl:text-base">
                  <strong className="text-rose-500">{total}</strong>개의 상품이
                  있습니다
                </small>
              </div>
              <hr className="my-2" />
            </>
          )}
          {goods.length === 0 ? (
            <>
              {loading ? (
                <div className="container mx-auto my-2 rounded grid grid-cols-2 xl:grid-cols-5 xl:gap-3 gap-1">
                  <div className="p-3 border bg-white">
                    <div className="p-2 bg-white border animate-pulse h-64 relative">
                      <p className="text-lg w-1/2 h-3 bg-slate-200 truncate" />
                      <div className="w-full h-44 bg-slate-200 my-3" />
                      <div className="absolute bottom-2 w-full">
                        <p className="text-sm text-right h-2 xl:text-right bg-slate-200 w-2/3" />
                        <p className=" bg-slate-200 h-3 w-3/4 text-xl text-right xl:text-right mt-2" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border bg-white">
                    <div className="p-2 bg-white border animate-pulse h-64 relative">
                      <p className="text-lg w-1/2 h-3 bg-slate-200 truncate" />
                      <div className="w-full h-44 bg-slate-200 my-3" />
                      <div className="absolute bottom-2 w-full">
                        <p className="text-sm text-right h-2 xl:text-right bg-slate-200 w-2/3" />
                        <p className=" bg-slate-200 h-3 w-3/4 text-xl text-right xl:text-right mt-2" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full text-center my-3 font-bold text-lg h-64 flex flex-col justify-center">
                  죄송합니다, 상품이 준비되지 않았습니다. <br />
                  다른 브랜드를 선택해 주세요
                </div>
              )}
            </>
          ) : (
            <>
              {cateno === undefined && pageNumber === 1 && (
                <>
                  <div className="container mx-auto mb-3">
                    <Starbucks />
                  </div>
                  <h2 className="container mx-auto text-2xl font-bold pl-2 xl:pl-0">
                    전체상품{" "}
                    <small className="font-normal text-sm xl:text-base">
                      <strong className="text-rose-500">{total}</strong>개의
                      상품이 있습니다
                    </small>
                  </h2>
                </>
              )}
              {goods.length > 0 && (
                <>
                  <div className="container mx-auto my-2 rounded grid grid-cols-2 xl:grid-cols-5 gap-1 xl:gap-3">
                    {goods.map((g, idx) => (
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
                                <p className="text-sm xl:text-lg font-medium text-gray-700 truncate">
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
                                <p className="text-pink-500 text-lg xl:text-xl text-right xl:text-right mt-3">
                                  <span className="text-sm text-black font-medium hidden xl:inline">
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

                  <div className="p-2 flex flex-row justify-around xl:justify-center xl:gap-10">
                    {pageNumber !== 1 ? (
                      <button
                        onClick={fetchPreviousGifts}
                        className="bg-white border rounded-sm p-2 hover:bg-indigo-500 hover:text-white"
                      >
                        이전으로
                      </button>
                    ) : (
                      <div className="p-2"></div>
                    )}

                    <div className="p-2">
                      <strong>{pageNumber}</strong> / {lastPage}
                    </div>
                    {pageNumber !== lastPage ? (
                      <button
                        onClick={fetchNextGifts}
                        className="bg-white border rounded-sm p-2 hover:bg-indigo-500 hover:text-white"
                      >
                        다음으로
                      </button>
                    ) : (
                      <div className="p-2"></div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default GiftList;
