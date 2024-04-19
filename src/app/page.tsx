"use client"
import React from 'react';
import Image from 'next/image';
import imgErrorPic from "../../public/img/error-img/unknown_game.jpg";

// move it to .env.local
const apiKey = "BDE51B80D4D4E0257B60610C0B3FE6F6";
const backendAddress = "http://localhost:7069";

interface userObj {
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
}

interface friendObj {
  friend_since: number;
  relationship: string;
  steamid: string;
}

interface gameObj {
  appid: number;
  img_icon_url: string;
  name: string;
  playtime_2weeks: number;
  playtime_deck_forever: number;
  playtime_forever: number;
  playtime_linux_forever: number;
  playtime_mac_forever: number;
  playtime_windows_forever: number;
}

const getUser = (sessionID: string, setSteamUser?: (arg: userObj | null) => void) => {
  fetch(backendAddress + "/?sessionID=" + sessionID).then(d => {
    if (!d.ok) {
      setSteamUser ? setSteamUser(null) : null;
      throw new Error("User not found!");
    }
    return d.json();
  })
    .then((d: userObj) => {
      if (setSteamUser) setSteamUser(d);
      console.log(d);
    }).catch((reason) => {
      console.log(reason);
    })
}

const logoutHandler = (setSteamUser: (arg: userObj | null) => void) => {
  const sessionID = window.localStorage.getItem("sessionID");
  if (!sessionID) return;
  fetch(`http://localhost:7069/logout/?sessionID=${sessionID}`, { method: "post" }).then(d => {
    if (!d.ok) {
      throw new Error("Error with logout!");
    }
    window.localStorage.removeItem("sessionID");
    setSteamUser(null);
    return d.text();
  })
    .then(d => console.log(d));
}

const getUsers = (steamids: string[], setUsers: (arg: userObj[] | null) => void) => {
  fetch(`${backendAddress}/steam/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamids.join(",")}`).then(d => d.json())
    .then(d => {
      const usersObj = d.response.players as userObj[];
      setUsers(usersObj);
    })
}

const FriendsList: React.FC<{ steamUser: userObj }> = ({
  steamUser
}) => {
  const [userFriends, setUserFriends] = React.useState<userObj[] | null>(null);

  React.useEffect(() => {
    fetch(`${backendAddress}/steam/ISteamUser/GetFriendList/v0001/?key=${apiKey}&steamid=${steamUser.steamid}&relationship=friend`)
      .then(d => d.json())
      .then(d => {
        const friendsList = d.friendslist.friends as friendObj[];
        getUsers(friendsList.map(el => el.steamid), setUserFriends);
      })
  }, []);

  return <>
    {userFriends && <div className="friends-list">
      {userFriends.map((el, idx) => {
        return <div className="friends-list-item">
          <img src={el.avatarfull} alt="friend's avatar" />
          <h3>{el.personaname}</h3>
        </div>;
      })}
    </div>}
  </>;
}

const GamesList: React.FC<{ steamUser: userObj }> = ({
  steamUser
}) => {
  const [userGames, setUserGames] = React.useState<gameObj[] | null>(null);

  React.useEffect(() => {
    fetch(`${backendAddress}/steam/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamUser.steamid}&format=json`)
      .then(d => d.json())
      .then(d => {
        const recentlyGamesList = d.response.games as gameObj[];
        console.log(recentlyGamesList);
        setUserGames(recentlyGamesList);
      })
  }, []);

  return <>
    {userGames && <div className="games-list">
      {userGames.map((el, idx) => {
        const link = el.img_icon_url !== "" ? `https://media.steampowered.com/steamcommunity/public/images/apps/${el.appid}/${el.img_icon_url}.jpg` : imgErrorPic;
        return <div className="games-list-item">
          <Image width={50} height={50} src={link} alt="game icon" />
          <h3>{el.name}</h3>
        </div>
      })}
    </div>}
  </>;
}

export default function Home() {

  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionID = params.get("sessionID") ? params.get("sessionID") : window.localStorage.getItem("sessionID");

    if (!sessionID) return;
    const url = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, url);

    getUser(sessionID, setSteamUser);

    window.localStorage.setItem("sessionID", sessionID);

  }, []);

  return (
    <main>
      <div className="testing-block">
        {!steamUser && <a className="btn-secondary" href={`${backendAddress}/api/auth/steam`}>Login</a>}

        {steamUser && <>
          <div className="user-info">
            <div className="user-profile">
              <img src={steamUser.avatarmedium} alt="steam profile photo" />
              <h3>{steamUser.personaname}</h3>
            </div>
            <button className="btn-secondary" onClick={() => logoutHandler(setSteamUser)}>Logout</button>

          </div>
          <div className="lists">
            <FriendsList steamUser={steamUser} />
            <GamesList steamUser={steamUser} />
          </div>

        </>}
      </div>

    </main>
  );
}
