import { getAllPosts } from "@/src/utils/functions/postsRequests";
import { userObj } from "@/src/utils/types/steamTypes";
import { postObj } from "@/src/utils/types/postsTypes";
import { v4 as uuid4 } from "uuid";

import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    const postsFunc = async () => {
      const posts = await getAllPosts(steamUser.steamid);

      posts!.sort((a, b) => +b.postcreated - +a.postcreated);
      setUserPosts(posts);
    };

    postsFunc();
  }, []);

  return <>
    <div className="posts-heading">
      <h4>{otherUserPage ? `User's posts` : `My posts`}</h4>
      <div className="sorting-params">

      </div>
    </div>

    {userPosts && <>
      {userPosts.length !== 0 && <div className="posts-list">
        {userPosts.map((el) => {
          return <PostBlock steamUserViewer={steamUserViewer} key={uuid4()} useravatar={steamUser.avatarmedium} post={el} />;
        })}
      </div>}

      {!userPosts.length && <h5>You haven't any posts yet!</h5>}
    </>}

  </>;
}

export default UserPostsFeed;