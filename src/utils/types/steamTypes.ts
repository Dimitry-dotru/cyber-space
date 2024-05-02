export type userObj = {
  avatar: string;
  avatarfull: string;
  avatarhash: string;
  avatarmedium: string;
  communityvisibilitystate: number;
  lastlogoff: number;
  loccountrycode: string;
  locstatecode: string;
  personaname: string;
  personastate: number;
  personastateflags: number;
  primaryclanid: string;
  profilestate: number;
  profileurl: string;
  steamid: string;
  timecreated: number;

  // my custom fields:
  userbanner: string;
  userbgpattern: string;
};

export type friendObj = {
  friend_since: number;
  relationship: string;
  steamid: string;
};

// if in params exists this param: include_appinfo=true
export type gameObj = {
  appid: number;
  has_community_visible_stats: boolean;
  img_icon_url: string;
  name: string;
  playtime_deck_forever: number;
  playtime_disconnected: number;
  playtime_forever: number; // in minutes, total played time
  playtime_linux_forever: number;
  playtime_mac_forever: number;
  playtime_windows_forever: number;
  rtime_last_played: number;
};

export type countendAchievementsProps = {
  totalAchievements: number;
  completed: number;
  gameName: string;
  completePercentage: number;
  hasAchievements: boolean;
};

export type achievementsForGame = {
  steamID: string;
  gameName: string;
  achievements: {
    apiname: string;
    achieved: 0 | 1;
    unlocktime: number;
  }[];
  success: boolean;
};
