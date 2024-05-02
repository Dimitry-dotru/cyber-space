"use client";
import React from "react";
import { userObj } from '../utils/types/steamTypes';
import { getUser } from '../utils/functions/steamRequests';
import { getSessionId } from '../utils/functions/authorization';

import Header from '@/components/Header';
import FriendsList from '@/components/FriendsList';
import GamesList from '@/components/GamesList';
import UserBanner from '@/components/UserBanner';
import ShareYourThoughts from '@/components/ShareYourThoughts';


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
        document.body.style.backgroundImage = `url(${data.cyberspace_settings.public.userbgpattern})`;
      }
      window.localStorage.setItem("sessionID", sessionID!);
    }

    const sessionID = getSessionId();
    asyncFunc(sessionID, setSteamUser);
  }, []);

  return (
    <>
      <Header steamUser={steamUser} setSteamUser={setSteamUser} />
      <UserBanner avatar={steamUser ? steamUser.avatarfull : null} userbanner={steamUser ? steamUser.cyberspace_settings.public.userbanner : null}  />
      <main>
        <div className="container">
          <ShareYourThoughts steamUser={steamUser} />
          <div className="testing-block ">
          </div>

        </div>



        <aside>
          <FriendsList steamUser={steamUser} />
          <GamesList steamUser={steamUser} />
        </aside>
      </main>
    </>
  );
}
