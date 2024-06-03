"use client"

import React from "react";
import Header from "@/components/Header";
import { userObj } from "@/src/utils/types/steamTypes";
import { authOperation, getSessionId } from "@/src/utils/functions/authorization";
import Tab from "@/components/Tab";
import Button from "@/components/Button";
import Cropper from 'react-easy-crop'
import { Point, Area } from "react-easy-crop";
import { useState, useEffect } from "react";
import { v4 as uuid4 } from "uuid";

import "./style.css";

const Page = () => {
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);
  const [settingTab, setSettingTab] = React.useState<string>("");

  React.useEffect(() => {
    if (!steamUser) {
      authOperation(setSteamUser);
    }
    const getAndSetSettingTab = () => {
      setSettingTab(global.window.location.hash.substring(1));
    }

    setSettingTab(global.window.location.hash.substring(1));
    global.window.addEventListener("hashchange", getAndSetSettingTab);

    return () => {
      global.window.removeEventListener("hashchange", getAndSetSettingTab);
    }
  }, []);

  return <>
    <Header steamUser={steamUser} setSteamUser={setSteamUser} />
    <main className="settings-page block-primary-rounded p-25">
      <h3 className="page-title">
        <span className="material-symbols-outlined">settings</span>
        Settings
      </h3>
      <div className="settings-content">
        <div className="settings-body">
          {steamUser && <>
            <Tab title="User profile" openedTab={settingTab} uniqueName="user-profile">
              <UserProfileSetting steamUser={steamUser} />
            </Tab>
            <Tab title="Theme settings" openedTab={settingTab} uniqueName="theme">
              <ThemeSettings steamid={steamUser.steamid} />
            </Tab>
          </>}

          {!steamUser && <h2>Authorise to visit this page :)</h2>}
        </div>
      </div>
    </main>
  </>;
};

const UserProfileSetting: React.FC<{ steamUser: userObj; }> = ({
  steamUser
}) => {
  const [changeNameState, setChangeNameState] = useState<"success" | "sending" | "error" | null>(null);
  const [enteredName, setEnteredName] = useState<string>(steamUser.personaname);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submited!");
  }

  const changeName = async () => {
    if (enteredName === steamUser.personaname) return;
    const sessionID = global.window.localStorage.getItem("sessionID");

    if (!sessionID) return;
    setChangeNameState("sending");

    const data = await fetch(`${process.env.backendAddress}/username/${enteredName}?sessionID=${sessionID}`, { method: "post" });

    setTimeout(() => {
      if (!data.ok) {
        setChangeNameState("error");
        setTimeout(() => setChangeNameState(null), 1000);
        console.error(data);
        return;
      }

      setChangeNameState("success");

      setTimeout(() => {
        setChangeNameState(null);
      }, 2000);
    }, 1000);


  }

  return <>
    <div className="change-avatar-container">
      <p className="input-title">Change avatar</p>
      <AvatarInput steamUser={steamUser} />
      <form className="user-data-form" onSubmit={submitHandler} onReset={() => global.window.location.reload()}>
      </form>
    </div>

    <div className="user-info-container">
      <div className="labeled-input-container">
        <label htmlFor="personaname">User name</label>
        <input defaultValue={steamUser.personaname} id="personaname" type="text" maxLength={18} onChange={(e) => setEnteredName(e.currentTarget.value)} placeholder="Enter your new name here..." name="personaname" />
        <Button onClick={changeName}>
          {!changeNameState && "Save"}
          {changeNameState === "sending" && "Saving..."}
          {changeNameState === "error" && "Error with saving..."}
          {changeNameState === "success" && "Saved!"}
        </Button>
      </div>
      {/* <div className="checkbox-input-container">
        <input defaultValue={steamUser.personaname} id="achievements-visibility" type="checkbox" name="achievements-visibility" />
        <label htmlFor="achievements-visibility">Show my achievements</label>
      </div>
      <div className="checkbox-input-container">
        <input defaultValue={steamUser.personaname} id="timeplayed-visibility" type="checkbox" name="personaname" />
        <label htmlFor="timeplayed-visibility">Show my time played</label>
      </div> */}
    </div>
  </>
}

