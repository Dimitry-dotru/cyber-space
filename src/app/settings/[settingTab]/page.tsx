"use client";

import React from "react";
import Header from "@/components/Header";
import { userObj } from "@/src/utils/types/steamTypes";
import { getUser } from "@/src/utils/functions/steamRequests";
import { getSessionId } from "@/src/utils/functions/authorization";
import { useRouter } from "next/navigation";

import "./style.css";

interface PageProps {
  params: {
    settingTab: string;
  };
}

const Page = ({ params }: PageProps) => {
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);
  const router = useRouter();
  const { settingTab } = params;

  React.useEffect(() => {
    const asyncFunc = async (
      sessionID: string | null,
      setSteamUser: (arg: userObj | null) => void
    ) => {
      if (!sessionID) return;
      const data = await getUser(sessionID);
      setSteamUser(data);
      window.localStorage.setItem("sessionID", sessionID!);
    }

    const sessionID = getSessionId();
    asyncFunc(sessionID, setSteamUser);
  }, []);

  const tabs = [
    {
      tabName: "User profile",
      link: "/settings/"
    }
  ]

  return <>
    <Header steamUser={steamUser} setSteamUser={setSteamUser} />
    <main className="block-primary radius-bottom radius-top p-25">
      <h3 className="page-title">
        <span className="material-symbols-outlined">settings</span>
        Settings
      </h3>
      <div className="settings-body">
        <div className="settings-tabs">
          <button onClick={() => {
            router.replace("user-profile", "user-test")
          }}>Test</button>
        </div>
        <div className="settings-content"></div>
      </div>
    </main>
  </>;
};

export default Page;