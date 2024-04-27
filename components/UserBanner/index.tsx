"use client"
import { userObj } from "@/src/utils/types/steamTypes"
import React from 'react';
import Image from 'next/image';
import bunner from '@/public/img/default-imgs/banner_default.webp'
import avatar from '@/public/img/default-imgs/non_authorised_user.png'
import edit_banner from '@/public/img/default-imgs/edit_banner.svg'
import "./style.css";

interface UserBannerProps {
  // null - значит что пользователь еще не авторизован, значит нужно отобразить дефолтную картинку баннера
  // и дефолтный аватар
  // дефолтный баннер: public/img/default-imgs/banner_default.webp
  // дефолтный аватар: public/img/default-imgs/non_authorised_user.png
  steamUser: userObj | null;
}

const UserBanner: React.FC<UserBannerProps> = ({
  steamUser
}) => {
  const userBanner = steamUser ? steamUser.userbanner : "/img/default-imgs/banner_default.webp";
  const handleEditClick = () => {
    // Обработчик клика по кнопке редактирования
    console.log("Edit button clicked");
  };
  // тут твой код дальше
  return <>
    <div className="image-container">
      <Image src={bunner}  alt="Banner" className="banner" />
      <Image src={steamUser ? steamUser.avatar : "/img/default-imgs/non_authorised_user.png"} width={250} height={250} alt="Avatar" className="avatar" />
      <button className="edit-button"  onClick={handleEditClick}>
      <Image src={edit_banner}  alt="edit banner" className="edit-icon"></Image>
      </button>
    </div>
  </>


  // в будущем, в steamUser будет поле userbanner, в котором и будет путь к картинке нужной
  // а пока, сделай переменную userBanner, которой ты присвоишь дефолтную картинку баннера, чтобы я потом простенько
  // это все заменил
}

// это будет вот этот синий карандашик: https://prnt.sc/DbQ7z4U7GGBM
const EditBanner: React.FC = () => {
  return <>

  </>;
}

export default UserBanner;