const ThemeSettings: React.FC<{ steamid: string }> = ({ steamid }) => {
  const [selectedBgPattern, setSelectedPattern] = useState<string>("");
  const [patternsList, setPatternsList] = useState([]);

  const changeBgPicture = async (src: string) => {
    if (selectedBgPattern === src) return;

    const sessionID = global.window.localStorage.getItem("sessionID");

    if (!sessionID) return;

    const data = await fetch(`${process.env.backendAddress}/bg-patterns/?url=${src}&sessionID=${sessionID}`, { method: "post" });

    if (!data.ok) {
      console.error("Can't set image", data);
      return;
    }
    const body = document.querySelector("body");
    if (body) {
      setSelectedPattern(src);
      body.style.backgroundImage = `url(${src})`;
    }
  };

  const getPatternsList = async () => {
    const data = await fetch(`${process.env.backendAddress}/bg-patterns`);

    if (!data.ok) {
      console.log(data);
      return;
    }

    const list = await data.json();
    setPatternsList(list);
  }

  useEffect(() => {
    getPatternsList();
    const url = global.document.body.style.backgroundImage;
    const urlMatch = url.match(/url\("([^"]+)"\)/);

    setSelectedPattern(urlMatch![1]);
  }, []);

  return <>
    <div className="bg-patterns-container">
      <h3>Choose your background image pattern</h3>
      <div className="bg-patterns-list">
        {!patternsList && "Loading..."}
        {patternsList && patternsList.length === 0 && "No pictures available :("}
        {patternsList && patternsList.length !== 0 && patternsList.map((el) => {
          return <img className={`${selectedBgPattern === el ? "selected" : ""}`} key={uuid4()} onClick={() => changeBgPicture(el)} src={el} alt="Bg pattern" />;
        })}
      </div>
    </div>
    <div className="d-flex direction-column gap-5">
      <h3>Change banner image</h3>
      <BannerInput steamid={steamid} />
    </div>

  </>;
};

