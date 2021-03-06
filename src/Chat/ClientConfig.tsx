import React from "react";

export interface IClientConfig {
  Gondul: string;
  Credentials: string;
  ChatUsername: string;
  UpdateFrequency: number;
}

export const defaultClientConfig = {
  ChatUsername: "",
  Credentials: btoa(`${process.env.GONDUL_USER}:${process.env.GONDUL_PASS}`),
  Gondul: process.env.GONDUL_HOST || "",
  UpdateFrequency: 1000,
};

const context = React.createContext<IClientConfig>(defaultClientConfig);

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
            ChatUsername={ctx.ChatUsername}
            UpdateFrequency={ctx.UpdateFrequency}
          />
        )}
      </context.Consumer>
    );
  };
}

export const ContextConsumer = context.Consumer;
export const ContextProvider = context.Provider;
