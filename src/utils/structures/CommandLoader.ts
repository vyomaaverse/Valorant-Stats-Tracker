import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { readdirSync } from "node:fs";
import { resolve, parse } from "node:path";
import { CommandInterface } from "../interfaces/CommandInterface.js";
import { ClientInterface } from "../interfaces/ClientInterface.js";

export class CommandLoader {
  private globalCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
    [];
  public constructor(
    public client: ClientInterface,
    private commandsPath: string
  ) {}

  public async load() {
    this.client.logger.log("info", "Loading commands");
    const subFolders = readdirSync(resolve("dist", this.commandsPath));

    if (!subFolders) throw new Error("No commands folder found!");

    this.client.logger.log("info", `Found ${subFolders.length} subfolders`);
    for (const folder of subFolders) {
      this.client.logger.log("info", `Reading ${folder} folder`);
      const files = readdirSync(
        resolve("dist", this.commandsPath, folder)
      ).filter((file) => file.endsWith(".js"));

      if (!files) throw new Error("No files found!");

      this.client.logger.log(
        "info",
        `Found ${files.length} files inside ${folder} folder`
      );
      for (const file of files) {
        const importedFile = await import(
          resolve("dist", "commands", folder, file)
        );

        const importedClass =
          importedFile[parse(resolve("dist", "commands", folder, file)).name];

        const object = new importedClass() as CommandInterface;

        this.client.logger.log("info", `loaded ${object.name} command`);
        this.client.commands.set(object.name, object);

        this.globalCommands.push(object.data.toJSON());
      }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);
    if (process.env.NODE_ENV === "development") {
      this.client.logger.log("info", "Registering command as guild commands");
      rest
        .put(
          Routes.applicationGuildCommands(
            this.client.config.applicationId,
            this.client.config.guildId
          ),
          {
            body: this.globalCommands,
          }
        )
        .then(() => {
          this.client.logger.log(
            "info",
            "Successfully registed guild commands"
          );
        })
        .catch((error) => {
          throw error;
        });
    } else {
      this.client.logger.log("info", "Registering command as global commands");

      rest
        .put(Routes.applicationCommands(this.client.config.applicationId), {
          body: this.globalCommands,
        })
        .then(() => {
          this.client.logger.log(
            "info",
            "Successfully registed global commands"
          );
        })
        .catch((error) => {
          throw error;
        });
    }
  }
}