const AvatarInput: React.FC<{ steamUser: userObj | null; }> = ({
  steamUser
}) => {
  const zoomStep = .2;

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imgLink, setImgLink] = useState<string | null>(null);
  // const [sendingImg]
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [imageOrientation, setImgOrientation] = useState<"landscape" | "portrait" | "square">("square");

  const [cropedPixelParams, setCropedPixelParams] = useState<Area>();

  const changeZoom = (operator: "+" | "-") => {
    const increaseZoom = () => {
      console.log(zoom);
      if (zoom + zoomStep > 3) setZoom(3);
      else setZoom(zoom + zoomStep);
    }

    const decreaseZoom = () => {
      if (zoom - zoomStep < 1) setZoom(1);
      else setZoom(zoom - zoomStep);
    }

    switch (operator) {
      case "+": increaseZoom(); break;
      case "-": decreaseZoom(); break;
    }
  }

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCropedPixelParams(croppedAreaPixels);
  }

  const getCroppedImg = (imageSrc: string | undefined, crop: Area | undefined): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new global.window.Image();
      if (!imageSrc || !crop) return;
      image.src = imageSrc;
      image.onload = () => {
        const canvas = global.document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
          );
          canvas.toBlob(blob => {
            const reader = new FileReader();
            if (blob) reader.readAsDataURL(blob);
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
          }, 'image/webp');
        } else {
          reject(new Error('Не удалось получить контекст canvas'));
        }
      };
      image.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      const img = new global.window.Image();
      img.onload = () => {
        const { width, height } = img;

        if (width > height) setImgOrientation("landscape");
        else if (width < height) setImgOrientation("portrait");
        else setImgOrientation("square");

      };
      img.src = imageUrl;

      const reader = new FileReader();
      reader.onloadend = () => {
        setImgLink(reader.result as string);
      };
      reader.readAsDataURL(file);
      // setImgLink(imageUrl);
    }
  };

  const submitHandler = async (e: any) => {
    if (!imgLink) return;
    e.preventDefault();

    const res = await getCroppedImg(imgLink, cropedPixelParams);

    fetch(`${process.env.backendAddress}/change-avatar/${steamUser!.steamid}?sessionID=${getSessionId()}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: res.replace(/^data:image\/\w+;base64,/, "") })
    }).then(d => {
      if (d.ok) {
        global.window.location.reload();
      }
      else {
        console.error(`Status: ${d.status}\nMessage:${d.statusText}`);
      }
    })
  }

  return (
    steamUser &&
    <form onSubmit={submitHandler}>
      <div className={`crop-container ${!imgLink && "inactive"} ${imageOrientation}`}>
        {!imgLink &&
          <label htmlFor="avatar-change">Change my avatar...</label>
        }
        {imgLink &&
          <Cropper
            image={imgLink}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="round"
            showGrid={showGrid}
          />
        }
      </div>
      <div className="crop-image-controls">
        {imgLink &&
          <div className="justify-between w-max">
            <div className="d-flex gap-5 items-center">
              <input onChange={(e) => setShowGrid(e.target.checked)} type="checkbox" id="toggle-grid-show" />
              <label htmlFor="toggle-grid-show">Show grid</label>
            </div>
            <div className="zoom-btns">
              <Button disabled={!imgLink} secondary onClick={() => changeZoom("+")}>+</Button>
              <Button disabled={!imgLink} secondary onClick={() => changeZoom("-")}>-</Button>
            </div>
          </div>
        }
        <div className="d-flex gap-5 justify-between">
          <label className="btn btn-secondary btn-outlined" htmlFor="avatar-change">
            Change picture
            <input onChange={handleFileChange} accept="image/*" type="file" style={{ display: "none" }} id="avatar-change" />
          </label>
          <Button primary outlined onClick={() => {
            fetch(`${process.env.backendAddress}/restore-avatar/${steamUser!.steamid}?sessionID=${getSessionId()}`, { method: "post" })
              .then(d => {
                if (d.ok) global.window.location.reload();
              })
          }}>Return steam avatar</Button>
          {imgLink &&
            <Button disabled={!imgLink} type="submit" primary outlined>Save</Button>
          }
        </div>
      </div>
    </form>
  )
}

const BannerInput: React.FC<{steamid: string}> = ({ steamid }) => {
  const zoomStep = .2;

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imgLink, setImgLink] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(false);

  const [cropedPixelParams, setCropedPixelParams] = useState<Area>();

  const changeZoom = (operator: "+" | "-") => {
    const increaseZoom = () => {
      console.log(zoom);
      if (zoom + zoomStep > 3) setZoom(3);
      else setZoom(zoom + zoomStep);
    }

    const decreaseZoom = () => {
      if (zoom - zoomStep < 1) setZoom(1);
      else setZoom(zoom - zoomStep);
    }

    switch (operator) {
      case "+": increaseZoom(); break;
      case "-": decreaseZoom(); break;
    }
  }

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCropedPixelParams(croppedAreaPixels);
  }

  const getCroppedImg = (imageSrc: string | undefined, crop: Area | undefined): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new global.window.Image();
      if (!imageSrc || !crop) return;
      image.src = imageSrc;
      image.onload = () => {
        const canvas = global.document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
          );
          canvas.toBlob(blob => {
            const reader = new FileReader();
            if (blob) reader.readAsDataURL(blob);
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
          }, 'image/webp');
        } else {
          reject(new Error('Не удалось получить контекст canvas'));
        }
      };
      image.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      const img = new global.window.Image();
      img.onload = () => {
        const { width, height } = img;

      };
      img.src = imageUrl;

      const reader = new FileReader();
      reader.onloadend = () => {
        setImgLink(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // const submitHandler = async (e: any) => {
  //   if (!imgLink) return;
  //   e.preventDefault();

  //   const res = await getCroppedImg(imgLink, cropedPixelParams);

  //   fetch(`${process.env.backendAddress}/change-avatar/`, {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ image: res.replace(/^data:image\/\w+;base64,/, "") })
  //   }).then(d => {
  //     if (d.ok) {
  //       global.window.location.reload();
  //     }
  //     else {
  //       console.error(`Status: ${d.status}\nMessage:${d.statusText}`);
  //     }
  //   })
  // }

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imgLink || !cropedPixelParams) return;

    const croppedImgLink = await getCroppedImg(imgLink, cropedPixelParams);
    const image = await fetch(croppedImgLink).then((res) => res.blob());
    const formData = new FormData();
    formData.append("image", image, `${steamid}-user_profile_banner_image.webp`);
    formData.append("steamid", steamid);

    fetch(`${process.env.backendAddress}/change-banner?sessionID=${getSessionId()}`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          global.window.location.reload();
        } else {
          console.error(`Status: ${response.status}\nMessage:${response.statusText}`);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <form onSubmit={submitHandler}>
      <div className={`crop-container banner-crop-container ${!imgLink && "inactive"}`}>
        {!imgLink &&
          <label htmlFor="banner-change">Change banner picture...</label>
        }
        {imgLink &&
          <Cropper
            image={imgLink}
            crop={crop}
            zoom={zoom}
            
            aspect={16 / 9}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            cropShape="rect"
            showGrid={showGrid}
          />
        }
      </div>
      <div className="crop-image-controls">
        {imgLink &&
          <div className="justify-between w-max">
            <div className="d-flex gap-5 items-center">
              <input onChange={(e) => setShowGrid(e.target.checked)} type="checkbox" id="toggle-grid-show-1" />
              <label htmlFor="toggle-grid-show-1">Show grid</label>
            </div>
            <div className="zoom-btns">
              <Button disabled={!imgLink} secondary onClick={() => changeZoom("+")}>+</Button>
              <Button disabled={!imgLink} secondary onClick={() => changeZoom("-")}>-</Button>
            </div>
          </div>
        }
        <div className="d-flex gap-5 justify-between">
          <label className="btn btn-secondary btn-outlined" htmlFor="banner-change">
            Change picture
            <input onChange={handleFileChange} accept="image/*" type="file" style={{ display: "none" }} id="banner-change" />
          </label>
          {imgLink &&
            <Button disabled={!imgLink} type="submit" primary outlined>Save</Button>
          }
        </div>
      </div>
    </form>
  )
}

export default Page;