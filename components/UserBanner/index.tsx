"use client"
import { userObj } from "@/src/utils/types/steamTypes"
import React from "react";
import Image from "next/image";
import bannerDefault from "@/public/img/default-imgs/banner_default.webp"
import avatarDefault from "@/public/img/default-imgs/non_authorised_user.png"
import "./style.css";

interface UserBannerProps {
  userbanner: string | null;
  avatar: string | null;
}

const UserBanner: React.FC<UserBannerProps> = ({
  avatar, userbanner
}) => {
  return <>
    <div className="banner-container">
      <img src={userbanner ? userbanner : bannerDefault.src} alt="Banner" className="banner" />
      <a href="/settings#user-profile">
        <Image src={avatar ? avatar : avatarDefault} width={250} height={250} alt="Avatar" className="avatar" />
      </a>
      <a href="/settings#theme" className="edit-button">
        <div className="edit-box-circle">
          <span className="material-symbols-outlined">edit</span>
        </div>
      </a>
    </div>
  </>
}

export default UserBanner;