import { ChatInputCommandInteraction, Events } from "discord.js";
import { ClientInterface } from "../utils/interfaces/ClientInterface.js";
import { EventInterface } from "../utils/interfaces/EventInterface.js";

export class InteractionCreate implements EventInterface {
  public name = Events.InteractionCreate;
  public async execute(client: ClientInterface, ...args: any[]) {
    const interaction = args[0] as ChatInputCommandInteraction;

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      interaction.reply({
        ephemeral: true,
        isMessage: true,
        content: "🛑 Command not found",
      });
      return;
    }

    try {
      client.logger.log(
        "info",
        `${interaction.user.username}(${interaction.user.id}) ran ${interaction.commandName} in (${interaction.guild?.id}) guild`
      );

      await interaction.deferReply();

      await command.execute(interaction, client);
    } catch (error) {
      if (error instanceof Error) {
        client.logger.log("error", "", error);
        interaction.editReply({
          content: `🛑 ${error.message}`,
        });
      } else {
        interaction.editReply({
          content:
            "🛑 There was an error while executing this command. Please try again later!",
        });
      }
    }
  }
}
