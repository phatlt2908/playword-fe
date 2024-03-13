import styles from "./base-header.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const BaseHeader = () => {
  return (
    <div className={styles.header}>
      <div className="icon is-medium circle-border">
        <FontAwesomeIcon icon={faUser} />
      </div>
    </div>
  );
};

export default BaseHeader;
