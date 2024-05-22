export type postObj = {
  steamid: string;
  personaname: string;
  postcreated: string;
  postbody: string;
  likes: number;
  comments: number;
  postid: string;
};

export type commentObj = {
  steamid: string;
  personaname: string;
  content: string;
  commentdate: string;
};

export type likeObj = {
  steamid: string;
  personaname: string;
  likedat: string;
};