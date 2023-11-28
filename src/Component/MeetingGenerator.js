import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import dayjs from "dayjs";

function MeetingGenerator() {
  let now = dayjs();
  const navi = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [meetingSurvey, setMeetingSurvey] = useState([]);
  const [alias, setAlias] = useState("");

  useEffect(() => {
    setAliasNum();
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `미팅사전설문지`;
    // eslint-disable-next-line
  }, []);
  const setAliasNum = async () => {
    const aliasNum = searchParams.get("alias");
    setSearchParams(searchParams);
    if (aliasNum !== null || aliasNum !== undefined || aliasNum !== "")
      setAlias(aliasNum);
  };

  return <div>MeetingGenerator</div>;
}

export default MeetingGenerator;
