import React from "react";

interface IClientConfig {
  Gondul: string;
  Credentials: string;
}

const context = React.createContext<IClientConfig>({
  Credentials: btoa(`${process.env.GONDUL_USER}:${process.env.GONDUL_PASS}`),
  Gondul: process.env.GONDUL_HOST || "",
});

export function withClientConfig<P extends object>(
  Component: React.ComponentType<P & IClientConfig>
) {
  return function WithClientConfig(props: P) {
    return (
      <context.Consumer>
        {ctx => (
          <Component
            {...props}
            Credentials={ctx.Credentials}
            Gondul={ctx.Gondul}
          />
        )}
      </context.Consumer>
    );
  };
}
