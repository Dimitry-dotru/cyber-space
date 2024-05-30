"use client"
import { userObj } from "@/src/utils/types/steamTypes"
import React from "react";
import Image from "next/image";
import bannerDefault from "@/public/img/default-imgs/banner_default.webp"
import avatarDefault from "@/public/img/default-imgs/non_authorised_user.png"
import "./style.css";

// visitedUser - если ты смотришь чужой баннер, то true
interface UserBannerProps {
  userbanner: string | null;
  avatar: string | null;
  personaname: string | null;
  visitedUser?: boolean;
}

const UserBanner: React.FC<UserBannerProps> = ({
  avatar, userbanner, personaname, visitedUser = false
}) => {
  return <div className="banner-container">
    <img src={userbanner ? userbanner : bannerDefault.src} alt="Banner" className="banner" />
    <a className="avatar-container" href="/settings#user-profile" onClick={(e) => {
      if (visitedUser) e.preventDefault()
    }}>
      <img src={avatar ? avatar : avatarDefault.src} width={250} height={250} alt="Avatar" className="avatar" />
      {personaname && <div className="avatar-user-name">{personaname}</div>}
    </a>
    {!visitedUser && userbanner &&
      <a href="/settings#theme" className="edit-button">
        <div className="edit-box-circle">
          <span className="material-symbols-outlined">edit</span>
        </div>
      </a>
    }
  </div>
}

export default UserBanner;