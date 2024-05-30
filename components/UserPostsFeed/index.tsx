import { getAllPosts } from "@/src/utils/functions/postsRequests";
import { userObj } from "@/src/utils/types/steamTypes";
import { postObj } from "@/src/utils/types/postsTypes";
import { v4 as uuid4 } from "uuid";

import React, { useEffect } from "react";

import PostBlock from "../PostBlock";

import "./style.css";

// steamUserViewer - тот кто смотрит эти посты
// steamUser - тот, кому принадлежат эти посты
const UserPostsFeed: React.FC<{ steamUser: userObj; otherUserPage?: boolean; steamUserViewer: userObj }> = ({
  steamUserViewer,
  steamUser,
  otherUserPage = false
}) => {
  const [userPosts, setUserPosts] = React.useState<null | postObj[]>(null);
  const [sortBy, setSortBy] = React.useState<"new" | "old" | "popular">("new");

  useEffect(() => {
    const postsFunc = async () => {
      const posts = await getAllPosts(steamUser.steamid);

      if (posts) {
        switch (sortBy) {
          case "new": posts.sort((a, b) => +b.postcreated - +a.postcreated);
            break;
          case "old": posts.sort((a, b) => +a.postcreated - +b.postcreated);
            break;
          case "popular": posts.sort((a, b) => b.likes.length - a.likes.length);
            break;
        }
      }
      setUserPosts(posts);
    };

    postsFunc();
  }, []);

  useEffect(() => {

    if (!userPosts) return;
    const temp = [...userPosts];
    
    switch(sortBy) {
      case "new": temp.sort((a, b) => +b.postcreated - +a.postcreated);
      break;
      case "old": temp.sort((a, b) => +a.postcreated - +b.postcreated);
      break;
      case "popular": temp.sort((a, b) => b.likes.length - a.likes.length);
      break;
    }

    setUserPosts(temp);

  }, [sortBy]);

  return <>
    <div className="posts-heading">
      <h4>{otherUserPage ? `User's posts` : `My posts`}</h4>
      <div className="sorting-params">
        <div className={sortBy === "new" ? "selected" : ""} onClick={() => setSortBy("new")}>New</div>
        <div className={sortBy === "old" ? "selected" : ""} onClick={() => setSortBy("old")}>Old</div>
        <div className={sortBy === "popular" ? "selected" : ""} onClick={() => setSortBy("popular")}>Popular</div>
      </div>
    </div>

    {userPosts && <>
      {userPosts.length !== 0 && <div className="posts-list">
        {userPosts.map((el) => {
          return <PostBlock userPosts={userPosts} setUserPosts={setUserPosts} steamUserViewer={steamUserViewer} key={uuid4()} useravatar={steamUser.avatarmedium} post={el} />;
        })}
      </div>}

      {!userPosts.length && <h5>You haven't any posts yet!</h5>}
    </>}

  </>;
}

export default UserPostsFeed;