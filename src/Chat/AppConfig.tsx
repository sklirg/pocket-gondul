import React, { Dispatch, SetStateAction, useState } from "react";
import { IClientConfig } from "./ClientConfig";

interface IAppConfig {
  clientConfig: IClientConfig;
  setClientConfig: Dispatch<SetStateAction<IClientConfig>>;
}

function AppConfig(props: IAppConfig) {
  const {clientConfig, setClientConfig} = props;
  const [gondul, setGondul] = useState(clientConfig.Gondul);
  const [user, setUser] = useState(
    atob(clientConfig.Credentials).split(":")[0]
  );

  const [pass, setPass] = useState(atob(clientConfig.Credentials).split(":")[1]);
    return (
        <form action="">
          <div>
            <label htmlFor="gondulApi">Gondul hostname (https://</label>
            <input
              value={new URL(gondul).host}
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
          <button type="submit" onClick={e => {
            e.preventDefault();
            setClientConfig({
                ...clientConfig,
                Credentials: (user && pass) ? btoa(`${user}:${pass}`) : clientConfig.Credentials,
                Gondul: gondul ? gondul : clientConfig.Gondul,
            })
          }}>Lagre</button>
        </form>
    )
}

export default AppConfig;
