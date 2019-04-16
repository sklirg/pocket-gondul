import React from "react";

// tslint:disable-next-line:no-submodule-imports - Problem with esm in date-fns.
import format from "date-fns/format";
// tslint:disable-next-line:no-submodule-imports - Problem with esm in date-fns.
import nb from "date-fns/locale/nb/index.js";

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

function Message(props: IProps) {
  const timestring = format(props.time, "yyyy-MM-dd HH:mm:ss", {
    locale: nb,
  });

  return (
    <div className="message">
      <div className="message--time">{timestring}</div>
      <div className="message--sender">- {props.sender}</div>
      <div className="message--systems">
        {props.systems.length > 1 ? (
          <select onChange={event => props.onClickSystem(event.target.value)}>
            {props.systems.map(system => (
              <option key={system} value={system}>
                {system}
              </option>
            ))}
          </select>
        ) : (
          props.systems.map(system => (
            <button key={system} onClick={() => props.onClickSystem(system)}>
              {system}
            </button>
          ))
        )}
      </div>
      <div className="message--message">
        {props.message.replace(errorMessagePrefix, "")}
      </div>
    </div>
  );
}

export default Message;
