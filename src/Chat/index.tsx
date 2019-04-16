import React, { Dispatch, SetStateAction, useState } from "react";
import { hot } from "react-hot-loader/root.js";

import AppConfig, { getFromLocalStorage } from "./AppConfig";
import { ContextProvider } from "./ClientConfig";
import { MessagesContainer } from "./Components/Messages";

import "./styles.scss";

type AppId = "OPLOG";

function getActiveApp(appId: AppId) {
  switch (appId) {
    case "OPLOG":
      return MessagesContainer;
  }
}

function MessagesApp() {
  // @ts-ignore - _ usually means unused.
  const [appId, _]: [AppId, Dispatch<SetStateAction<AppId>>] = useState(
    "OPLOG" as AppId
  );
  const [clientConfig, setClientConfig] = useState(getFromLocalStorage());
  const [showConfig, setShowConfig] = useState(false);

  const ActiveApp = getActiveApp(appId);

  return (
    <ContextProvider value={clientConfig}>
      <h1>
        {appId} <span onClick={() => setShowConfig(!showConfig)}>🐵</span>
      </h1>
      {showConfig && (
        <AppConfig
          clientConfig={clientConfig}
          setClientConfig={setClientConfig}
        />
      )}
      <ActiveApp />
      <div className="scroll-top--container">
        <button
          className="scroll-top--element"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          🔝
        </button>
      </div>
    </ContextProvider>
  );
}

export default hot(MessagesApp);
