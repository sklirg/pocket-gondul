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
  try {
    const resp = await fetch(`${api}/api/read/oplog`, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (resp.ok) {
      const jsoned = (await resp.json()) as IOPLogResponse;
      return Promise.resolve(jsoned);
    }

    return Promise.reject("Fetching messages failed.");
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getMessages(
  api: string,
  credentials: string
): Promise<IMessage[] | Error> {
  if (process.env.PG_USE_MOCKED_MESSAGES === "true") {
    return Promise.resolve(mockedMessages);
  }

  try {
    return convertOplogResponseToMessages(
      await fetchMessages(api, credentials)
    );
  } catch (error) {
    throw error;
  }
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

/**
 * Backend expects this format:
 * {"user":"sklirg","systems":"","log":"tester json format"}
 * {"user":"sklirg","systems":"","log":"msg"}
 * @param api Gondul API
 * @param credentials B64-encoded credentials for the API
 * @param message ... Does this really need documentation?
 */
export async function postMessage(
  api: string,
  credentials: string,
  message: IMessage
): Promise<boolean> {
  try {
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
      return Promise.reject(false);
    }
    return Promise.resolve(true);
  } catch (err) {
    console.error("Posting message failed", err);
    return Promise.reject(false);
  }
}

export default getMessages;
