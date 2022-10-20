import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType,
  bold,
  codeBlock,
  hyperlink,
} from "discord.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { ClientInterface } from "../../utils/interfaces/ClientInterface.js";
import { CommandInterface } from "../../utils/interfaces/CommandInterface.js";

export class About implements CommandInterface {
  name = "about";
  category = "info";
  data = new SlashCommandBuilder()
    .setName("about")
    .setDescription("info about bot");
  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    client: ClientInterface
  ) {
    const embed = createEmbed({
      author: {
        iconURL: client.user?.avatarURL({ size: 128 })!,
        name: client.user?.username!,
      },
      color: "#6ad8ef",
      title: "About me",
      description: `${bold(
        codeBlock(
          `Hello there 👋, I am ${client.user?.username} a bot created for hacktoberfest week 2 challenge organised by Spookcord.\n\nMy Primary function is to fetch user profile and stats for games like apex legends, csgo..etc and display them in nice embeds (currently only apex legends game is available).`
        )
      )}\nDeveloper :- Godofwar!OP#8032\nLinks: - ${hyperlink(
        "Spookcord Website",
        "https://spookcord.me/"
      )}`,
      timestamp: true,
    });
    interaction.editReply({
      embeds: [embed],
    });
  }
}
