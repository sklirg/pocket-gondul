import React, { Dispatch, SetStateAction, useState } from "react";
import { IClientConfig } from "./ClientConfig";

interface IAppConfig {
  clientConfig: IClientConfig;
  setClientConfig: Dispatch<SetStateAction<IClientConfig>>;
}

const localStorageGondulAPI = "pg-gondul";
const localStorageGondulCredentials = "pg-gondul-credentials";

export function getFromLocalStorage(): IClientConfig {
  const gondul = window.localStorage.getItem(localStorageGondulAPI);
  const credentials = window.localStorage.getItem(
    localStorageGondulCredentials
  );
  return {
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
}
function clearLocalStorage() {
  window.localStorage.setItem(localStorageGondulAPI, "");
  window.localStorage.setItem(localStorageGondulCredentials, "");
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
  const [reallyDelete, setReallyDelete] = useState(false);

  return (
    <form action="">
      <div>
        <label htmlFor="gondulApi">Gondul hostname (https://</label>
        <input
          value={gondul ? new URL(gondul).host : ""}
          onChange={e => setGondul(`https://${e.target.value}`)}
          name="gondulApi"
        />
        <span>/api/)</span>
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
      <button
        type="submit"
        onClick={e => {
          e.preventDefault();
          const config = {
            ...clientConfig,
            Credentials:
              user && pass ? btoa(`${user}:${pass}`) : clientConfig.Credentials,
            Gondul: gondul ? gondul : clientConfig.Gondul,
          };
          setClientConfig(config);
          setLocalStorage(config);
        }}
      >
        Lagre
      </button>
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
    </form>
  );
}

export default AppConfig;
