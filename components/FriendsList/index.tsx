"use client"

import React from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid4 } from "uuid";

import "./style.css";

import { friendObj, userObj } from "@/src/utils/types/steamTypes";
import { getFriendsList } from "@/src/utils/functions/steamRequests";

const backendAddress = process.env.backendAddress;

interface FriendsListProps {
  steamUser: userObj | null;
}

const FriendsList: React.FC<FriendsListProps> = ({ steamUser }) => {
  const [friendList, setFriendList] = React.useState<friendObj[] | null| undefined>(null);
  const [showMoreFriends, setShowMoreFriends] = React.useState<boolean>(false);
  const router = useRouter();

  React.useEffect(() => {
    if (!steamUser) return;
    getFriendsList(steamUser.steamid, setFriendList);

    fetch(`${backendAddress}/user-friends/${steamUser.steamid}/?sessionID=${window.localStorage.getItem("sessionID")}`);
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
        {!friendList && friendList !== undefined && <span style={{ alignSelf: "flex-start" }}>Loading...</span>}
        {/* если у профиля стоит private в настройках профиля */}
        {friendList === undefined && "This account has private profile settings!"}
        {/* и когда друзья были получены, выводим их */}
        {friendList && friendList !== undefined && <>
          {/* если уже так получилось что друзей нету */}
          {!friendList.length && "You haven’t friends yet..."}
          {friendList.length !== 0 &&
            <>
              {friendList.map(el => {
                return <div onClick={() => {
                  if (el.registered)
                    router.push(`/user/${el.steamid}`);
                }} title={el.personaname} key={uuid4()} className="friend-list-box-container">
                  <div
                    style={{
                      backgroundImage: `url(${el.avatarmedium})`,
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