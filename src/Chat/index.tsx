import React, { Dispatch, SetStateAction, useState } from "react";
import { hot } from "react-hot-loader";

import { MessagesContainer } from "./Components/Messages";

type AppId = "OPLOG";

function getActiveApp(appId: AppId) {
  switch (appId) {
    case "OPLOG":
      return MessagesContainer;
  }
}

function MessagesApp() {
  const [appId, setAppId]: [AppId, Dispatch<SetStateAction<AppId>>] = useState(
    "OPLOG" as AppId
  );

  const ActiveApp = getActiveApp(appId);

  return (
    <>
      <h1>{appId}</h1>
      <ActiveApp />
    </>
  );
}

export default hot(module)(MessagesApp);
