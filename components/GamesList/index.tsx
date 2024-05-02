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
  const [gamesList, setGamesList] = React.useState<null | gameObj[]>(null);
  const [gamesElements, setGamesElements] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    if (!steamUser) {
      return;
    }
    fetch(`${process.env.backendAddress}/steam/IPlayerService/GetOwnedGames/v0001/?key=${process.env.apiKey}&steamid=${steamUser.steamid}&format=json&include_appinfo=true&include_played_free_games=true`)
      .then(d => d.json())
      .then(d => {
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
          gamesArr.map(el => {
            gamesElements.push(<GameElement key={uuid4()} steamid={steamUser.steamid} gameListEl={el} />);
            setGamesElements([...gamesElements]);
          });
        }
        setGamesList(gamesArr);
      });
  }, [steamUser]);

  return <div className="games-list-container">
    <h3>
      <span className="material-symbols-outlined">sports_esports</span>
      Games {gamesList && gamesList.length && <>({gamesList.length})</>}
    </h3>

    <div className={`games-list ${showMoreGames ? "open" : ""}`}>
      {/* если не авторизован, то вывести сообщение чтобы авторизовался */}
      {!steamUser && <span style={{ alignSelf: "flex-start" }}>Authorise to see your friends!</span>}

      {/* {steamUser && <> */}
        {/* если авторизован, но пока нету данных о играх, отобразить загрузку */}
        {!gamesList && steamUser && <span style={{ alignSelf: "flex-start" }}>Loading...</span>}
        {/* и когда игры были получены, выводим их */}
        {gamesElements}
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
    {gamesList && gamesList.length > 12 && <div
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
  </div>
}

interface GameElementProps {
  steamid: string;
  gameListEl: gameObj;
}

const getLastTimePlayed = (seconds: number) => {
  const date: any = new Date(1000 * seconds);
  const currentDate: any = new Date();

  const diffDays = Math.floor(Math.abs(date - currentDate) / (1000 * 60 * 60 * 24));

  switch (true) {
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

const GameElement: React.FC<GameElementProps> = ({ steamid, gameListEl }) => {
  const [achievements, setAchievements] = React.useState<null | countendAchievementsProps>(null);

  const mathHours = gameListEl.playtime_forever / 60;
  const totalPlayTime = mathHours <= 1 ? `${mathHours.toFixed(2)} min` : `${Math.ceil(mathHours)}h`;
  const lastPlayed = getLastTimePlayed(gameListEl.rtime_last_played);


  React.useEffect(() => {
    const func = async () => {
      const data = await getAchievementsInfo(steamid, gameListEl.appid);
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