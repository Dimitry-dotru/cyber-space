import { userObj } from "@/src/utils/types/steamTypes"

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
  // тут твой код дальше
  return <></>


  // в будущем, в steamUser будет поле userbanner, в котором и будет путь к картинке нужной
  // а пока, сделай переменную userBanner, которой ты присвоишь дефолтную картинку баннера, чтобы я потом простенько
  // это все заменил
}

// это будет вот этот синий карандашик: https://prnt.sc/DbQ7z4U7GGBM
const EditBanner: React.FC = () => {
  return <></>;
}

export default UserBanner;