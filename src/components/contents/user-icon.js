import Image from "next/image";

import avatarConst from "@/constants/avatarConst";
import DotLoading from "../utils/dot-loading";

import styles from "./user-icon.module.css";

const UserIcon = ({ username, isSelf, isReady, isAnswer }) => {
  return (
    <>
      <div className={styles.icon}>
        {isReady && <div className={styles.ready}>Sẵn sàng</div>}
        <div className="image is-64x64">
          <Image
            src={avatarConst.AVATAR_LIST[Math.floor(Math.random() * 5)]}
            alt="Avatar"
            width={100}
            height={100}
            priority
          />
        </div>
        <span
          className={`is-size-7 ${
            isSelf && "has-text-weight-bold has-text-success"
          }`}
        >
          {username}
        </span>
        {isAnswer && <DotLoading />}
      </div>
    </>
  );
};

export default UserIcon;
