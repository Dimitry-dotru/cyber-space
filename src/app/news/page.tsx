// pages/index.tsx

import React, { useState }  from 'react';
import Image from "next/image";
import Link from 'next/link';
import logo from "../../../public/img/logo.png";
import icon from "../../../public/img/icon.png";
import prof from "../../../public/img/prof.svg";
import news from "../../../public/img/news.svg";


const Page = () => {
return (
    <header className='header'>
        <div >
        <Image src={logo} alt="Logo"></Image>
        </div>
        <div className='dota'>
        <div className='navigat'>
            <Image src={news} alt="Logo"></Image>
            <nav>News</nav>
            </div>
                <div className='navigat'>
                <Image src={prof} alt="Logo"></Image>
                <nav>Profile</nav>
                </div>
                    <Image src={icon} alt="Logo"></Image>
        </div>
    </header>
);
};

export default Page;