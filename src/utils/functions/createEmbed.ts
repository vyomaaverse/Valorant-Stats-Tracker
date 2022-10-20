import { EmbedBuilder, EmbedImageData } from "@discordjs/builders";
import {
  ColorResolvable,
  EmbedAuthorData,
  EmbedField,
  EmbedFooterData,
  resolveColor,
} from "discord.js";

export function createEmbed(data: {
  author?: EmbedAuthorData | null;
  title?: string | null;
  description?: string | null;
  url?: string | null;
  color?: ColorResolvable;
  fields?: EmbedField[] | null;
  image?: EmbedImageData | null;
  thumbnail?: EmbedImageData | null;
  footer?: EmbedFooterData | null;
  timestamp?: boolean;
}): EmbedBuilder {
  const embed = new EmbedBuilder();

  if (data.author) embed.setAuthor(data.author);
  if (data.title) embed.setTitle(data.title);
  if (data.description) embed.setDescription(data.description);
  if (data.url) embed.setURL(data.url);
  if (data.color) embed.setColor(resolveColor(data.color));
  if (data.fields && data.fields.length > 0) embed.setFields(data.fields);
  if (data.image) embed.setImage(data.image.url);
  if (data.thumbnail) embed.setThumbnail(data.thumbnail.url);
  if (data.footer) embed.setFooter(data.footer);
  if (data.timestamp) embed.setTimestamp();

  return embed;
}
