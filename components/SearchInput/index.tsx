import { useState } from "react";
import { searchedUserObj } from "@/src/utils/types/steamTypes";
import { v4 as uuid4 } from "uuid";
import "./style.css";

const SearchInput: React.FC<{ steamid: string }> = ({
  steamid
}) => {
  // null - input cleared
  // empty array - users not found
  const [searchedUsers, setSearchedUsers] = useState<searchedUserObj[] | null>(null);

  const changeHandle = (val: string) => {
    if (val.trim() === "") {
      setSearchedUsers(null);
      return;
    }

    if (val.trim().length >= 3) {
      const sessionID = global.window.localStorage.getItem("sessionID");

      fetch(`${process.env.backendAddress}/user/${steamid}/${val}?sessionID=${sessionID}`)
        .then((d) => d.json())
        .then((d) => {
          setSearchedUsers(d);
        });
    }
  }

  return (
    <div className="search-input-container">
      <input
        onChange={(e) => changeHandle(e.currentTarget.value)}
        className="search-input"
        type="text"
        placeholder="Search for users..."
      />
      <span className="search-input-icon material-symbols-outlined">search</span>
      {searchedUsers &&
        <div className="search-input-list-container">
          {searchedUsers.length === 0 && "Can't find this user"}
          {searchedUsers.length !== 0 && searchedUsers.map((el) => {
            return <a 
            href={`/user/${el.steamid}`}
            key={uuid4()}
            className="search-input-list-container-element">
              <img src={el.avatarmedium} alt="user avatar" />
              <h3>{el.personaname}</h3>
            </a>;
          })}
        </div>
      }
    </div>
  );
};

export default SearchInput;
