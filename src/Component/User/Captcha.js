import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

function Captcha() {
  const recaptchaRef = useRef();
  const setCaptcha = v => {
    console.log("Captcha value:", v);
  };
  return (
    <div>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6LfTi5kkAAAAAEiTCCP15bKwP3QxM4Fz44GgRJmE"
        onChange={setCaptcha}
      />
    </div>
  );
}

export default Captcha;
