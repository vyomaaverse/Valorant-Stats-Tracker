import { Client, Collection } from "discord.js";
import { Config } from "../../config/index.js";
import { Utils } from "../functions/index.js";
import { CustomLogger } from "../structures/Logger.js";
import { CommandInterface } from "./CommandInterface.js";

type commands = {
  utils: Utils;
  config: Config;
  commands: Collection<string, CommandInterface>;
  logger: CustomLogger;
};

export interface ClientInterface extends Client, commands {}
