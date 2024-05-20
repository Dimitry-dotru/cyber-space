import { userObj } from "@/src/utils/types/steamTypes";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";

import userLogo from "@/public/img/default-imgs/non_authorised_user.png";

interface ShareYourThoughtsProps {
  steamUser: userObj | null;
}

const ShareYourThoughts: React.FC<ShareYourThoughtsProps> = ({ steamUser }) => {
  const [value, setValue] = useState("");


  const modules = {
    toolbar: {
      container: [
        [{ "header": "1" }, { "header": "2" }],
        [{ size: ["small", "normal", "large"] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ "list": "ordered" }, { "list": "bullet" },
        { "indent": "-1" }, { "indent": "+1" }],
        ["link", "image"],
        ["clean"]
      ],
    }
  }

  return (
    <ReactQuill
      value={value}
      onChange={setValue}
      modules={modules}
      formats={[
        "header", "font", "size",
        "bold", "italic", "underline", "strike", "blockquote",
        "list", "bullet", "indent",
        "link", "image"
      ]}
    />
  );
  // return <div className="posts-container">
  //   <div className="input-logo-container">
  //     <img src={steamUser ? steamUser.avatarmedium : userLogo.src} className="profile-picture" />
  //     <input disabled={!steamUser} type="text" id="searchInput" placeholder={steamUser ? "Share Your Thoughts...": "You can"t share your thoughts yet!"} />
  //   </div>
  //   <span className="material-symbols-outlined">edit</span>
  // </div>;
}

export default ShareYourThoughts;