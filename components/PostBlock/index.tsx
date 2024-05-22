import { postObj } from "@/src/utils/types/postsTypes";
import "./style.css";

interface PostBlockProp {
  post: postObj;
  useravatar: string;
}

const PostBlock: React.FC<PostBlockProp> = ({
  post, useravatar
}) => {

  return <div className="posts-list-element">
    <div className="posts-list-element-heading">
      <h3>
        <img src={useravatar} alt="User Avatar" />
        {post.personaname}
      </h3>
      <p className="time-posted">{(function () {
        const dateCreated = new Date(+post.postcreated);
        const dateNow = new Date();



        return <></>;
      })()}</p>
    </div>
    <div className="posts-list-element-body ql-editor" dangerouslySetInnerHTML={{ __html: post.postbody }}>
    </div>
    <div className="posts-list-element-actions">
      <button>
        <span className="material-symbols-outlined filled">thumb_up</span>
        {post.likes}
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

export default PostBlock;