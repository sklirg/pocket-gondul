import { IMessage } from "./Components/Message";

import mockedMessages from "./MessagesMock";

const GONDUL_HOST = process.env.GONDUL_HOST;
const user = process.env.GONDUL_USER;
const pass = process.env.GONDUL_PASS;

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

async function fetchMessages(): Promise<IOPLogResponse> {
  const b64auth = btoa(`${user}:${pass}`);
  const resp = await fetch(`${GONDUL_HOST}/api/read/oplog`, {
    headers: {
      Authorization: `Basic ${b64auth}`,
    },
  });

  if (resp.ok) {
    // @ToDo: Add error handling
    const jsoned = (await resp.json()) as IOPLogResponse;
    return Promise.resolve(jsoned);
  }

  return Promise.reject("Fetching messages failed.");
}

async function getMessages(): Promise<IMessage[]> {
  if (process.env.PG_USE_MOCKED_MESSAGES) {
    return Promise.resolve(mockedMessages);
  }
  return convertOplogResponseToMessages(await fetchMessages());
}

export function convertOplogResponseToMessages(
  data: IOPLogResponse
): IMessage[] {
  return data.oplog.map(entry => ({
    message: entry.log,
    sender: entry.username,
    systems: entry.systems.split(","),
    time: new Date(entry.timestamp),
  }));
}

export default getMessages;
