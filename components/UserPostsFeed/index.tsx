import { getAllPosts } from "@/src/utils/functions/postsRequests";
import { userObj } from "@/src/utils/types/steamTypes";
import { postObj } from "@/src/utils/types/postsTypes";

import React, { useEffect, useState } from "react";

import PostBlock from "../PostBlock";

import "./style.css";

const UserPostsFeed: React.FC<{ steamUser: userObj; otherUserPage?: boolean; }> = ({ 
  steamUser,
  otherUserPage = false
}) => {
  const [userPosts, setUserPosts] = React.useState<null | postObj[]>(null);

  useEffect(() => {
    const postsFunc = async () => {
      const posts = await getAllPosts(steamUser.steamid);

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
      {userPosts.length && <div className="posts-list">
        {userPosts.map((el) => {

          return <PostBlock useravatar={steamUser.avatarmedium} post={el} />;
        })}
      </div>}

      {!userPosts.length && <h5>You haven't any posts yet!</h5>}
    </>}

  </>;
}

export default UserPostsFeed;