"use client";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./base-footer.module.css";
import { faCommentDots, faMessage } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";
import StandardModal from "../contents/standard-modal";
import Feedback from "../contents/feedback";

const BaseFooter = () => {
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
      <button
        className={`${styles.chat}`}
        onClick={() => {
          swal.fire({
            title: "Tính năng đang được phát triển...",
            toast: true,
            icon: "info",
            position: "top",
            showConfirmButton: false,
            timer: 3000,
          });
        }}
      >
        <FontAwesomeIcon icon={faCommentDots} />
      </button>

      {isOpenFeedback && (
        <StandardModal id="feedback" onClose={() => setIsOpenFeedback(false)}>
          <Feedback />
        </StandardModal>
      )}
    </>
  );
};

export default BaseFooter;
