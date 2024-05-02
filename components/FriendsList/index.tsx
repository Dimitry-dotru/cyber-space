"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid4 } from "uuid";

import "./style.css";

import { friendObj, userObj } from "@/src/utils/types/steamTypes";

const apiKey = process.env.apiKey;
const backendAddress = process.env.backendAddress;

interface FriendsListProps {
  steamUser: userObj | null;
}

async function getFriendsList(steamid: string, setFriendList: (arg: null | userObj[]) => void) {
  const data = await fetch(`${backendAddress}/steam/ISteamUser/GetFriendList/v0001/?key=${apiKey}&steamid=${steamid}&relationship=friend`);

  const friendList = (await data.json()).friendslist.friends as friendObj[];
  const pairsAmnt = Math.ceil(friendList.length / 100);
  const allUsers: userObj[] = [];

  for (let i = 0; i < pairsAmnt; i++) {
    const steamids = friendList.slice(i * 100, (i * 100) + 100).map((el) => el.steamid);

    const data = await fetch(`${backendAddress}/steam/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamids.join(",")}`);

    const usersArray = (await data.json()).response.players as userObj[];
    usersArray.forEach(el => {
      allUsers.push(el);
    })
  }

  // sort by alphabet...
  allUsers.sort((a, b) => {
    const nameA = a.personaname.toUpperCase();
    const nameB = b.personaname.toUpperCase();

    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }
    return 0;
  });

  setFriendList(allUsers);
}

const FriendsList: React.FC<FriendsListProps> = ({ steamUser }) => {
  const [friendList, setFriendList] = React.useState<userObj[] | null>(null);
  const [showMoreFriends, setShowMoreFriends] = React.useState<boolean>(false);
  const router = useRouter();

  React.useEffect(() => {
    if (!steamUser) return;
    fetch(`${backendAddress}/steam/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamUser.steamid}`)
      .then(d => d.json())
      .then(d => {
        const steamid = d.response.players[0].steamid;
        getFriendsList(steamid, setFriendList);
      })
  }, [steamUser]);


  return <div className="friends-list-container">
    <h3>
      <span className="material-symbols-outlined">group</span>
      Friends {friendList && friendList.length && <>({friendList.length})</>}
    </h3>

    <div className={`friend-list ${showMoreFriends ? "open" : ""}`}>
      {/* если не авторизован, то вывести сообщение чтобы авторизовался */}
      {!steamUser && <span style={{ alignSelf: "flex-start" }}>Authorise to see your friends!</span>}

      {steamUser && <>
        {/* если авторизован, но пока нету данных о друзьях, отобразить загрузку */}
        {!friendList && <span style={{ alignSelf: "flex-start" }}>Loading...</span>}
        {/* и когда друзья были получены, выводим их */}
        {friendList && <>
          {/* если уже так получилось что друзей нету */}
          {!friendList.length && "You haven’t friends yet..."}
          {friendList.length !== 0 &&
            <>
              {friendList.map(el => {
                return <div onClick={() => {
                  router.push(`/user/${el.steamid}`);
                }} title={el.personaname} key={uuid4()} className="friend-list-box-container">
                  <div
                    style={{
                      backgroundImage: `url(${el.avatarfull})`,
                    }}
                    className="friend-list-box">

                  </div>
                  <div className="friend-list-box-info">
                    {el.personaname}
                  </div>
                </div>
              })}
            </>
          }
        </>}
      </>}
    </div>
    {friendList && friendList.length > 12 && <div
      onClick={(e) => {
        if (showMoreFriends) {
          const friendListDiv = (e.target as HTMLDivElement).previousElementSibling;
          friendListDiv!.scrollTop = 0;
        }
        setShowMoreFriends(!showMoreFriends);
      }}
      className="see-more-btn">
      {showMoreFriends ? "Show less..." : "See more..."}
    </div>}
  </div>
}

export default FriendsList;