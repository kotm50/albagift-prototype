const functions = require("firebase-functions");
const axios = require("axios");
const qs = require("querystring");
const express = require("express");
const cors = require("cors");
const request = require("request");

const app = express();

const corsHandler = cors();
app.use(corsHandler);
app.use(express.json());

//상품상세정보
app.post("/bizApi/getProductDetail", async (req, res) => {
  const apiUrl = `https://bizapi.giftishow.com/bizApi/goods/${req.body.goodsCode}`;

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = {
    api_code: "0111",
    custom_auth_code: "REALd6f625bd88904490938d49ebb9687a3b",
    custom_auth_token: "fTy+x/JCLaWNusNPs07//w==",
    dev_yn: "N",
    goods_code: req.body.goodsCode,
  };

  try {
    const response = await axios.post(apiUrl, qs.stringify(data), {
      headers,
    });
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error:", error.message); // 오류 로깅 추가
    res.status(500).send({ error: error.message });
  }
});

//쿠폰발송
app.post("/bizApi/sendCoupon", async (req, res) => {
  const apiUrl = `https://bizapi.giftishow.com/bizApi/send`;

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = {
    api_code: "0204",
    custom_auth_code: "REALd6f625bd88904490938d49ebb9687a3b",
    custom_auth_token: "fTy+x/JCLaWNusNPs07//w==",
    dev_yn: "N",
    goods_code: req.body.goodsCode,
    order_no: req.body.orderNo,
    callback_no: "16444223",
    phone_no: req.body.phone,
    tr_id: req.body.trId,
    mms_title: "코리아티엠 면접샵입니다",
    mms_msg: `${req.body.goodsName}`,
    template_id: "202308010219374",
    banner_id: "202308010243647",
    user_id: "millinien@naver.com",
    gubun: "I",
    rev_info_yn: "N",
  };

  console.log("Request data:", data); // 로깅 추가

  try {
    const response = await axios.post(apiUrl, qs.stringify(data), {
      headers,
    });
    console.log("Response data:", response.data); // 응답 데이터 로깅 추가
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error:", error.message); // 오류 로깅 추가
    res.status(500).send({ error: error.message });
  }
});

//쿠폰정보
app.post("/bizApi/coupons", async (req, res) => {
  const apiUrl = `https://bizapi.giftishow.com/bizApi/coupons`;

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = {
    api_code: "0201",
    custom_auth_code: "REALd6f625bd88904490938d49ebb9687a3b",
    custom_auth_token: "fTy+x/JCLaWNusNPs07//w==",
    dev_yn: "N",
    tr_id: req.body.trId,
  };

  console.log("Request data:", data); // 로깅 추가

  try {
    const response = await axios.post(apiUrl, qs.stringify(data), {
      headers,
    });
    console.log("Response data:", response.data); // 응답 데이터 로깅 추가
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error:", error.message); // 오류 로깅 추가
    res.status(500).send({ error: error.message });
  }
});

//쿠폰취소(미사용)
app.post("/bizApi/cancel", async (req, res) => {
  const apiUrl = `https://bizapi.giftishow.com/bizApi/cancel`;

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = {
    api_code: "0202",
    custom_auth_code: "REALd6f625bd88904490938d49ebb9687a3b",
    custom_auth_token: "fTy+x/JCLaWNusNPs07//w==",
    dev_yn: "N",
    tr_id: req.body.trId,
    user_id: "millinien@naver.com",
  };

  console.log("Request data:", data); // 로깅 추가

  try {
    const response = await axios.post(apiUrl, qs.stringify(data), {
      headers,
    });
    console.log("Response data:", response.data); // 응답 데이터 로깅 추가
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error:", error.message); // 오류 로깅 추가
    res.status(500).send({ error: error.message });
  }
});

//전체상품받기
app.post("/bizApi/getAllGoods", async (req, res) => {
  const apiUrl = "https://bizapi.giftishow.com/bizApi/goods";

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = {
    api_code: "0101",
    custom_auth_code: "REALd6f625bd88904490938d49ebb9687a3b",
    custom_auth_token: "fTy+x/JCLaWNusNPs07//w==",
    dev_yn: "N",
    start: 1,
    size: req.body.size || "12",
  };

  try {
    const response = await axios.post(apiUrl, qs.stringify(data), {
      headers,
    });
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error:", error.message); // 오류 로깅 추가
    res.status(500).send({ error: error.message });
  }
});

//브랜드리스트(미사용)
app.post("/bizApi/getBrandList", async (req, res) => {
  const apiUrl = `https://bizapi.giftishow.com/bizApi/brands`;

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = {
    api_code: "0102",
    custom_auth_code: "REALd6f625bd88904490938d49ebb9687a3b",
    custom_auth_token: "fTy+x/JCLaWNusNPs07//w==",
    dev_yn: "N",
  };

  console.log("Request data:", data); // 로깅 추가

  try {
    const response = await axios.post(apiUrl, qs.stringify(data), {
      headers,
    });
    console.log("Response data:", response.data); // 응답 데이터 로깅 추가
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error:", error.message); // 오류 로깅 추가
    res.status(500).send({ error: error.message });
  }
});

//지정 상품리스트
app.post("/bizApi/getProductList", async (req, res) => {
  const apiUrl = "https://bizapi.giftishow.com/bizApi/goods";

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = {
    api_code: "0101",
    custom_auth_code: "REALd6f625bd88904490938d49ebb9687a3b",
    custom_auth_token: "fTy+x/JCLaWNusNPs07//w==",
    dev_yn: "N",
    start: req.body.start,
    size: req.body.size || "12",
  };

  try {
    const response = await axios.post(apiUrl, qs.stringify(data), {
      headers,
    });
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Error:", error.message); // 오류 로깅 추가
    res.status(500).send({ error: error.message });
  }
});

// 이미지 다운로드 프록시
app.get("/downloadImageProxy", (req, res) => {
  const url = req.query.url;
  console.log(url);

  // 유효성 검사: 요청된 URL이 있어야 합니다.
  if (!url) {
    return res.status(400).send({ error: "Missing URL parameter" });
  }

  // 요청을 시작하고 응답 헤더를 검사합니다.
  request(url)
    .on("response", response => {
      // 올바른 Content-Type을 설정합니다.
      if (response.headers["content-type"]) {
        res.setHeader("Content-Type", response.headers["content-type"]);
      }
    })
    .pipe(res);
});

exports.bizApi = functions.region("asia-northeast2").https.onRequest(app);
