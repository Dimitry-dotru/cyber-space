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

export type gameObj = {
  appid: number;
  playtime_deck_forever: number;
  playtime_disconnected: number;
  playtime_forever: number;
  playtime_linux_forever: number;
  playtime_mac_forever: number;
  playtime_windows_forever: number;
  rtime_last_played: number;
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
