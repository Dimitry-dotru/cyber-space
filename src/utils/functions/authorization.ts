import { userObj } from "../types/steamTypes";
import { getUser } from "./steamRequests";

const logoutHandler = (setSteamUser: (arg: userObj | null) => void) => {
  const sessionID = global.window.localStorage.getItem("sessionID");
  if (!sessionID) return;
  fetch(`${process.env.backendAddress}/logout/?sessionID=${sessionID}`, {
    method: "post",
  })
    .then((d) => {
      if (!d.ok) {
        throw new Error("Error with logout!");
      }
      global.window.localStorage.removeItem("sessionID");
      setSteamUser(null);
      global.window.location.reload();
      return d.text();
    })
    .then((d) => console.log(d));
};

const getSessionId = (): null | string => {
  const params = new URLSearchParams(global.window.location.search);
  const sessionID = params.get("sessionID")
    ? params.get("sessionID")
    : global.window.localStorage.getItem("sessionID");

  // console.log(params.get("sessionID"));
  // return sessionID;
  if (!sessionID) return null;
  global.window.localStorage.setItem("sessionID", sessionID);
  const url = global.window.location.href.split("?")[0];
  global.window.history.replaceState({}, global.document.title, url);
  return sessionID;
};

const authOperation = async (
  setSteamUser: (arg: userObj | null) => void
) => {
  const sessionID = getSessionId();
  if (!sessionID) return;
  const data = await getUser(sessionID);
  setSteamUser(data);
  if (data) {
    global.document.body.style.backgroundImage = `url(${data.cyberspace_settings.public.userbgpattern})`;
  }
  global.window.localStorage.setItem("sessionID", sessionID!);
};

export { logoutHandler, getSessionId, authOperation };
