import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Firebase 초기화 후에 db 객체 가져오기
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import PointLogDetail from "./PointLogDetail";

import * as XLSX from "xlsx";

function PointLog() {
  const [points, setPoints] = useState([]);
  const [totalInc, setTotalInc] = useState("");
  const [totalDec, setTotalDec] = useState("");
  const [totalBuy, setTotalBuy] = useState("");
  const [totalReal, setTotalReal] = useState("");
  const [canSave, setCanSave] = useState(true);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(
        collection(db, "giftPoint"),
        where("uid", "!=", "9PJPYOSYo1NO3PD60SI8jyX3LZY2")
      );
      const processedData = data.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(doc => doc.id !== "serial")
        .filter(doc => doc.uid !== "9PJPYOSYo1NO3PD60SI8jyX3LZY2");
      setPoints(processedData);

      const totalInc = processedData.reduce(
        (sum, doc) => (doc.increase === true ? sum + doc.point : sum),
        0
      );
      const totalDec = processedData.reduce(
        (sum, doc) =>
          doc.increase === false && doc.type === "user" ? sum + doc.point : sum,
        0
      );
      const totalBuy = processedData.reduce(
        (sum, doc) =>
          doc.increase === false && doc.type === "bought"
            ? sum + doc.point
            : sum,
        0
      );
      const totalReal = processedData.reduce(
        (sum, doc) =>
          sum + (isNaN(Number(doc.realPrice)) ? 0 : Number(doc.realPrice)),
        0
      );

      setTotalInc(totalInc);
      setTotalDec(totalDec);
      setTotalBuy(totalBuy);
      setTotalReal(totalReal);
    };

    fetchData();
  }, []);

  const handleDateChange = setFunc => event => {
    setFunc(event.target.value);
    setCanSave(false);
  };

  const searchDate = async () => {
    if (end < start) {
      return alert("종료일을 시작일보다 이전으로 지정할 수 없습니다");
    }

    setPoints([]);
    setTotalInc("");
    setTotalBuy("");
    setTotalReal("");

    const startDate = new Date(start); // 시작 날짜 지정
    const endDate = new Date(end); // 종료 날짜 지정
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 59); // 종료 날짜의 시간을 23:59:59로 설정

    // 시작 날짜와 종료 날짜를 Firestore timestamp로 변환
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    // 쿼리 생성
    const q = query(
      collection(db, "giftPoint"),
      where("date", ">=", startTimestamp),
      where("date", "<=", endTimestamp),
      where("uid", "!=", "9PJPYOSYo1NO3PD60SI8jyX3LZY2")
    );
    // 쿼리 실행
    const data = await getDocs(q);
    const processedData = data.docs
      .map(doc => ({ ...doc.data(), id: doc.id }))
      .filter(doc => doc.id !== "serial")
      .filter(doc => doc.uid !== "9PJPYOSYo1NO3PD60SI8jyX3LZY2");
    setPoints(processedData);

    const totalInc = processedData.reduce(
      (sum, doc) => (doc.increase === true ? sum + doc.point : sum),
      0
    );
    const totalBuy = processedData.reduce(
      (sum, doc) => (doc.increase === false ? sum + doc.point : sum),
      0
    );
    const totalReal = processedData.reduce(
      (sum, doc) =>
        sum + (isNaN(Number(doc.realPrice)) ? 0 : Number(doc.realPrice)),
      0
    );

    setTotalInc(totalInc);
    setTotalBuy(totalBuy);
    setTotalReal(totalReal);
    setCanSave(true);
  };

  const exportToExcel = () => {
    if (!canSave) {
      return alert("날짜 지정 후 '검색'버튼을 눌러야 정확한 표가 나옵니다");
    }
    let period = "today";
    if (start !== "") {
      if (start === end) {
        period = start;
      } else {
        period = `${start}_${end}`;
      }
    }
    const table = document.getElementById("pointLog");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, `point_${period}.xlsx`);
  };

  return (
    <div>
      <h2 className="text-2xl p-2 font-medium">포인트 지급/차감현황</h2>
      <div className="grid grid-cols-4">
        <div className="p-2 text-lg">
          총 지급 포인트 :{" "}
          <span className="font-medium text-emerald-700">{totalInc}</span>포인트
        </div>
        <div className="p-2 text-lg">
          총 차감 포인트 :{" "}
          <span className="font-medium text-orange-500">{totalDec}</span>포인트
          <br />
          <small>(관리자가 차감한 포인트 입니다)</small>
        </div>
        <div className="p-2 text-lg">
          총 사용 포인트 :{" "}
          <span className="font-medium text-rose-500">{totalBuy}</span>포인트
          <br />
          <small>(포인트몰에서 사용한 포인트 입니다)</small>
        </div>
        <div className="p-2 text-lg">
          실제 총 사용 금액 :{" "}
          <span className="font-medium text-violet-500">{totalReal}</span>원
          <br />
          <small>(기프티쇼 비즈머니가 실제로 차감된 금액입니다.)</small>
        </div>
      </div>
      <div className="grid grid-cols-2 bg-gray-50 p-2 my-2">
        <div className="grid grid-cols-10 gap-x-2">
          <div className="col-span-2"></div>
          <div className="col-span-3 text-sm text-left">시작일</div>
          <div className="col-span-3 text-sm text-left">종료일</div>
          <div className="col-span-2"></div>
          <div className="py-2 text-center col-span-2">날짜선택</div>
          <div className="col-span-3">
            <input
              id="inputDate"
              type="date"
              value={start}
              className="p-2 border  w-full"
              onChange={handleDateChange(setStart)}
            />
          </div>
          <div className="col-span-3">
            <input
              id="inputDate"
              type="date"
              value={end}
              className="p-2 border w-full"
              onChange={handleDateChange(setEnd)}
            />
          </div>
          <div className="text-center col-span-2">
            <button
              className="w-full bg-green-500 hover:bg-green-700 p-2 text-white"
              onClick={searchDate}
            >
              검색
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-end">
          <div className="grid grid-cols-1">
            <div className="text-sm px-2">테이블 저장</div>
            <div className="p-2">
              <button
                className="bg-green-700 hover:bg-orange-700 text-white p-2"
                onClick={exportToExcel}
              >
                엑셀로 저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
      {points.length > 0 ? (
        <table id="pointLog" className="border bg-gray-200 w-full text-center">
          <thead className="border-b">
            <tr className="bg-white divide-x">
              <td className="p-2">변동일시</td>
              <td className="p-2">이름</td>
              <td className="p-2">변동포인트</td>
              <td className="p-2">변동 전 포인트</td>
              <td className="p-2">변동 후 포인트</td>
              <td className="p-2">증감여부</td>
              <td className="p-2">비고</td>
              <td className="p-2">실제쿠폰가</td>
            </tr>
          </thead>
          <tbody className="divide-y">
            {points.map((point, idx) => (
              <tr
                key={idx}
                data={point.uid}
                className={`${
                  point.uid !== "9PJPYOSYo1NO3PD60SI8jyX3LZY2"
                    ? point.increase
                      ? "bg-green-50"
                      : "bg-rose-50"
                    : "bg-gray-100"
                } divide-x`}
              >
                <PointLogDetail point={point} />
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "불러오는 중입니다"
      )}
    </div>
  );
}

export default PointLog;
