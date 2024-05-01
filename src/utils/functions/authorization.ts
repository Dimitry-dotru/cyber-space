import { userObj } from "../types/steamTypes";
import { getUser } from "./steamRequests";

const logoutHandler = (setSteamUser: (arg: userObj | null) => void) => {
  const sessionID = window.localStorage.getItem("sessionID");
  if (!sessionID) return;
  fetch(`http://localhost:7069/logout/?sessionID=${sessionID}`, {
    method: "post",
  })
    .then((d) => {
      if (!d.ok) {
        throw new Error("Error with logout!");
      }
      window.localStorage.removeItem("sessionID");
      setSteamUser(null);
      window.location.reload();
      return d.text();
    })
    .then((d) => console.log(d));
};

const getSessionId = (): null | string => {
  const params = new URLSearchParams(window.location.search);
  const sessionID = params.get("sessionID")
    ? params.get("sessionID")
    : window.localStorage.getItem("sessionID");

  // console.log(params.get("sessionID"));
  // return sessionID;
  if (!sessionID) return null;
  window.localStorage.setItem("sessionID", sessionID);
  const url = window.location.href.split("?")[0];
  window.history.replaceState({}, document.title, url);
  return sessionID;
};

export { logoutHandler, getSessionId };
