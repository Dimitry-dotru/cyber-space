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

const Page = () => {
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);
  const [settingTab, setSettingTab] = React.useState<string>(window.location.hash.substring(1));

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
  }

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
      <form onSubmit={submitHandler} onReset={() => window.location.reload()}>
        <div className="settings-content">
          <div className="settings-body">
            {steamUser && <>
              <Tab title="User profile" openedTab={settingTab} uniqueName="user-profile">
                <p className="input-title">Change avatar</p>
                <div className="input-container file-input-container">
                  <label className="file-input-label" htmlFor="avatar-change">
                    <Image width={100} height={100} alt="User avatar" src={steamUser.avatarfull} />
                    <p>Change picture...</p>
                  </label>
                  <input accept="image/*" type="file" id="avatar-change" />
                </div>
                <div>

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
      </form>
    </main>
  </>;
};

export default Page;