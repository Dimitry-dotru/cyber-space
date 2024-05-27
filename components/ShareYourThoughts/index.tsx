import { userObj } from "@/src/utils/types/steamTypes";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";

import userLogo from "@/public/img/default-imgs/non_authorised_user.png";
import { sendPost } from "@/src/utils/functions/postsRequests";
import Button from "../Button";

interface ShareYourThoughtsProps {
  steamUser: userObj | null;
}

const ShareYourThoughts: React.FC<ShareYourThoughtsProps> = ({ steamUser }) => {
  const [value, setValue] = useState("");
  const [selectedImgs, setSelectedImages] = useState<string[] | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current && isEditorOpen) {
      const editor = (quillRef.current as any).getEditor();
      editor.focus();
    }
  }, [isEditorOpen]);

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

  const modules = {
    toolbar: {
      container: [
        [{ "header": "1" }],
        // [{ size: ["small", "normal", "large"] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ "list": "ordered" }, { "list": "bullet" },
        { "indent": "-1" }, { "indent": "+1" }],
        ["link"],
        [{ 'align': [] }],
        ["clean"]
      ],
      handlers: {
        // 'image': handleImageUpload,
      },
    }
  }

  //! отобразить лоадер, после получения ответа скрыть
  const handleSaveBtnClick = async () => {
    const success = await sendPost(steamUser!.steamid, value, selectedImgs);

    if (success) window.location.reload();
    // console.log(success);
  }

  if (!isEditorOpen) return <div className="posts-container">
    <div className="input-logo-container">
      <img src={steamUser ? steamUser.avatarmedium : userLogo.src} className="profile-picture" />
      <input onFocus={() => setIsEditorOpen(true)} disabled={!steamUser} type="text" id="searchInput" placeholder={steamUser ? "Share Your Thoughts..." : "You can't share your thoughts yet!"} />
    </div>
    <span className="material-symbols-outlined">edit</span>
  </div>


  return (
    <>
      <div className="text-editor-container">
        <div style={{
          position: "relative",
          width: "100%",
          flexShrink: "1"
        }}>
          <ReactQuill
            ref={quillRef}
            value={value}
            onChange={setValue}
            modules={modules}
            placeholder="Start typing here..."
            formats={[
              "header", "font", //"size",
              "bold", "italic", "underline", "strike", "blockquote",
              "list", "bullet", "indent",
              "link", "align"
            ]}
          />
          <button className="close-btn" onClick={() => {
            setIsEditorOpen(false);
            setSelectedImages(null);
            setValue("");
          }}></button>

        </div>
        <input type="file" accept="images/*" id="post-select" onChange={(e) => {
          if (!e.target.files) return;

          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImages((prevVal) => {
              if (!prevVal)
                return [reader.result as string];

              return [...prevVal, reader.result as string];
            });
          };
          reader.readAsDataURL(file);

        }} />
        <label className="post-select-label" htmlFor="post-select">
          {selectedImgs && selectedImgs.length && <>
            <div className="hover-title">Click to change picture</div>
            <img src={selectedImgs[0]} alt="uploaded image" />
          </>}
          {!selectedImgs && "Image select"}
        </label>
      </div>

      {(function () {
        // проверяем были ли введены какие-то символы
        const div = document.createElement("div");
        div.innerHTML = value;

        return !isElementEmpty(div);
      })() && <div className="text-editor-buttons-container">

          <Button onClick={handleSaveBtnClick} secondary>Send</Button>
        </div>}
    </>
  );
}

export default ShareYourThoughts;