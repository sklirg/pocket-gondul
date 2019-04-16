import React, { useEffect, useState } from "react";

import { withClientConfig } from "../ClientConfig";
import getMessages, { postMessage } from "../MessageService";

import Message, { errorMessagePrefix, IMessage } from "./Message";
import SendMessage from "./SendMessage";

import "./Messages.scss";

interface IProps {
  messages: IMessage[];
  chatUsername: string;
  postMessageHandler: (message: IMessage) => Promise<boolean>;
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
          <option value={allSystemsValue}>Alle systemer</option>
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
      <SendMessage
        username={props.chatUsername}
        postMessageHandler={(message: IMessage) =>
          props.postMessageHandler(message)
        }
      />
    </div>
  );
}

let chatSubscription: number = 0;

export const MessagesContainer = withClientConfig(props => {
  const Credentials = props.Credentials;
  const Gondul = props.Gondul;

  const [messages, setMessages] = useState([] as IMessage[]);

  const hasntFetchedMsg = "Har ikke hentet noen meldinger enda";
  let hasFetchedMsgs = false;
  if (messages.length === 0 && !hasFetchedMsgs) {
    messages.push({
      message: hasntFetchedMsg,
      sender: "Pocket-Gondul",
      systems: [],
      time: new Date(),
    });
  }

  useEffect(() => {
    chatSubscription = window.setInterval(() => {
      updateMessagesState(messages, Gondul, Credentials, setMessages);
      hasFetchedMsgs = true;
    }, 1000);

    return function cleanup() {
      window.clearInterval(chatSubscription);
    };
  });

  return (
    <Messages
      messages={messages}
      chatUsername={props.ChatUsername}
      postMessageHandler={(message: IMessage) => {
        const resp = postMessage(Gondul, Credentials, message);
        setMessages([message, ...messages]);
        return resp;
      }}
    />
  );
});

async function updateMessagesState(
  messages: IMessage[],
  api: string,
  credentials: string,
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
) {
  try {
    const fetchedMessages = (await getMessages(api, credentials)) as IMessage[];

    if (fetchedMessages.length !== messages.length) {
      setMessages(fetchedMessages);
    }
  } catch (err) {
    if (!messages.find(msg => msg.message.indexOf(errorMessagePrefix) !== -1)) {
      setMessages([
        {
          message: `${errorMessagePrefix}Error: ${err}`,
          sender: "Pocket-Gondul",
          systems: [],
          time: new Date(),
        },
        ...messages,
      ]);
    } else {
      setMessages([
        ...messages.map(msg =>
          msg.message.indexOf(errorMessagePrefix) !== -1
            ? { ...msg, time: new Date() }
            : msg
        ),
      ]);
    }
  }
}
