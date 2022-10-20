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
          `Hello there 👋, I am ${client.user?.username} a bot for tracking player stats.\n\nMy Primary function is to fetch user profile and stats for games like Valorant, Apex Legends, csgo and more and display them in nice embeds (currently only apex legends is available).`
        )
      )}\nDeveloper :- risenfromtheashes#3783\nLinks: - ${hyperlink(
        "Register your profile for tracking",
        "https://tracker.gg/valorant"
      )}`,
      timestamp: true,
    });
    interaction.editReply({
      embeds: [embed],
    });
  }
}
