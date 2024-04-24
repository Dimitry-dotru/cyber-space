"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
// import userLogo from "../../public/img/icon.png";
import logo from "../../public/img/logo.png";
import UserProfile from "@/components/UserProfile";

const Header: React.FC<{isAuthorised: boolean}> = ({
  isAuthorised
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  }

  return(         
  <header className="header">
  <div >
      <Image src={logo} alt="Logo"></Image>
  </div>
  <div className="container-navigate">
      <div className="navigate">
          {/* пример использования material-symbols */}
          <span className="material-symbols-outlined">feed</span>
          <a href="/">News</a>
      </div>
      <div className="navigate">
        <span className="material-symbols-outlined">account_circle</span>
        <a href="/">
        Profile
      </a>
      </div>
      <UserProfile />
  </div>
</header>
  );
};


export default Header;

