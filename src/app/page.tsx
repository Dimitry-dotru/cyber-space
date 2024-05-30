"use client";
import React from "react";
import { userObj } from "../utils/types/steamTypes";
import { getUser } from "../utils/functions/steamRequests";
import { authOperation } from "../utils/functions/authorization";

import Header from "@/components/Header";
import FriendsList from "@/components/FriendsList";
import GamesList from "@/components/GamesList";
import UserBanner from "@/components/UserBanner";
import UserPostsFeed from "@/components/UserPostsFeed";
import ShareYourThoughts from "@/components/ShareYourThoughts";


export default function Home() {
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);

  React.useEffect(() => {
    authOperation(setSteamUser);
  }, []);

  return (
    <>
      <Header steamUser={steamUser} setSteamUser={setSteamUser} />
      <UserBanner personaname={steamUser ? steamUser.personaname : null} avatar={steamUser ? steamUser.avatarfull : null} userbanner={steamUser ? steamUser.cyberspace_settings.public.userbanner : null} />
      <main>
        <div className="container">
          <ShareYourThoughts steamUser={steamUser} />
          <div style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }} className="user-posts-container">
            {steamUser &&
              <UserPostsFeed steamUserViewer={steamUser} steamUser={steamUser} />
            }

            {!steamUser && <h3>Authorize and see your own posts!</h3>}

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
