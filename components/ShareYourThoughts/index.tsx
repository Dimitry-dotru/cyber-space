import { userObj } from "@/src/utils/types/steamTypes";
import "./style.css";

import userLogo from "@/public/img/default-imgs/non_authorised_user.png";

interface ShareYourThoughtsProps {
  steamUser: userObj | null;
}

const ShareYourThoughts: React.FC<ShareYourThoughtsProps> = ({ steamUser }) => {

  return <div className="posts-container">
    <div className="input-logo-container">
      <img src={steamUser ? steamUser.avatarmedium : userLogo.src} className="profile-picture" />
      <input disabled={!steamUser} type="text" id="searchInput" placeholder={steamUser ? "Share Your Thoughts...": "You can't share your thoughts yet!"} />
    </div>
    <span className="material-symbols-outlined">edit</span>
  </div>;
}

export default ShareYourThoughts;