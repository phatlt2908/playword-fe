import Image from "next/image";

import DotLoading from "../utils/dot-loading";

import styles from "./user-icon.module.css";

const UserIcon = ({
  username,
  avatarUrl,
  isSelf,
  isReady,
  isAnswer,
  isBlur,
}) => {
  return (
    <>
      <div className={`${styles.icon} ${isBlur && styles.opacityImage}`}>
        {isReady && <div className={styles.ready}>Sẵn sàng</div>}
        <div className="image is-64x64">
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={100}
            height={100}
            priority
          />
        </div>
        <span
          className={`is-size-6 ${
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
