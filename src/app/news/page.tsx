// pages/index.tsx
"use client"

import Header from '../../../components/Header';
import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';

import { userObj } from '@/src/utils/types/steamTypes';
import { getUser } from '@/src/utils/functions/steamRequests';
import { getSessionId } from '@/src/utils/functions/authorization';


const Page = () => {
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);

  React.useEffect(() => {
    const asyncFunc = async (
      sessionID: string,
      setSteamUser: (arg: userObj | null) => void
    ) => {
      const data = await getUser(sessionID);
      setSteamUser(data);
      window.localStorage.setItem("sessionID", sessionID);
    }

    const sessionID = getSessionId();
    if (!sessionID) return;
    asyncFunc(sessionID, setSteamUser);
  }, []);

  return (
    <Header isAuthorised={!!steamUser} />
  );
};

export default Page;