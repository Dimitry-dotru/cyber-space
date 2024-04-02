"use client"
import React from 'react';

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

const getUser = (sessionID: string, setSteamUser: (arg: userObj | null) => void) => {
  fetch("http://localhost:7069" + "/?sessionID=" + sessionID).then(d => {
    if (!d.ok) {
      throw new Error("User not found!");
    }
    return d.json();
  })
    .then((d: userObj) => {
      setSteamUser(d);
    }).catch((reason) => {
      console.log(reason);
    })
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
        {!steamUser && <a className="btn-secondary" href="http://localhost:7069/api/auth/steam">Login</a>}

        {steamUser && <div className="user-profile">
          <img src={steamUser.avatarmedium} alt="steam profile photo" />
          <h3>{steamUser.personaname}</h3>
        </div>}

      </div>
    </main>
  );
}
