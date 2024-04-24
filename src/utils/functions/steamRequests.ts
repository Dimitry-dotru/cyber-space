import { userObj } from "../types/steamTypes";

const getUser = async (
  sessionID: string
) => {
  const data = await fetch(process.env.backendAddress + "/?sessionID=" + sessionID);

  if (!data.ok) return null;

  const user: userObj = await data.json();

  return user;

  // fetch(process.env.backendAddress + "/?sessionID=" + sessionID)
  //   .then((d) => {
  //     if (!d.ok) {
  //       setSteamUser ? setSteamUser(null) : null;
  //       throw new Error("User not found!");
  //     }
  //     return d.json();
  //   })
  //   .then((d: userObj) => {
  //     if (setSteamUser) setSteamUser(d);
  //     return d as userObj;
  //     // console.log(d);
  //   })
  //   .catch((reason) => {
  //     console.log(reason);
  //     return null;
  //   });
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