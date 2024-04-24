// pages/index.tsx
"use client"

import UserProfile from '../../../components/UserProfile';
import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import logo from "../../../public/img/logo.png";
import icon from "../../../public/img/icon.png";
import prof from "../../../public/img/prof.svg";
import news from "../../../public/img/news.svg";

import FriendsList from '@/components/FriendsList';


const Page = () => {
    return <>
        <header className='header'>
            <div >
                <Image src={logo} alt="Logo"></Image>
            </div>
            <div className='dota'>
                <div className='navigat'>
                    {/* пример использования material-symbols */}
                    <span className="material-symbols-outlined">feed</span>
                    <nav>News</nav>
                </div>
                <div className='navigat'>
                    <Image src={prof} alt="Logo"></Image>
                    <nav>Profile</nav>
                </div>
                <UserProfile />
            </div>
        </header>
        <FriendsList steamid="/" />
    </>;
};

export default Page;