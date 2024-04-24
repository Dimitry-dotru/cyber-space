import React from "react";

const apiKey = "BDE51B80D4D4E0257B60610C0B3FE6F6";
const backendAddress = "http://localhost:7069";

interface FriendsListProps {
  steamid: string;
}

interface friendObj {
  friend_since: number;
  relationship: string;
  steamid: string;
}

async function getFriendsList(steamid: string) {
  const data = await fetch(`${backendAddress}/steam/ISteamUser/GetFriendList/v0001/?key=${apiKey}&steamid=${steamid}&relationship=friend`);

  const friendList = await data.json();

  
  
  // .then(d => d.json())
  // .then(d => {
  //   const friendList = d.friendslist.friends as friendObj[];
  //   const steamids: string[] = [];
  //   friendList.forEach((el, idx) => {
  //     steamids.push(el.steamid);
  //   })

  // })
  // fetch(`${backendAddress}/steam/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamids.join(",")}`)
  // .then(d => d.json())
  // .then(d => {
  //   console.log(d);
  // });
}

const FriendsList: React.FC<FriendsListProps> = ({ steamid }) => {

  React.useEffect(() => {
    fetch(`${backendAddress}/steam/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=76561197960435530`)
    .then(d => d.json())
    .then(d => {
      const steamid = d.response.players[0].steamid;
      getFriendsList(steamid);
    })
  }, []);


  return <div className="friends-list-container">
    
  </div>
}

export default FriendsList;