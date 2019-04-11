import React from "react";

import { format } from "date-fns";
// tslint:disable-next-line:no-submodule-imports - Problem with esm in date-fns.
import { nb } from "date-fns/locale";

import "./Message.scss";

export interface IMessage {
  time: Date;
  sender: string;
  systems: string[];
  message: string;
}

export const errorMessagePrefix = "PG-ERR";

interface IProps extends IMessage {
  onClickSystem: (system: string) => void;
}

class Message extends React.PureComponent<IProps> {
  public render() {
    const timestring = format(this.props.time, "yyyy-MM-dd HH:mm:ss", {
      locale: nb,
    });

    return (
      <div className="message">
        <div className="message--time">{timestring}</div>
        <div className="message--sender">- {this.props.sender}</div>
        <div className="message--systems">
          {this.props.systems.map(system => (
            <button
              key={system}
              onClick={() => this.props.onClickSystem(system)}
            >
              {system}
            </button>
          ))}
        </div>
        <div className="message--message">
          {this.props.message.replace(errorMessagePrefix, "")}
        </div>
      </div>
    );
  }
}

export default Message;
