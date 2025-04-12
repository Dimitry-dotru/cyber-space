"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import userLogo from "@/public/img/default-imgs/non_authorised_user.png";
import "./style.css";

import { userObj } from "@/src/utils/types/steamTypes";
import { logoutHandler } from "@/src/utils/functions/authorization";

interface UserProfileProps {
  setSteamUser: (arg: userObj | null) => void;
  steamUser: null | userObj;
}

const UserProfile: React.FC<UserProfileProps> = ({ setSteamUser, steamUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    console.log(process.env.backendAddress);
    
  }, []);

  return <div className="user-profile">
    <div onClick={toggleOpen} className="user-logo-container">
      <img alt="user logo" width={60} height={60} src={steamUser ? steamUser.avatarmedium : userLogo.src} />
      <div className="user-triangle" style={{ "rotate": isOpen ? "0deg" : "180deg" }}></div>
    </div>

    <div className={`user-dropdown ${isOpen ? "open" : ""}`}>
      <ul className="user-dropdown-container">
        <a onClick={(e) => {
          e.preventDefault();
          router.push("/");
        }}> <li><span className="material-symbols-outlined">account_circle</span>Profile</li></a>
        <a onClick={(e) => {
          e.preventDefault();
          router.push("/settings")
        }}><li><span className="material-symbols-outlined">settings</span>Settings</li></a>
        <hr className="separate-line" />
        <a
          onClick={(e) => {
            if (steamUser) {
              e.preventDefault();
              logoutHandler(setSteamUser);
            }
          }}
          href={`${steamUser ? "" : process.env.backendAddress + "/api/auth/steam"}`}>

          <li><span className="material-symbols-outlined">move_item</span>
            {steamUser ? "Log out" : "Log in"}
          </li>

        </a>
      </ul>
    </div>
  </div>;
}


export default UserProfile;

