import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { ClientInterface } from "./ClientInterface.js";

export interface CommandInterface {
  name: string;
  category: string;
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (
    interaction: ChatInputCommandInteraction,
    client: ClientInterface
  ) => Promise<void>;
}
