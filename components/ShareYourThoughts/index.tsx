import { userObj } from "@/src/utils/types/steamTypes";
import "./style.css";

import userLogo from "@/public/img/default-imgs/non_authorised_user.png";

interface ShareYourThoughtsProps {
  steamUser: userObj | null;
}

const ShareYourThoughts: React.FC<ShareYourThoughtsProps> = ({ steamUser }) => {

  return <div className="posts-container">
    <div className="input-logo-container">
      <img src={steamUser ? steamUser.avatarfull : userLogo.src} className="profile-picture" />
      <input type="text" id="searchInput" placeholder="Share Your Thoughts..." />
    </div>
    <span className="material-symbols-outlined">edit</span>
  </div>;
}

export default ShareYourThoughts;