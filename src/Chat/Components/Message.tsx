import React from "react";

import { format } from "date-fns";
// tslint:disable-next-line:no-submodule-imports - Problem with esm in date-fns.
import { nb } from "date-fns/locale";

import "./Message.scss";

export interface IProps {
  time: Date;
  sender: string;
  systems: string[];
  message: string;
}

class Message extends React.PureComponent<IProps> {
  public render() {
    const timestring = format(this.props.time, "YY-MM-dd HH:mm:ss", {
      awareOfUnicodeTokens: true,
      locale: nb,
    });

    return (
      <div className="message">
        <div className="message--time">{timestring}</div>
        <div className="message--sender">{this.props.sender}</div>
        <div className="message--systems">{this.props.systems.join(",")}</div>
        <div className="message--message">{this.props.message}</div>
      </div>
    );
  }
}

export default Message;
