"use client"
import React from 'react';
import Image from 'next/image';
import imgErrorPic from "../../public/img/error-img/unknown_game.jpg";

import { userObj } from '../utils/types/steamTypes';
import { getUser } from '../utils/functions/steamRequests';
import { getSessionId } from '../utils/functions/authorization';

import Header from '@/components/Header';
import FriendsList from '@/components/FriendsList';
import GamesList from '@/components/GamesList';
import UserBanner from '@/components/UserBanner';


export default function Home() {
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);

  React.useEffect(() => {
    const asyncFunc = async (
      sessionID: string | null,
      setSteamUser: (arg: userObj | null) => void
    ) => {
      if (!sessionID) return;
      const data = await getUser(sessionID);
      setSteamUser(data);
      if (data) {
        document.body.style.backgroundImage = `url(${data.userbgpattern})`;
      }
      window.localStorage.setItem("sessionID", sessionID!);
    }

    const sessionID = getSessionId();
    asyncFunc(sessionID, setSteamUser);
  }, []);

  return (
    <>
      <Header steamUser={steamUser} setSteamUser={setSteamUser} />
      <UserBanner steamUser={steamUser} />
      <main>
        <div className="testing-block">
        

        </div>

        <aside>
          <FriendsList steamUser={steamUser} />
          <GamesList steamUser={steamUser} />
        </aside>
      </main>
    </>
  );
}
