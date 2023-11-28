import React, { useState, useEffect } from "react";

function PointLogDetail(props) {
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  useEffect(() => {
    formatDate(props.point.date.toDate());
    //eslint-disable-next-line
  }, []);

  function formatDate(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let year = d.getFullYear();
    let hour = "" + d.getHours();
    let minute = "" + d.getMinutes();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.length < 2) hour = "0" + hour;
    if (minute.length < 2) minute = "0" + minute;
    setDay([year, month, day].join("-"));
    setTime([hour, minute].join(":"));
  }
  return (
    <>
      <td className="p-2">
        {day} {time}
      </td>
      <td className="p-2">{props.point.name}</td>
      <td className="p-2 text-right">
        {Number(props.point.point).toLocaleString("ko-KR")}
      </td>
      <td className="p-2 text-right">
        {Number(props.point.beforePoint).toLocaleString("ko-KR")}
      </td>
      <td className="p-2 text-right">
        {Number(props.point.afterPoint).toLocaleString("ko-KR")}
      </td>
      <td className="p-2">{props.point.increase ? "증가" : "감소"}</td>
      <td className="p-2">
        {props.point.type === "board" ? (
          "신청 후 지급"
        ) : props.point.type === "user" ? (
          <>{props.point.increase ? "직접 지급" : "직접 차감"}</>
        ) : props.point.type === "bought" ? (
          "쿠폰 구매"
        ) : props.point.type === "promo" ? (
          "프로모션 지급"
        ) : (
          "불명"
        )}
      </td>
      <td className="p-2 text-right">
        {isNaN(Number(props.point?.realPrice))
          ? 0
          : Number(props.point?.realPrice).toLocaleString("ko-KR")}
      </td>
    </>
  );
}

export default PointLogDetail;
