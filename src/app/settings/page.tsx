"use client";

import React from "react";
import Header from "@/components/Header";
import { userObj } from "@/src/utils/types/steamTypes";
import { getUser } from "@/src/utils/functions/steamRequests";
import { getSessionId } from "@/src/utils/functions/authorization";
import Image from "next/image";
import Tab from "@/components/Tab";
import Button from "@/components/Button";
import Cropper from 'react-easy-crop'
import { Point, Area } from "react-easy-crop";
import { useState, useEffect } from "react";

import "./style.css";

const Page = () => {
  const [steamUser, setSteamUser] = React.useState<userObj | null>(null);
  const [settingTab, setSettingTab] = React.useState<string>(window.location.hash.substring(1));

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submited!");
  }

  React.useEffect(() => {
    const asyncFunc = async (
      sessionID: string | null,
      setSteamUser: (arg: userObj | null) => void
    ) => {
      if (!sessionID) return;
      const data = await getUser(sessionID);
      setSteamUser(data);
      if (data) {
        document.body.style.backgroundImage = `url(${data.cyberspace_settings.public.userbgpattern})`;
      }
      window.localStorage.setItem("sessionID", sessionID!);
    }

    const sessionID = getSessionId();
    asyncFunc(sessionID, setSteamUser);

    const getAndSetSettingTab = () => {
      setSettingTab(window.location.hash.substring(1));
    }

    window.addEventListener("hashchange", getAndSetSettingTab)

    return () => {
      window.removeEventListener("hashchange", getAndSetSettingTab);
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
              <div className="change-avatar-container">
                <p className="input-title">Change avatar</p>
                <AvatarInput steamUser={steamUser} />
                <form className="user-data-form" onSubmit={submitHandler} onReset={() => window.location.reload()}>
                </form>
              </div>
            </Tab>
            <Tab title="Theme settings" openedTab={settingTab} uniqueName="theme">
              Still in develop :)
            </Tab>
          </>}
        </div>
      </div>
      <div className="buttons-container">
        <Button onClick={() => {
          const allFormToSave = document.querySelectorAll(".user-data-form") as NodeListOf<HTMLFormElement>;
          if (!allFormToSave.length) return;

          allFormToSave.forEach(el => el.reset());
        }} secondary>
          Discard
        </Button>
        <Button onClick={() => {
          const allFormToSave = document.querySelectorAll(".user-data-form") as NodeListOf<HTMLFormElement>;
          if (!allFormToSave.length) return;

          allFormToSave.forEach(el => el.requestSubmit());
        }} primary>
          Save
        </Button>
      </div>
    </main>
  </>;
};

interface AvatarInputProps {
  steamUser: userObj | null;
}

const AvatarInput: React.FC<AvatarInputProps> = ({
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
      const image = new window.Image();
      if (!imageSrc || !crop) return;
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
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

      const img = new window.Image();
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

    fetch(`${process.env.backendAddress}/change-avatar/${steamUser!.steamid}?sessionID=${getSessionId() }`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: res.replace(/^data:image\/\w+;base64,/, "") })
    }).then(d => {
      if (d.ok) {
        window.location.reload();
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
                if (d.ok) window.location.reload();
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

export default Page;