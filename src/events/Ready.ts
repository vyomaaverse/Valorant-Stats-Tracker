import { ActivityType, Client, Events } from "discord.js";
import { ClientInterface } from "../utils/interfaces/ClientInterface.js";
import { EventInterface } from "../utils/interfaces/EventInterface.js";

export class Ready implements EventInterface {
  public name = Events.ClientReady;
  execute(client: ClientInterface, ...args: any[]) {
    client.logger.log("info", `Client ${client.user?.username} is now ready!`);
    client.user?.setPresence({
      activities: [
        {
          name: "/help",
          type: ActivityType.Listening,
        },
      ],
    });
  }
}
