"use client";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./base-footer.module.css";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import StandardModal from "../contents/standard-modal";
import Feedback from "../contents/feedback";
import BaseChat from "../contents/base-chat";

import { useUserStore } from "@/stores/user-store";

const BaseFooter = () => {
  const { user } = useUserStore();
  const [isOpenFeedback, setIsOpenFeedback] = useState(false);

  return (
    <>
      <button
        className={`${styles.feedback} button is-small`}
        onClick={() => {
          setIsOpenFeedback(true);
        }}
      >
        <span>Góp ý</span>
        <span className="icon">
          <FontAwesomeIcon icon={faMessage} size="xs" />
        </span>
      </button>

      {user.code && <BaseChat />}

      {isOpenFeedback && (
        <StandardModal id="feedback" onClose={() => setIsOpenFeedback(false)}>
          <Feedback />
        </StandardModal>
      )}
    </>
  );
};

export default BaseFooter;
