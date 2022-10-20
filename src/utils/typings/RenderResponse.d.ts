type ApexMainData = {
  platform: {
    name: string;
    userId: string;
    userHandle: string;
    avatarUrl: string;
  };
  userInfo: {
    userId: string | number;
    isPremium: string;
    isVerified: string;
    customAvatarUrl: string;
    customHeroUrl: string;
    isSuspicious: string;
  };
  metadata: {
    currentSeason: number;
    activeLegendName: string;
    isGameBanned: string;
  };
  segments: {
    type: string;
    metadata: {
      name: string;
      imageUrl: string | undefined;
      tallImageUrl: string;
      bgImageUrl: string;
      portraitImageUrl: string;
      legendColor: string;
      isActive: string;
    };
    stats: {
      name: string;
      value: number;
      metadata: {
        rankName: string | undefined;
      };
    }[];
  }[];
};

type ApexSegmentsData = {
  type: string;
  metadata: {
    name: string;
    imageUrl: string | undefined;
    tallImageUrl: string;
    bgImageUrl: string;
    portraitImageUrl: string;
    legendColor: string;
    isActive: string;
  };
  stats: {
    name: string;
    value: number;
    metadata: {
      rankName: string | undefined;
    };
  }[];
};
