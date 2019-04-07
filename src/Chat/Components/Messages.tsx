import React, { useEffect, useState } from "react";

import getMessages from "../MessageService";

import Message, { IMessage } from "./Message";

import "./Messages.scss";

interface IProps {
  messages: IMessage[];
}

const allSystemsValue = "Alle";

export default function Messages(props: IProps) {
  const [selectedSystem, setSelectedSystem] = useState(allSystemsValue);

  const systems = [
    ...new Set(
      props.messages
        .map(message => message.systems)
        .reduce<string[]>((prev, current) => [...prev, ...current], [])
        .filter(system => system !== "")
        .sort()
    ),
  ];

  const filteredMessages =
    selectedSystem !== allSystemsValue
      ? props.messages.filter(
          message => message.systems.indexOf(selectedSystem) !== -1
        )
      : props.messages;

  return (
    <div className="messages">
      <div className="messages--select">
        <h2>Viser</h2>
        <select
          value={selectedSystem}
          onChange={event => setSelectedSystem(event.target.value)}
        >
          <option value={allSystemsValue}>Alle</option>
          {systems.map(system => (
            <option key={system} value={system}>
              {system}
            </option>
          ))}
        </select>
        {selectedSystem !== allSystemsValue && (
          <button onClick={() => setSelectedSystem(allSystemsValue)}>
            Vis alle
          </button>
        )}
      </div>
      {filteredMessages.map((message, i) => (
        <Message
          key={i}
          {...message}
          onClickSystem={(system: string) => setSelectedSystem(system)}
        />
      ))}
    </div>
  );
}

let chatSubscription: number = 0;

export function MessagesContainer() {
  const [messages, setMessages] = useState([] as IMessage[]);

  useEffect(() => {
    chatSubscription = setInterval(
      async () => setMessages(await getMessages()),
      1000
    );

    return function cleanup() {
      clearInterval(chatSubscription);
    };
  });

  return <Messages messages={messages} />;
}
