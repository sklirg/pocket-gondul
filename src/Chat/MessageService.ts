import { IMessage } from "./Components/Message";

import mockedMessages from "./MessagesMock";

export interface IOPLogEntry {
  log: string;
  timestamp: string;
  username: string;
  time: string;
  id: number;
  systems: string;
}

export interface IOPLogResponse {
  oplog: IOPLogEntry[];
}

async function fetchMessages(
  api: string,
  credentials: string
): Promise<IOPLogResponse> {
  const resp = await fetch(`${api}/api/read/oplog`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (resp.ok) {
    // @ToDo: Add error handling
    const jsoned = (await resp.json()) as IOPLogResponse;
    return Promise.resolve(jsoned);
  }

  return Promise.reject("Fetching messages failed.");
}

async function getMessages(
  api: string,
  credentials: string
): Promise<IMessage[]> {
  if (process.env.PG_USE_MOCKED_MESSAGES === "true") {
    return Promise.resolve(mockedMessages);
  }
  return convertOplogResponseToMessages(await fetchMessages(api, credentials));
}

export function convertOplogResponseToMessages(
  data: IOPLogResponse
): IMessage[] {
  return data.oplog.map(entry => ({
    message: entry.log,
    sender: entry.username,
    systems: entry.systems.split(",").map(system => system.replace(/"/g, "")),
    time: new Date(entry.timestamp),
  }));
}

export async function postMessage(
  api: string,
  credentials: string,
  message: IMessage
) {
  const resp = await fetch(`${api}/api/write/oplog`, {
    body: JSON.stringify({
      log: message.message,
      systems: message.systems.join(","),
      user: message.sender,
    }),
    headers: {
      Authorization: `Basic ${credentials}`,
    },
    method: "POST",
  });

  if (!resp.ok) {
    console.error("Posting message failed", resp);
  }
}

export default getMessages;
