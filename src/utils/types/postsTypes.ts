export type postObj = {
  steamid: string;
  personaname: string;
  postcreated: string;
  postbody: string;
  likes: likeObj[];
  comments: number;
  postid: string;
  postimages: string[];
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