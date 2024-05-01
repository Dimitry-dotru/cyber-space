import { userObj } from "../types/steamTypes";

const getUser = async (
  sessionID: string
) => {
  const data = await fetch(process.env.backendAddress + "/?sessionID=" + sessionID);

  if (!data.ok) return null;

  const user: userObj = await data.json();
  return user;
};


const getUsers = (
  steamids: string[],
  setUsers: (arg: userObj[] | null) => void
) => {
  fetch(
    `${process.env.backendAddress}/steam/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.apiKey}&steamids=${steamids.join(
      ","
    )}`
  )
    .then((d) => d.json())
    .then((d) => {
      const usersObj = d.response.players as userObj[];
      setUsers(usersObj);
    });
};

export {getUser, getUsers};