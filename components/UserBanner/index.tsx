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
  const handleEditClick = () => {
    // console.log("Edit button clicked");
  };
  return <>
    <div className="banner-container">
      <img width={100} height={100} src={userbanner ? userbanner : bannerDefault.src} alt="Banner" className="banner" />
      <Image src={avatar ? avatar : avatarDefault} width={250} height={250} alt="Avatar" className="avatar" />
      <button className="edit-button" onClick={handleEditClick}>
        <div className="edit-box-circle">
          <span className="material-symbols-outlined">edit</span>
        </div>
      </button>
    </div>
  </>
}

export default UserBanner;