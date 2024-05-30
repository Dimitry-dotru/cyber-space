import { postObj, likeObj } from "../types/postsTypes";
import { userObj } from "../types/steamTypes";

const getAllPosts = async (steamid: string) => {
  const data = await fetch(`${process.env.backendAddress}/posts/${steamid}`);

  if (!data.ok) {
    console.error(data.text);
    return null;
  }

  const allPosts = (await data.json()) as postObj[];
  return allPosts;
};

// returns true or false, depends on success of post creation
const sendPost = async (steamid: string, postContent: string, images: string[] | null) => {
  const data = await fetch(`${process.env.backendAddress}/posts/${steamid}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postContent: postContent, postImages: images }),
  });

  if (!data.ok) console.error(data.text);

  return data.ok;
};

const sendLike = async (steamUserViewer: userObj, post: postObj) => {
  // sending like, and getting returns
    const sessionID = global.window.localStorage.getItem("sessionID");

    if (!sessionID) {
      console.log("No session id");
      return null;
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
      return null;
    }

    const likes = (await data.json() as likeObj[]);

    return likes;
}

const deletePost = async (postid: string) => {
  const sessionID = window.localStorage.getItem("sessionID");
  if (!sessionID) {
    console.error("Cannot get session id");
    return;
  }
  const data = await fetch(`${process.env.backendAddress}/posts/${postid}?sessionID=${sessionID}`, {
    method: "delete"
  })

  if (data.ok) {
    global.window.location.reload();
  }
  else {
    console.log(data);
  }

}

export { getAllPosts, sendPost, sendLike, deletePost };
