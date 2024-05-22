import { postObj } from "../types/postsTypes";

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
const sendPost = async (steamid: string, postContent: string) => {
  const data = await fetch(`${process.env.backendAddress}/posts/${steamid}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postContent: postContent }),
  });

  if (!data.ok) console.error(data.text);

  return data.ok;
};

export { getAllPosts, sendPost };
