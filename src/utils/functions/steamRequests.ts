import {
  userObj,
  achievementsForGame,
  countendAchievementsProps,
  gameObj,
} from "../types/steamTypes";

const getUser = async (sessionID: string) => {
  const data = await fetch(
    process.env.backendAddress + "/?sessionID=" + sessionID
  );

  if (!data.ok) return null;

  const user: userObj = await data.json();
  return user;
};

const getUsers = (
  steamids: string[],
  setUsers: (arg: userObj[] | null) => void
) => {
  fetch(
    `${
      process.env.backendAddress
    }/steam/ISteamUser/GetPlayerSummaries/v0002/?key=${
      process.env.apiKey
    }&steamids=${steamids.join(",")}`
  )
    .then((d) => d.json())
    .then((d) => {
      const usersObj = d.response.players as userObj[];
      setUsers(usersObj);
    });
};

const getAchievementsInfo = async (steamid: string, game: gameObj) => {
  const gameAchivementsInfo: countendAchievementsProps = {
    totalAchievements: 0,
    completed: 0,
    gameName: game.name,
    completePercentage: 0,
    hasAchievements: !!game.has_community_visible_stats,
  };

  if (!gameAchivementsInfo.hasAchievements) return null;

  const data = await fetch(
    `${process.env.backendAddress}/steam/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${game.appid}&key=${process.env.apiKey}&steamid=${steamid}`
  );

  const gamesAchievements = (await data.json())
    .playerstats as achievementsForGame;

  if (!gamesAchievements.achievements && !gamesAchievements.success) {
    return null;
  }

  if (!gamesAchievements.achievements) {
    gameAchivementsInfo.hasAchievements = false;

    return gameAchivementsInfo;
  }
  gamesAchievements.achievements.forEach((el) =>
    el.achieved ? (gameAchivementsInfo.completed += 1) : null
  );
  gameAchivementsInfo.totalAchievements = gamesAchievements.achievements.length;
  gameAchivementsInfo.gameName = gamesAchievements.gameName;

  gameAchivementsInfo.completePercentage = Math.ceil(
    (gameAchivementsInfo.completed / gameAchivementsInfo.totalAchievements) *
      100
  );

  return gameAchivementsInfo;
};

export { getUser, getUsers, getAchievementsInfo };
