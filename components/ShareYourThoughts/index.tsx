import { userObj } from "@/src/utils/types/steamTypes";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";

import userLogo from "@/public/img/default-imgs/non_authorised_user.png";

interface ShareYourThoughtsProps {
  steamUser: userObj | null;
}

const ShareYourThoughts: React.FC<ShareYourThoughtsProps> = ({ steamUser }) => {
  const [value, setValue] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  const isElementEmpty = (element: any) => {
    for (let node of element.childNodes) {
      if (node.nodeName === "IMG") return false;
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
        return false;
      }
      if (node.nodeType === Node.ELEMENT_NODE && !isElementEmpty(node)) {
        return false;
      }
    }
    return true;
  };

  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current && isEditorOpen) {
      const editor = (quillRef.current as any).getEditor();
      editor.focus();
    }
  }, [isEditorOpen]);


  const modules = {
    toolbar: {
      container: [
        [{ "header": "1" }, { "header": "2" }],
        [{ size: ["small", "normal", "large"] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ "list": "ordered" }, { "list": "bullet" },
        { "indent": "-1" }, { "indent": "+1" }],
        ["link", "image"],
        [{ 'align': [] }],
        ["clean"]
      ],
    }
  }

  if (!isEditorOpen) return <div className="posts-container">
    <div className="input-logo-container">
      <img src={steamUser ? steamUser.avatarmedium : userLogo.src} className="profile-picture" />
      <input onFocus={() => setIsEditorOpen(true)} disabled={!steamUser} type="text" id="searchInput" placeholder={steamUser ? "Share Your Thoughts..." : "You can't share your thoughts yet!"} />
    </div>
    <span className="material-symbols-outlined">edit</span>
  </div>


  return (
    <div className="text-editor-container">
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={setValue}
        modules={modules}
        placeholder="Start typing here..."
        formats={[
          "header", "font", "size",
          "bold", "italic", "underline", "strike", "blockquote",
          "list", "bullet", "indent",
          "link", "image", "align"
        ]}
      />
      <button className="close-btn" onClick={() => {
        setIsEditorOpen(false);
        setValue("");
      }}></button>
      {(function() {
        // проверяем были ли введены какие-то символы
        const div = document.createElement("div");
        div.innerHTML = value;

        return !isElementEmpty(div);
      })() && <button className="send-btn">Send</button>}
    </div>
  );
}

export default ShareYourThoughts;