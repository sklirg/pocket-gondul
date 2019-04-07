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
  const [selectedTimeFilter, setTimeFilter] = useState(360);
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

  const systemFilter = (message: IMessage) =>
    message.systems.indexOf(selectedSystem) !== -1;
  const timeFilter = (message: IMessage) =>
    new Date().getTime() - message.time.getTime() <
    selectedTimeFilter * 60 * 1000;
  const filters = [];

  if (selectedSystem !== allSystemsValue) {
    filters.push(systemFilter);
  }
  if (selectedTimeFilter !== 0) {
    filters.push(timeFilter);
  }

  const filteredMessages = filters.reduce<IMessage[]>(
    (d, f) => d.filter(f),
    props.messages
  );

  return (
    <div className="messages">
      <div className="messages--select">
        <h2>Viser</h2>
        <select
          value={selectedSystem}
          onChange={event => setSelectedSystem(event.target.value)}
        >
          <option value={allSystemsValue}>Alle systemer</option>
          {systems.map(system => (
            <option key={system} value={system}>
              {system}
            </option>
          ))}
        </select>
        <select
          value={selectedTimeFilter}
          onChange={e => setTimeFilter(parseInt(e.target.value, 10))}
        >
          <option value={0}>All tid</option>
          <option value={15}>15 min</option>
          <option value={30}>30 min</option>
          <option value={60}>1 time</option>
          <option value={360}>6 timer</option>
          <option value={1440}>24 timer</option>
        </select>
        {props.messages.length !== filteredMessages.length && (
          <button
            onClick={() => {
              setSelectedSystem(allSystemsValue);
              setTimeFilter(0);
            }}
          >
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
    chatSubscription = window.setInterval(async () => {
      const fetchedMessages = await getMessages(Gondul, Credentials);
      if (fetchedMessages.length !== messages.length) {
        setMessages(fetchedMessages);
      }
    }, 1000);

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
