"use client"

import React, { useMemo } from "react";
import { userObj, gameObj, countendAchievementsProps } from "@/src/utils/types/steamTypes";
import { getAchievementsInfo } from "@/src/utils/functions/steamRequests";
import { v4 as uuid4 } from "uuid";

import "./style.css";

interface GamesListProps {
  steamUser: userObj | null;
}

const GamesList: React.FC<GamesListProps> = ({ steamUser }) => {
  const [showMoreGames, setShowMoreGames] = React.useState(false);
  const [gamesList, setGamesList] = React.useState<null | gameObj[] | undefined>(null);
  const [gamesElements, setGamesElements] = React.useState<{
    name: string;
    element: React.ReactNode;
  }[]>([]);
  const [displayedGamesElements, setDisplayedGamesElements] = React.useState<{
    name: string;
    element: React.ReactNode;
  }[]>([]);
  const [searchVal, setSearchVal] = React.useState<string>("");


  React.useEffect(() => {
    if (!steamUser) {
      return;
    }
    fetch(`${process.env.backendAddress}/steam/IPlayerService/GetOwnedGames/v0001/?key=${process.env.apiKey}&steamid=${steamUser.steamid}&format=json&include_appinfo=true&include_played_free_games=true`)
      .then(d => d.json())
      .then(d => {
        const data = d.response;
        if (!data.games) {
          setGamesList(undefined);
          return;
        }
        const gamesArr = d.response.games as gameObj[];
        gamesArr.sort((a, b) => {

          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        if (gamesArr && !gamesElements.length) {
          let isHiddenAchievements = false;
          gamesArr.map(async (el, idx) => {
            // проверяем запрос по первому элементу, и если статус ответа 403, то есть отказано в доступе, то запрещаем отправлять
            if (idx === 0) {
              const data = await fetch(
                `${process.env.backendAddress}/steam/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${el.appid}&key=${process.env.apiKey}&steamid=${steamUser.steamid}`
              );
              if (data.status === 403) {
                isHiddenAchievements = true;
              }
            }
            gamesElements.push({
              name: el.name,
              element: <GameElement hiddenAchievements={isHiddenAchievements} key={uuid4()} steamid={steamUser.steamid} gameListEl={el} />
            });
            setGamesElements([...gamesElements]);
            setDisplayedGamesElements([...gamesElements]);
          });
        }
        setGamesList(gamesArr);
      });
  }, [steamUser]);

  React.useEffect(() => {
    if (!gamesList) return;

    if (searchVal.trim() === "") {
      setDisplayedGamesElements(gamesElements);
      return;
    }

    setDisplayedGamesElements(gamesElements.filter((el) => el.name.toLowerCase().includes(searchVal.trim().toLowerCase())));
  }, [searchVal]);

  const searchHandle = (val: string) => {
    if (val.length >= 3) setSearchVal(val);
    else if (val.length <= 1) setSearchVal("");
  }

  return <div className="games-list-container">
    <h3>
      <span className="material-symbols-outlined">sports_esports</span>
      Games {gamesList && gamesList.length && <>({gamesList.length})</>}
    </h3>

    {gamesList && gamesList.length !== 0 &&
      <input onChange={(e) => searchHandle(e.currentTarget.value)} className="list-searching-input" type="text" placeholder="Search..." />
    }

    <div className={`games-list ${showMoreGames ? "open" : ""}`}>
      {/* если не авторизован, то вывести сообщение чтобы авторизовался */}
      {!steamUser && <span style={{ alignSelf: "flex-start" }}>Authorise to see your friends!</span>}

      {/* {steamUser && <> */}
      {/* если авторизован, но пока нету данных о играх, отобразить загрузку */}
      {!gamesList && steamUser && gamesList !== undefined && <span style={{ alignSelf: "flex-start" }}>Loading...</span>}
      {/* и когда игры были получены, выводим их */}
      {displayedGamesElements.map(el => el.element)}
      {/* {gamesList && <>
          {!gamesList.length && "You haven’t games yet..."}
          {gamesList.length &&
            gamesList.map(el => {
              return <GameElement key={uuid4()} gameListEl={el} steamid={steamUser.steamid} />
            })
          }
        </>} */}
      {/* </>} */}
    </div>
    {gamesList && gamesList.length > 12 && displayedGamesElements.length > 12 && <div
      onClick={(e) => {
        if (showMoreGames) {
          const gamesListDiv = (e.target as HTMLDivElement).previousElementSibling;
          gamesListDiv!.scrollTop = 0;
        }
        setShowMoreGames(!showMoreGames);
      }}
      className="see-more-btn">
      {showMoreGames ? "Show less..." : "See more..."}
    </div>}

    {gamesList === undefined && <span style={{ alignSelf: "flex-start" }}>Games are hidden for this user</span>}

  </div>
}

interface GameElementProps {
  steamid: string;
  gameListEl: gameObj;
  hiddenAchievements: boolean;
}

const getLastTimePlayed = (seconds: number) => {
  const date: any = new Date(1000 * seconds);
  const currentDate: any = new Date();

  const diffDays = Math.floor(Math.abs(date - currentDate) / (1000 * 60 * 60 * 24));

  switch (true) {
    case seconds === undefined:
      return "Hidden";
    case seconds === 0:
      return "Never";
    case diffDays < 1:
      return "Today";
    case diffDays === 1:
      return "Yesterday";
    case diffDays <= 7:
      return "Last Week";
    default:
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });;
  }
}

const GameElement: React.FC<GameElementProps> = ({ steamid, gameListEl, hiddenAchievements }) => {
  const [achievements, setAchievements] = React.useState<null | countendAchievementsProps>(null);

  const mathHours = gameListEl.playtime_forever / 60;
  const totalPlayTime = mathHours < 1 ? `${mathHours.toFixed(2)} min` : `${Math.ceil(mathHours)}h`;
  const lastPlayed = getLastTimePlayed(gameListEl.rtime_last_played);

  React.useEffect(() => {
    const func = async () => {
      const data = await getAchievementsInfo(steamid, gameListEl, hiddenAchievements);
      setAchievements(data);
    }
    func();
  }, []);

  return <div title={gameListEl.name} className="games-list-blocks">
    <img src={`http://media.steampowered.com/steamcommunity/public/images/apps/${gameListEl.appid}/${gameListEl.img_icon_url}.jpg`} alt="Game cover" />

    <div className="games-list-blocks-content">
      <div className="justify-between">
        <div className="gap-5 direction-column">
          <h4 className="games-block-title">Total playtime</h4>
          <h5 className="games-block-description">{totalPlayTime}</h5>
        </div>

        <div className="gap-5 direction-column">
          <h4 className="games-block-title">Last played</h4>
          <h5 className="games-block-description">{lastPlayed}</h5>
        </div>

      </div>
      <div className="gap-5 direction-column">
        <h4 className="games-block-title w-max justify-between">
          Achievements
          {(achievements && achievements.hasAchievements) &&
            <span className="games-block-description">{`${achievements.completed}/${achievements.totalAchievements}`}</span>
          }
        </h4>
        {(!achievements || !achievements.hasAchievements) && <h4 className="games-block-description">Achievements disabled</h4>}
        {(achievements && achievements.hasAchievements) &&
          <div className="games-list-block-progressbar">
            <div style={{
              width: `${achievements.completePercentage}%`,
              borderTopRightRadius: `${achievements.completePercentage === 100 ? "2px" : "0px"}`,
              borderBottomRightRadius: `${achievements.completePercentage === 100 ? "2px" : "0px"}`,
            }} className="completed"></div>
          </div>
        }
      </div>
    </div>
  </div>;
}

export default GamesList;