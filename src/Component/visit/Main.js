import React, { useState, useEffect } from "react";

import Meet from "./Meet";

function Main() {
  const [alias, setAlias] = useState("");

  useEffect(() => {
    setAliasNum();
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `미팅자료`;
    // eslint-disable-next-line
  }, []);
  const setAliasNum = async () => {
    const aliasNum = searchParams.get("alias");
    setSearchParams(searchParams);
    if (aliasNum !== null || aliasNum !== undefined || aliasNum !== "")
      setAlias(aliasNum);
  };

  return (
    <div>
      <Meet alias={alias} />
    </div>
  );
}

export default Main;
