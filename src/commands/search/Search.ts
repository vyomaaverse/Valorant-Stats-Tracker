import {
  bold,
  CacheType,
  ChatInputCommandInteraction,
  codeBlock,
  SlashCommandBuilder,
} from "discord.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { ClientInterface } from "../../utils/interfaces/ClientInterface.js";
import { CommandInterface } from "../../utils/interfaces/CommandInterface.js";
import { SearchApexLegendResponse } from "../../utils/typings/SearchResponse.js";

export class Search implements CommandInterface {
  name = "search";
  category = "games";
  data = new SlashCommandBuilder()
    .setName("search")
    .setDescription("search player stats")
    .addStringOption((input) =>
      input
        .setName("game")
        .setDescription("Game you want to search for")
        .setRequired(true)
        .addChoices({
          name: "Apex Legends",
          value: "apex",
        })
    )
    .addStringOption((input) =>
      input
        .setName("platform")
        .setDescription("Gaming platform")
        .setRequired(true)
        .addChoices(
          { name: "Origin", value: "origin" },
          { name: "Xbox Live Gamertag", value: "xbl" },
          { name: "Playstation Network", value: "psn" }
        )
    )
    .addStringOption((input) =>
      input.setName("id").setDescription("Platform Id").setRequired(true)
    );

  async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
    client: ClientInterface
  ) {
    try {
      const selectedOptions = {
        platform: interaction.options.get("platform", true),
        id: interaction.options.get("id", true),
      };

      const link = client.utils.resolveApexStatsLink(
        selectedOptions.platform.value as string,
        selectedOptions.id.value as string
      );

      const playerData = await this.fetchApexProfile(link, client);

      const resolvedData = this.resolvePlayerData(playerData, client);

      const embed = createEmbed({
        author: {
          name: `${
            resolvedData.platform.userHandle
          } | ${client.utils.convertToPascalCase(resolvedData.platform.name)}`,
          iconURL: resolvedData.platform.avatarUrl,
        },
        color: "#CD3333",
        thumbnail: {
          url: "https://cdn.discordapp.com/attachments/1031053322523791390/1031091168882212864/logo-apex-legends-4.webp",
        },
        footer: {
          iconURL:
            "https://cdn.discordapp.com/attachments/1031053322523791390/1031116739523657728/TRN-Logo_full-color.png",
          text: "Information Provided by tracker.gg",
        },
        timestamp: true,
      });

      embed.addFields([
        {
          name: "General Information",
          value: bold(
            codeBlock(
              `➥ User Id :- ${resolvedData.userInfo.userId}\n➥ Premium Member :- ${resolvedData.userInfo.isPremium}\n➥ Verified Member :- ${resolvedData.userInfo.isVerified}\n➥ Suspicious Member :- ${resolvedData.userInfo.isSuspicious}`
            )
          ),
        },
        {
          name: "Season & Legend",
          value: bold(
            codeBlock(
              `➥ Current Season :- ${resolvedData.metadata.currentSeason}\n➥ Active Legend :- ${resolvedData.metadata.activeLegendName}\n➥ Active Ban :- ${resolvedData.metadata.isGameBanned}`
            )
          ),
        },
      ]);

      resolvedData.segments.forEach((segment) => {
        const statsArray = segment.stats
          .map((e) => {
            if (e.metadata.rankName) {
              return `➥ ${e.name} :- ${e.value} | ${e.metadata?.rankName}`;
            } else {
              return `➥ ${e.name} :- ${e.value}`;
            }
          })
          .join("\n");

        embed.addFields({
          name: segment.type,
          value: bold(
            codeBlock(`➥ Name :- ${segment.metadata.name}\n${statsArray}`)
          ),
        });
      });

      interaction.editReply({
        content: "Here is your data",
        embeds: [embed],
      });
    } catch (error) {
      throw error;
    }
  }

  resolvePlayerData(
    playerData: SearchApexLegendResponse,
    client: ClientInterface
  ) {
    let data: ApexMainData = {
      platform: {
        name: "",
        userId: "",
        userHandle: "",
        avatarUrl: "",
      },
      userInfo: {
        userId: "",
        isPremium: "",
        isVerified: "",
        customAvatarUrl: "",
        customHeroUrl: "",
        isSuspicious: "",
      },
      metadata: {
        currentSeason: 0,
        activeLegendName: "",
        isGameBanned: "",
      },
      segments: [],
    };

    data.platform = {
      name: client.utils.convertToPascalCase(
        playerData.data.platformInfo.platformSlug
      ),
      userId: playerData.data.platformInfo.platformUserHandle,
      userHandle: playerData.data.platformInfo.platformUserHandle,
      avatarUrl: playerData.data.platformInfo.avatarUrl,
    };

    data.userInfo = {
      userId: playerData.data.userInfo.userId
        ? playerData.data.userInfo.userId
        : "Not Found",
      isPremium: playerData.data.userInfo.isPremium ? "Yes" : "No",
      isVerified: playerData.data.userInfo.isPremium ? "Yes" : "No",
      customAvatarUrl: playerData.data.userInfo.customAvatarUrl
        ? playerData.data.userInfo.customAvatarUrl
        : "Not Found",
      customHeroUrl: playerData.data.userInfo.customHeroUrl
        ? playerData.data.userInfo.customHeroUrl
        : "Not Found",
      isSuspicious: playerData.data.userInfo.isPremium ? "Yes" : "No",
    };

    data.metadata = {
      currentSeason: playerData.data.metadata.currentSeason,
      activeLegendName: playerData.data.metadata.activeLegendName,
      isGameBanned: playerData.data.metadata.isGameBanned ? "Yes" : "No",
    };

    data.segments = playerData.data.segments.map((s) => {
      let e: ApexSegmentsData = {
        type: "",
        metadata: {
          name: "",
          imageUrl: "",
          tallImageUrl: "",
          bgImageUrl: "",
          portraitImageUrl: "",
          legendColor: "",
          isActive: "",
        },
        stats: [],
      };
      e.type = client.utils.convertToPascalCase(s.type);

      e.metadata = {
        name: s.metadata.name,
        imageUrl: s.metadata.imageUrl ? s.metadata.imageUrl : undefined,
        tallImageUrl: s.metadata.tallImageUrl
          ? s.metadata.tallImageUrl
          : "Not Found",
        bgImageUrl: s.metadata.bgImageUrl ? s.metadata.bgImageUrl : "Not Found",
        portraitImageUrl: s.metadata.portraitImageUrl
          ? s.metadata.portraitImageUrl
          : "Not Found",
        legendColor: s.metadata.legendColor
          ? s.metadata.legendColor
          : "Not Found",
        isActive: s.metadata.isActive ? "Yes" : "No",
      };

      e.stats = Object.entries(s.stats).map((stat) => {
        return {
          name: stat[1].displayName,
          value: stat[1].value,
          metadata: {
            rankName: stat[1].metadata ? stat[1].metadata.rankName : undefined,
          },
        };
      });

      return e;
    });

    return data;
  }

  async fetchApexProfile(link: string, client: ClientInterface) {
    try {
      const response = await client.config.fetch(link, {
        method: "GET",
        headers: {
          "TRN-Api-Key": client.config.trackerggApiKey,
        },
      });

      /**
       * @todo add promise.race with requestTimeout method
       */

      if (response.status === 404) {
        throw new Error("Player not found");
      }

      const json = (await response.json()) as SearchApexLegendResponse;

      return json;
    } catch (error) {
      throw error;
    }
  }
}
