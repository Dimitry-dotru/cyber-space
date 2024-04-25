// pages/index.tsx
"use client"

import Header from '../../../components/Header';
import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';

import { userObj } from '@/src/utils/types/steamTypes';
import { getUser } from '@/src/utils/functions/steamRequests';
import { getSessionId } from '@/src/utils/functions/authorization';

import FriendsList from '@/components/FriendsList';


const Page = () => {
    return <>
        
    </>;
};

export default Page;