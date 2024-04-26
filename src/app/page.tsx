"use client"
import React from 'react';
import Image from 'next/image';
import imgErrorPic from "../../public/img/error-img/unknown_game.jpg";

import { userObj } from '../utils/types/steamTypes';
import { getUser } from '../utils/functions/steamRequests';
import { getSessionId } from '../utils/functions/authorization';

import Header from '@/components/Header';
import FriendsList from '@/components/FriendsList';

// const FriendsList: React.FC<{ steamUser: userObj }> = ({
//   steamUser
// }) => {
//   const [userFriends, setUserFriends] = React.useState<userObj[] | null>(null);

//   React.useEffect(() => {
//     fetch(`${process.env.backendAddress}/steam/ISteamUser/GetFriendList/v0001/?key=${process.env.apiKey}&steamid=${steamUser.steamid}&relationship=friend`)
//       .then(d => d.json())
//       .then(d => {
//         const friendsList = d.friendslist.friends as friendObj[];
//         getUsers(friendsList.map(el => el.steamid), setUserFriends);
//       })
//   }, []);

//   return <>
//     {userFriends && <div className="friends-list">
//       {userFriends.map((el, idx) => {
//         return <div className="friends-list-item">
//           <img src={el.avatarfull} alt="friend's avatar" />
//           <h3>{el.personaname}</h3>
//         </div>;
//       })}
//     </div>}
//   </>;
// }

// const GamesList: React.FC<{ steamUser: userObj }> = ({
//   steamUser
// }) => {
//   const [userGames, setUserGames] = React.useState<gameObj[] | null>(null);

//   React.useEffect(() => {
//     fetch(`${process.env.backendAddress}/steam/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.apiKey}&steamid=${steamUser.steamid}&format=json`)
//       .then(d => d.json())
//       .then(d => {
//         const recentlyGamesList = d.response.games as gameObj[];
//         console.log(recentlyGamesList);
//         setUserGames(recentlyGamesList);
//       })
//   }, []);

//   return <>
//     {userGames && <div className="games-list">
//       {userGames.map((el, idx) => {
//         const link = el.img_icon_url !== "" ? `https://media.steampowered.com/steamcommunity/public/images/apps/${el.appid}/${el.img_icon_url}.jpg` : imgErrorPic;
//         return <div className="games-list-item">
//           <Image width={50} height={50} src={link} alt="game icon" />
//           <h3>{el.name}</h3>
//         </div>
//       })}
//     </div>}
//   </>;
// }

export default function Home() {
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);

  React.useEffect(() => {
    const asyncFunc = async (
      sessionID: string,
      setSteamUser: (arg: userObj | null) => void
    ) => {
      const data = await getUser(sessionID);
      setSteamUser(data);
      if (!data) {
        window.localStorage.clear();
        window.location.reload();
        return;
      }
      window.localStorage.setItem("sessionID", sessionID);
    }

    const sessionID = getSessionId();
    if (!sessionID) return;
    asyncFunc(sessionID, setSteamUser);
  }, []);

  return (
    <>
      <Header steamUser={steamUser} setSteamUser={setSteamUser} />
      <main>
        <div className="testing-block">


        </div>

        <aside>
          <FriendsList steamUser={steamUser} />
        </aside>
      </main>
    </>
  );
}
