import React, { useState } from "react";

import { IMessage } from "./Message";

import "./SendMessage.scss";

interface IProps {
  postMessageHandler: (message: IMessage) => Promise<boolean>;
  username: string;
}

type SendStatus = "Send" | "Sender" | "Prøv igjen";

export default function SendMessage(props: IProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sendMsg, setSendMsg] = useState("Send" as SendStatus);

  const onMsgChange = (m: string) => {
    setSendMsg("Send");
    setNewMessage(m);
  };

  return (
    <form
      className="post-message"
      onSubmit={async e => {
        e.preventDefault();
        setSendMsg("Sender");
        try {
          const posted = await props.postMessageHandler({
            message: newMessage,
            sender: props.username,
            systems: [],
            time: new Date(),
          });
          if (posted) {
            setNewMessage("");
            setSendMsg("Send");
          }
          setSendMsg("Prøv igjen");
        } catch (err) {
          setSendMsg("Prøv igjen");
        }
      }}
    >
      <input
        className="post-message--nick"
        placeholder="Nick"
        value={props.username}
        required={true}
        readOnly={true}
        disabled={true}
      />
      <input
        className="post-message--text"
        placeholder="Din melding her..."
        value={newMessage}
        required={true}
        onChange={e => onMsgChange(e.target.value)}
      />
      <button type="submit" className="post-message--submit">
        {sendMsg}
      </button>
    </form>
  );
}
