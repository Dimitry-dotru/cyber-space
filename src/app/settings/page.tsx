"use client";

import React from "react";
import Header from "@/components/Header";
import { userObj } from "@/src/utils/types/steamTypes";
import { getUser } from "@/src/utils/functions/steamRequests";
import { getSessionId } from "@/src/utils/functions/authorization";
import Image from "next/image";
import Tab from "@/components/Tab";
import Button from "@/components/Button";

import "./style.css";

interface PageProps {
  params: {
    settingTab: string;
  };
}

const Page = ({ params }: PageProps) => {
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);
  const [settingTab, setSettingTab] = React.useState<string>(window.location.hash.substring(1));

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

    const getAndSetSettingTab = () => {
      setSettingTab(window.location.hash.substring(1));
    }

    window.addEventListener("hashchange", getAndSetSettingTab)

    return () => {
      window.removeEventListener("hashchange", getAndSetSettingTab);
    }
  }, []);

  return <>
    <Header steamUser={steamUser} setSteamUser={setSteamUser} />
    <main className="settings-page block-primary-rounded p-25">
      <h3 className="page-title">
        <span className="material-symbols-outlined">settings</span>
        Settings
      </h3>
      <div className="settings-content">
        <div className="settings-body">
          {steamUser && <>
            <Tab title="User profile" openedTab={settingTab} uniqueName="user-profile">
              <p className="input-title">Change avatar</p>
              <div className="input-container">
                <Image width={100} height={100} alt="User avatar" src={steamUser.avatarfull} />
                <input type="file" />
              </div>
              <p className="input-title">Change avatar</p>
              <div className="input-container">
                <Image width={100} height={100} alt="User avatar" src={steamUser.avatarfull} />
                <input type="file" />
              </div>
              <p className="input-title">Change avatar</p>
              <div className="input-container">
                <Image width={100} height={100} alt="User avatar" src={steamUser.avatarfull} />
                <input type="file" />
              </div>
              <p className="input-title">Change avatar</p>
              <div className="input-container">
                <Image width={100} height={100} alt="User avatar" src={steamUser.avatarfull} />
                <input type="file" />
              </div>
            </Tab>
            <Tab title="Theme settings" openedTab={settingTab} uniqueName="theme">
              Tab 2
            </Tab>
          </>}
        </div>
      </div>
      <div className="buttons-container">
        <Button textContent="Discard" type="reset" secondary />
        <Button textContent="Save" type="submit" primary />
      </div>
    </main>
  </>;
};

export default Page;