import React, { useEffect, useState } from "react";

import { withClientConfig } from "../ClientConfig";
import getMessages, { postMessage } from "../MessageService";

import Message, { IMessage } from "./Message";

import "./Messages.scss";

interface IProps {
  messages: IMessage[];
  chatUsername: string;
  postMessageHandler: (message: IMessage) => void;
}

const allSystemsValue = "Alle";

export default function Messages(props: IProps) {
  const [selectedSystem, setSelectedSystem] = useState(allSystemsValue);
  const [newMessage, setNewMessage] = useState("");

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
      <form
        className="messages--post"
        onSubmit={e => {
          e.preventDefault();
          props.postMessageHandler({
            message: newMessage,
            sender: props.chatUsername,
            systems: [],
            time: new Date(),
          });
          setNewMessage("");
        }}
      >
        <input
          className="messages--post--nick"
          placeholder="Nick"
          value={props.chatUsername}
          required={true}
          readOnly={true}
          disabled={true}
        />
        <input
          className="messages--post--text"
          placeholder="Din melding her..."
          value={newMessage}
          required={true}
          onChange={e => setNewMessage(e.target.value)}
        />
        <button type="submit" className="messages--post--submit">
          Send
        </button>
      </form>
    </div>
  );
}

let chatSubscription: number = 0;

export const MessagesContainer = withClientConfig(props => {
  const Credentials = props.Credentials;
  const Gondul = props.Gondul;

  const [messages, setMessages] = useState([] as IMessage[]);

  useEffect(() => {
    chatSubscription = window.setInterval(
      async () => setMessages(await getMessages(Gondul, Credentials)),
      1000
    );

    return function cleanup() {
      window.clearInterval(chatSubscription);
    };
  });

  return (
    <Messages
      messages={messages}
      chatUsername={props.ChatUsername}
      postMessageHandler={(message: IMessage) =>
        postMessage(Gondul, Credentials, message)
      }
    />
  );
});
