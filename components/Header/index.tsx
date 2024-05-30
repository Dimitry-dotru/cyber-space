"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../public/img/logo.png";

import UserProfile from "@/components/UserProfile";
import Input from "../Input";

import { userObj } from "@/src/utils/types/steamTypes";

interface HeaderProps {
  setSteamUser: (arg: userObj | null) => void
  steamUser: null | userObj;
}
const Header: React.FC<HeaderProps> = ({
  setSteamUser,
  steamUser
}) => {
  return (
    <header className="header">
      <div className="d-flex items-center logo-container">
        <a href="/">
          <Image src={logo} alt="Logo" />
        </a>
        <Input />
      </div>
      <div className="container-navigate">
        {/* <div className="navigate">
          <span className="material-symbols-outlined">feed</span>
          <a href="/news">News</a>
        </div>
        <div className="navigate">
          <span className="material-symbols-outlined">account_circle</span>
          <a href="/">
            Profile
          </a>
        </div> */}
        <UserProfile steamUser={steamUser} setSteamUser={setSteamUser} />
      </div>
    </header>
  );
};


export default Header;

