export type SearchApexLegendResponse = {
  data: {
    platformInfo: {
      platformSlug: string;
      platformUserId: string;
      platformUserHandle: string;
      platformUserIdentifier: string;
      avatarUrl: string;
    };
    userInfo: {
      userId: number | null;
      isPremium: boolean;
      isVerified: boolean;
      isInfluencer: boolean;
      isPartner: boolean;
      countryCode: string | null;
      customAvatarUrl: string | null;
      customHeroUrl: string | null;
      socialAccounts: [];
      pageviews: number;
      isSuspicious: boolean | null;
    };
    metadata: {
      currentSeason: number;
      activeLegend: string;
      activeLegendName: string;
      activeLegendStats: string[];
      isGameBanned: boolean;
    };
    segments: Segment[];
  };
};

type Segment = {
  type: string;
  metadata: {
    name: string;
    imageUrl: string | undefined;
    tallImageUrl: string | undefined;
    bgImageUrl: string | undefined;
    portraitImageUrl: string | undefined;
    legendColor: string | undefined;
    isActive: boolean;
  };
  stats: {
    [name: string]: Stats;
  };
};

type Stats = {
  rank: number;
  percentile: number;
  displayName: string;
  displayCategory: string;
  category: null;
  metadata:
    | {
        iconUrl: string;
        rankName: string;
      }
    | undefined;
  value: number;
  displayValue: string;
  displayType: string;
};
