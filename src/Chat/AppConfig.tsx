import React, { Dispatch, SetStateAction, useState } from "react";
import { IClientConfig } from "./ClientConfig";

import "./AppConfig.scss";

interface IAppConfig {
  clientConfig: IClientConfig;
  setClientConfig: Dispatch<SetStateAction<IClientConfig>>;
}

const localStorageGondulAPI = "pg-gondul";
const localStorageGondulCredentials = "pg-gondul-credentials";
const localStorageGondulChatUserName = "pg-gondul-chat-username";

export function getFromLocalStorage(): IClientConfig {
  const gondul = window.localStorage.getItem(localStorageGondulAPI);
  const credentials = window.localStorage.getItem(
    localStorageGondulCredentials
  );
  const chatUsername = window.localStorage.getItem(
    localStorageGondulChatUserName
  );
  return {
    ChatUsername: chatUsername || "",
    Credentials: credentials || "",
    Gondul: gondul || "",
  };
}
function setLocalStorage(clientConfig: IClientConfig) {
  window.localStorage.setItem(localStorageGondulAPI, clientConfig.Gondul);
  window.localStorage.setItem(
    localStorageGondulCredentials,
    clientConfig.Credentials
  );
  window.localStorage.setItem(
    localStorageGondulChatUserName,
    clientConfig.ChatUsername
  );
}
function clearLocalStorage() {
  window.localStorage.setItem(localStorageGondulAPI, "");
  window.localStorage.setItem(localStorageGondulCredentials, "");
  window.localStorage.setItem(localStorageGondulChatUserName, "");
}

function AppConfig(props: IAppConfig) {
  const { clientConfig, setClientConfig } = props;
  const [gondul, setGondul] = useState(clientConfig.Gondul);
  const [user, setUser] = useState(
    atob(clientConfig.Credentials).split(":")[0]
  );
  const [pass, setPass] = useState(
    atob(clientConfig.Credentials).split(":")[1]
  );
  const [chatUsername, setChatUsername] = useState(clientConfig.ChatUsername);
  const [reallyDelete, setReallyDelete] = useState(false);

  return (
    <form
      className="appconfig"
      onSubmit={e => {
        e.preventDefault();
        const config = {
          ChatUsername: chatUsername,
          Credentials:
            user && pass ? btoa(`${user}:${pass}`) : clientConfig.Credentials,
          Gondul: gondul ? gondul : clientConfig.Gondul,
        };
        setClientConfig(config);
        setLocalStorage(config);
      }}
    >
      <div>
        <label htmlFor="gondulApi">Gondul hostname</label>
        <input
          value={gondul ? new URL(gondul).host : ""}
          onChange={e => setGondul(`https://${e.target.value}`)}
          name="gondulApi"
          pattern={"/(.[a-zA-Z0-9])/"}
          minLength={1}
        />
      </div>
      <div>
        <label htmlFor="gondulUser">Username</label>
        <input
          value={user}
          onChange={e => setUser(e.target.value)}
          name="gondulUser"
        />
      </div>
      <div>
        <label htmlFor="gondulPass">Password</label>
        <input
          value={pass}
          onChange={e => setPass(e.target.value)}
          name="gondulPass"
          type="password"
        />
      </div>
      <div>
        <label htmlFor="gondulChat">Chat username</label>
        <input
          value={chatUsername}
          onChange={e => setChatUsername(e.target.value)}
          name="gondulChat"
          type="text"
        />
      </div>
      <div className="appconfig--submit">
        <button
          onClick={e => {
            e.preventDefault();
            setReallyDelete(true);
            if (reallyDelete) {
              clearLocalStorage();
              setReallyDelete(false);
            }
          }}
        >
          {reallyDelete ? "Ja, jeg er sikker" : "Slett lagret informasjon"}
        </button>
        <button type="submit">Lagre</button>
      </div>
    </form>
  );
}

export default AppConfig;
