"use client"

import { userObj, nonRegUserObj } from "@/src/utils/types/steamTypes";

import Header from "@/components/Header";
import UserBanner from "@/components/UserBanner";
import React from "react";
import { getUserFromSteam } from "@/src/utils/functions/steamRequests";

interface PageProps {
  params: {
    steamid: number;
  };
}

const Page: React.FC<any> = ({ params }: PageProps) => {
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);
  const [nonRegUser, setNonRegUser] = React.useState<nonRegUserObj | null>(null);

  React.useEffect(() => {
    const asyncFunc = async () => {
      const searchId = getUserFromSteam(params.steamid);
    }

    asyncFunc();
    
  }, []);

  return <>
  <Header setSteamUser={setSteamUser} steamUser={steamUser} />
  {/* <UserBanner userbanner={nonRegUser ? }/> */}
    <main>
      <div className="container">
        <div className="testing-block ">
        </div>

      </div>
    </main>
  </>
};

export default Page;