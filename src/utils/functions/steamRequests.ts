import {
  userObj,
  achievementsForGame,
  countendAchievementsProps,
  gameObj,
  friendObj,
} from "../types/steamTypes";

const getUser = async (sessionID: string) => {
  const data = await fetch(
    process.env.backendAddress + "/?sessionID=" + sessionID
  );

  if (!data.ok) return null;

  const user: userObj = await data.json();
  return user;
};

const getUserFromDb = async (steamid: number) => {
  const data = await fetch(`${process.env.backendAddress}/user/${steamid}`);

  if (!data.ok) {
    return null;
  }

  const user: userObj = (await data.json()).user;

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

const getAchievementsInfo = async (
  steamid: string,
  game: gameObj,
  hiddenAchievements: boolean
) => {
  const gameAchivementsInfo: countendAchievementsProps = {
    totalAchievements: 0,
    completed: 0,
    gameName: game.name,
    completePercentage: 0,
    hasAchievements: !!game.has_community_visible_stats,
  };

  if (!gameAchivementsInfo.hasAchievements || hiddenAchievements) return null;

  const data = await fetch(
    `${process.env.backendAddress}/steam/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${game.appid}&key=${process.env.apiKey}&steamid=${steamid}`
  );

  if (!data.ok) return null;

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

const getFriendsList = async (
  steamid: string,
  setFriendList: (arg: undefined | null | friendObj[]) => void
) => {
  const backendAddress = process.env.backendAddress;
  const sessionID = global.window.localStorage.getItem("sessionID");

  if (!sessionID) {
    console.error("Error with session id");
    return;
  }

  const jsonRequest = await fetch(
    `${backendAddress}/user/friends/${steamid}?sessionID=${sessionID}`
  );

  if (!jsonRequest.ok) {
    console.log(jsonRequest);
    return;
  }

  const friends = await jsonRequest.json() as friendObj[];


  // sort by alphabet...
  friends.sort((a, b) => {
    const nameA = a.personaname.toUpperCase();
    const nameB = b.personaname.toUpperCase();

    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  });

  setFriendList(friends);
};

export {
  getUser,
  getUsers,
  getAchievementsInfo,
  getUserFromDb,
  getFriendsList,
};
