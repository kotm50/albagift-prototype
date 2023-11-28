import { useEffect } from "react";

const RefreshOff = () => {
  const handleKeyDown = event => {
    if (
      event.key === "F5" ||
      (event.key === "r" && (event.ctrlKey === true || event.metaKey === true))
    ) {
      event.preventDefault();
      alert("새로고침을 실행할 수 없습니다.");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
};

export default RefreshOff;
