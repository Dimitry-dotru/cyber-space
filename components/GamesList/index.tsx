import React from "react";
import { userObj, gameObj } from "@/src/utils/types/steamTypes";
import { getAchievementsInfo } from "@/src/utils/functions/steamRequests";

import "./style.css";

interface GamesListProps {
  steamUser: userObj | null;
}

const getGamesAchievements = async (gamesList: gameObj[], steamid: string) => {
  const allGamesInfo: any[] = [];
  const gameIds: number[] = [];
  gamesList.forEach(el => gameIds.push(el.appid));

  const d = await getAchievementsInfo(steamid, gameIds);
  // gamesList.forEach(async (el) => {
  //   const d = await getAchievementsInfo(steamid, el.appid);
  //   if (d) allGamesInfo.push(d);
  // });

  // console.log(allGamesInfo);
}



const GamesList: React.FC<GamesListProps> = ({ steamUser }) => {
  const [showMoreGames, setShowMoreGames] = React.useState(false);
  const [gamesList, setGamesList] = React.useState<null | gameObj[]>(null);

  React.useEffect(() => {
    if (!steamUser) {
      return;
    }
    fetch(`${process.env.backendAddress}/steam/IPlayerService/GetOwnedGames/v0001/?key=${process.env.apiKey}&steamid=${steamUser.steamid}&format=json`)
      .then(d => d.json())
      .then(d => {
        const gamesArr = d.response.games as gameObj[];
        setGamesList(gamesArr);

        getGamesAchievements(gamesArr, steamUser.steamid);
      });
  }, [steamUser]);


  return <div className="games-list-container">
    <h3>
      <span className="material-symbols-outlined">sports_esports</span>
      Games
    </h3>

    <div className={`games-list ${showMoreGames ? "open" : ""}`}>
      {/* если не авторизован, то вывести сообщение чтобы авторизовался */}
      {!steamUser && <span style={{ alignSelf: "flex-start" }}>Authorise to see your friends!</span>}

      {steamUser && <>
        {/* если авторизован, но пока нету данных о играх, отобразить загрузку */}
        {!gamesList && <span style={{ alignSelf: "flex-start" }}>Loading...</span>}
        {/* и когда игры были получены, выводим их */}
        {gamesList && <>
          {!gamesList.length && "You haven’t games yet..."}
          {gamesList.length !== 0 &&
            <></>
            // тут пройтись по всем играм
          }
        </>}
      </>}
    </div>
    {gamesList && gamesList.length > 12 && <div
      onClick={() => {
        setShowMoreGames(!showMoreGames);
      }}
      className="see-more-btn">
      {showMoreGames ? "Show less..." : "See more..."}
    </div>}
  </div>
}

export default GamesList;