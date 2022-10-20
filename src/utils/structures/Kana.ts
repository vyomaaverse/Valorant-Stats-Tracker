import { Client, Collection } from "discord.js";
import { resolve } from "node:path";
import { CustomLogger } from "./Logger.js";
import { Config } from "../../config/index.js";
import { Utils } from "../functions/index.js";
import { CommandInterface } from "../interfaces/CommandInterface.js";
import { CommandLoader } from "./CommandLoader.js";
import { EventLoader } from "./EventLoader.js";

export class Kana extends Client {
  public readonly events: EventLoader = new EventLoader(
    this,
    resolve("dist", "events")
  );
  public readonly commandLoader: CommandLoader = new CommandLoader(
    this,
    "commands"
  );
  public commands: Collection<string, CommandInterface>;
  public config: Config = new Config(this);
  public utils: Utils = new Utils();
  public logger: CustomLogger = new CustomLogger("logs");

  public constructor() {
    super({
      intents: ["GuildMessages", "Guilds"],
    });
    this.commands = new Collection<string, CommandInterface>();
  }

  public async start() {
    try {
      this.config.init();
      await this.commandLoader.load();
      await this.events.load();
      this.login(this.config.token);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.log("error", "", error);
      }
    }
  }
}
