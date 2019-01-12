import { IMessage } from "./Components/Message";

const messagesMock: IMessage[] = [
  {
    message:
      "Deltaker ville være uplink. Da fikk ingen andre nett. Ba deltaker om å ikke være uplink. Nettet kom tilbake.",
    sender: "karslen",
    systems: ["e63-1"],
    time: new Date(2018, 4, 1, 9, 59, 8),
  },
  {
    message: "Hentet inn. Ligger i noc, skal zeroizes",
    sender: "linge",
    systems: ["s5.sponsor"],
    time: new Date(2018, 4, 1, 10, 3, 24),
  },
];

export default messagesMock;
