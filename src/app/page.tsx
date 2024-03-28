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

export default function Home() {

  const [steamId, setSteamId] = React.useState<string | null>(null);
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);

  React.useEffect(() => {
    // Получаем SteamID из адресной строки
    const params = new URLSearchParams(window.location.search);
    const steamIdFromUrl = params.get("steamId");

    // Если SteamID есть в адресной строке, сохраняем его в состоянии и убираем из адресной строки
    if (steamIdFromUrl) {
      // setSteamId(steamIdFromUrl);
      const urlWithoutSteamId = window.location.href.split("?")[0];
      window.history.replaceState({}, document.title, urlWithoutSteamId);
      window.localStorage.setItem("steamId", steamIdFromUrl);
      setSteamId(steamIdFromUrl);

      const steamKey = "BDE51B80D4D4E0257B60610C0B3FE6F6";
      fetch(
        `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=${steamIdFromUrl}`
      )
        .then((d) => d.json())
        .then((d) => {
          setSteamUser(d.response.players[0]);
          console.log(d.response.players[0]);
        });
    }
  }, []);

  return (
    <main>
      <div className="testing-block">
        {!steamId && <>
          <h1>Steam auth</h1>
          <a href="http://localhost:7069/api/auth/steam" rel="noopener noreferrer" className="btn-secondary">Login with steam</a>
        </>}

        {steamUser && <>
          <h3 className="login-header">
            Welcome <span>{steamUser.personaname} <img width={50} height={50} src={steamUser.avatarfull} /></span>
          </h3>
        </>}
      </div>
    </main>
  );
}
