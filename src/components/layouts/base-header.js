import styles from "./base-header.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const BaseHeader = () => {
  return (
    <div className={styles.header}>
      <Link href="/">Chơi chữ</Link>
      <div>Noi tu</div>
      <div className="icon is-medium circle-border">
        <FontAwesomeIcon icon={faUser} />
      </div>
    </div>
  );
};

export default BaseHeader;
