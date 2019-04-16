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
const localStorageUpdateFrequency = "pg-gondul-chat-update-frequency";

export function getFromLocalStorage(): IClientConfig {
  const gondul = window.localStorage.getItem(localStorageGondulAPI);
  const credentials = window.localStorage.getItem(
    localStorageGondulCredentials
  );
  const chatUsername = window.localStorage.getItem(
    localStorageGondulChatUserName
  );
  const rawUpdateFrequency = window.localStorage.getItem(
    localStorageUpdateFrequency
  );

  // Get update frequency value from localstorage
  // But make sure it's a number and not NaN (which is a number)
  let updateFrequency: number = 1000;
  if (rawUpdateFrequency !== null) {
    const parsedUpdateFrequency = parseInt(rawUpdateFrequency, 10);
    if (!isNaN(parsedUpdateFrequency)) {
      updateFrequency = parsedUpdateFrequency;
    }
  }

  return {
    ChatUsername: chatUsername || "",
    Credentials: credentials || "",
    Gondul: gondul || "",
    UpdateFrequency: updateFrequency,
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
  window.localStorage.setItem(
    localStorageUpdateFrequency,
    clientConfig.UpdateFrequency.toString()
  );
}
function clearLocalStorage() {
  window.localStorage.setItem(localStorageGondulAPI, "");
  window.localStorage.setItem(localStorageGondulCredentials, "");
  window.localStorage.setItem(localStorageGondulChatUserName, "");
  window.localStorage.setItem(localStorageUpdateFrequency, "");
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
  const [updateFrequency, setUpdateFrequency] = useState(
    clientConfig.UpdateFrequency
  );

  const hasVersionInfo =
    process.env.DRONE_COMMIT_LINK &&
    process.env.DRONE_COMMIT_MESSAGE &&
    process.env.DRONE_COMMIT_SHA;

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
          UpdateFrequency: updateFrequency,
        };
        setClientConfig(config);
        setLocalStorage(config);
      }}
    >
      <div>
        <label htmlFor="gondulApi">Gondul HTTP host</label>
        <input
          value={gondul}
          onChange={e => setGondul(e.target.value)}
          name="gondulApi"
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
      <div>
        <label htmlFor="gondulDelay">Update every (ms)</label>
        <input
          value={updateFrequency}
          onChange={e => setUpdateFrequency(parseInt(e.target.value, 10))}
          name="gondulDelay"
          type="number"
        />
      </div>
      <div className="appconfig--submit">
        <button
          type="button"
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
      {hasVersionInfo && (
        <div className="appconfig--version-info">
          <h4>Version info</h4>
          <p>
            <a href={process.env.DRONE_COMMIT_LINK}>
              {process.env.DRONE_COMMIT_SHA !== undefined &&
                process.env.DRONE_COMMIT_SHA.substr(0, 7)}
            </a>
            : <em>{process.env.DRONE_COMMIT_MESSAGE}</em>
          </p>
        </div>
      )}
    </form>
  );
}

export default AppConfig;
