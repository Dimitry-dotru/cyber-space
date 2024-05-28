import { likeObj, postObj } from "@/src/utils/types/postsTypes";
import "./style.css";
import { useEffect, useState } from "react";
import { userObj } from "@/src/utils/types/steamTypes";

interface PostBlockProp {
  post: postObj;
  useravatar: string;
  steamUserViewer: userObj;
}


const PostBlock: React.FC<PostBlockProp> = ({
  post, useravatar, steamUserViewer
}) => {
  const [likes, setLikes] = useState<likeObj[]>(post.likes);

  const checkIsLikePutted = () => {
    for (let i = 0; i < likes.length; i++) if (likes[i].steamid === steamUserViewer.steamid) 
      return true;
    return false
  }

  const handleLikeClick = async () => {
    // sending like, and getting returns
    const sessionID = global.window.localStorage.getItem("sessionID");

    if (!sessionID) {
      console.log("No session id");
      return;
    }

    const likedPersonObj = {
      steamid: steamUserViewer.steamid,
      personaname: steamUserViewer.personaname,
      likedat: new Date()
    }
    const data = await fetch(`${process.env.backendAddress}/posts/like/${post.postid}?sessionID=${sessionID}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(likedPersonObj)
    });
    if (!data.ok) {
      console.log(data);
      return;
    }

    const likes = (await data.json() as likeObj[]);
    setLikes(likes);
  }

  return <div className="posts-list-element">
    <div className="posts-list-element-heading">
      <h3>
        <img src={useravatar} alt="User Avatar" />
        {post.personaname}
      </h3>
      <p className="time-posted">{(function () {
        const dateCreated = new Date(+post.postcreated);

        const day = String(dateCreated.getDate()).padStart(2, '0');
        const month = String(dateCreated.getMonth() + 1).padStart(2, '0');
        const year = dateCreated.getFullYear();

        return `${day}.${month}.${year}`;
      })()}</p>
    </div>
    <PostBlockBody post={post} />
    <div className="posts-list-element-actions">
      <button onClick={handleLikeClick}>
        <span className={`material-symbols-outlined ${checkIsLikePutted() ? "filled" : ""}`}>thumb_up</span>
        {likes.length}
      </button>
      <button>
        <span className="material-symbols-outlined">chat_bubble</span>
        {post.comments}
      </button>
      <button>
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </div>

  </div>;
}

interface PostBlockBodyProps {
  post: postObj;
}

const PostBlockBody: React.FC<PostBlockBodyProps> = ({
  post
}) => {
  const [isShownDownWardButton, setIsShownDownWardButton] = useState<boolean>(false);
  const [isShowFullBody, setIsShowFullBody] = useState<boolean>(false);

  const handleMount = (element: HTMLDivElement | null) => {
    if (!element) return;

    const { clientHeight, scrollHeight } = element;
    if (scrollHeight > clientHeight) setIsShownDownWardButton(true);
  }

  useEffect(() => {
    // проверяем нужна ли кнопка раскрытия контента
    // console.log(e.currentTarget.clientHeight, e.currentTarget.scrollHeight);
  }, []);

  return <>
    {isShownDownWardButton && <button onClick={() => {
      setIsShowFullBody(!isShowFullBody);
    }} className={`material-symbols-outlined arrow-downward`}
      style={{
        transform: `rotate(${isShowFullBody ? "180" : "0"}deg)`,
      }}
    >arrow_downward</button>}
    <div ref={handleMount} className={`posts-list-element-body ql-editor ${isShowFullBody ? "open" : ""}`}>
      <div className="posts-list-element-body-content" dangerouslySetInnerHTML={{ __html: post.postbody }}></div>

      {!!post.postimages.length && <div className="img-gallery">
        <img src={post.postimages[0]} alt="Image" />
      </div>}

    </div>
  </>
}

export default PostBlock;