import React, { useEffect, useState } from "react";
import Image from "next/image";
// import userLogo from "../../public/img/icon.png";
import userLogo from "@/public/img/icon.png";
import "./style.css";
const backendAddress = "http://localhost:7069";

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  }

  return <div className="user-profile">
    <div onClick={toggleOpen} className="user-logo-container">
      <Image alt="user logo" src={userLogo}/>
      <div className="user-triangle" style={{"rotate": isOpen ? "0deg" : "180deg"}}></div>
    </div>

    <div className={`user-dropdown ${isOpen ? "open" : ""}`}>
      <ul className="user-dropdown-container">
       <a href="/"> <li><span className="material-symbols-outlined">account_circle</span>Profile</li></a>
        <a href="/"><li><span className="material-symbols-outlined">settings</span>Settings</li></a>
        <hr className="separate-line" />
        <a href={`${backendAddress}/api/auth/steam`}><li><span className="material-symbols-outlined">move_item</span>Log in</li></a>
      </ul>
    </div>
  </div>;
}


export default UserProfile;

