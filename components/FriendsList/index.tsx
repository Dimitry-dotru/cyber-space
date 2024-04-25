import React from "react";
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

  setFriendList(allUsers);
}

const FriendsList: React.FC<FriendsListProps> = ({ steamUser }) => {
  const [friendList, setFriendList] = React.useState<userObj[] | null>(null);
  const [showMoreFriends, setShowMoreFriends] = React.useState<boolean>(false);

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
      Friends
    </h3>

    <div className={`friend-list ${showMoreFriends ? "open" : ""}`}>
      {!friendList && <span style={{ alignSelf: "flex-start" }}>Loading...</span>}
      {friendList && <>
        {!friendList.length && "You haven’t friends yet..."}
        {friendList.length &&
          <>
            {friendList.map(el => {
              return <div
                key={uuid4()}
                style={{
                  backgroundImage: `url(${el.avatarfull})`,
                }}
                className="friend-list-container">

              </div>
            })}
          </>
        }


      </>}
    </div>
    {friendList && friendList.length > 12 && <div
      onClick={() => {
        setShowMoreFriends(!showMoreFriends);
      }}
      className="see-more-btn">
      {showMoreFriends ? "Show less..." : "See more..."}
    </div>}
  </div>
}

export default FriendsList;