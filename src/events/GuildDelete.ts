import {
  codeBlock,
  Events,
  Guild,
  TextBasedChannel,
  TextChannel,
} from "discord.js";
import { createEmbed } from "../utils/functions/createEmbed.js";
import { ClientInterface } from "../utils/interfaces/ClientInterface.js";
import { EventInterface } from "../utils/interfaces/EventInterface.js";

export class GuildDelete implements EventInterface {
  name: Events = Events.GuildDelete;
  public async execute(client: ClientInterface, ...args: any) {
    try {
      const guild = args[0] as Guild;

      if (client.config.logsChannelId) {
        const mainGuildObject = await client.guilds.fetch(
          client.config.guildId
        );

        if (!mainGuildObject) {
          throw new Error("Main guild not found");
        }

        mainGuildObject.channels
          .fetch(client.config.logsChannelId, { cache: true, force: true })
          .then((channel) => {
            const embed = createEmbed({
              color: "Red",
              author: {
                iconURL: client.user?.avatarURL({ size: 128 })!,
                name: `${client.user?.username} | Guild Left`,
              },
              thumbnail: {
                url: guild.iconURL({ size: 128 })!,
              },
              description: codeBlock(
                `Name :- ${guild.name}\nMembers :- ${guild.memberCount}`
              ),
              timestamp: true,
            });
            const e = channel as TextChannel;
            e.send({
              embeds: [embed],
            });
          })
          .catch(() => {
            client.logger.log("error", "", new Error("Log Channel not Found"));
          });
      }

      client.logger.log("info", `Guild Left ${guild.name} (${guild.id})`);
    } catch (error) {
      if (error instanceof Error) {
        client.logger.log("error", "", error);
      }
    }
  }
}
