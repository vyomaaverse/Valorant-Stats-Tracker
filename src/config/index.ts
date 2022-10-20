import fetch from "node-fetch";
import { ClientInterface } from "../utils/interfaces/ClientInterface";

export class Config {
  fetch = fetch;
  public token: string = "";
  public trackerggApiKey: string = "";
  public guildId: string = "";
  public applicationId: string = "";
  public logsChannelId: string | null = null;

  public constructor(private client: ClientInterface) {}

  private loadEnvVariables() {
    if (!process.env.BOT_TOKEN)
      throw new Error(
        "Bot token is missing, did you forget to set it as env variable?"
      );
    if (!process.env.TRACKERGG_API_KEY)
      throw new Error(
        "Trackergg API key is missing, did you forget to set it as env variable?"
      );

    if (!process.env.APPLICATION_ID)
      throw new Error(
        "Application Id is missing, did you forget to set it as env variable?"
      );

    if (process.env.NODE_ENV === "development") {
      if (!process.env.GUILD_ID)
        throw new Error(
          "Guild Id is missing, did you forget to set it as env variable?"
        );
      this.guildId = process.env.GUILD_ID;
    }

    if (process.env.LOGS_CHANNEL_ID) {
      this.logsChannelId = process.env.LOGS_CHANNEL_ID;
    } else {
      this.client.logger.log(
        "warn",
        `Logs Channel Id not Found, Disabling Guild Join and Leave Logging`
      );
    }

    this.token = process.env.BOT_TOKEN;
    this.trackerggApiKey = process.env.TRACKERGG_API_KEY;
    this.applicationId = process.env.APPLICATION_ID;
  }

  public init() {
    this.client.logger.log("info", "Loading ENV Variables");
    this.loadEnvVariables();
  }
}
