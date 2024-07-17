"use client";

import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./base-footer.module.css";
import { faCommentDots, faMessage } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";

const BaseFooter = () => {
  const router = useRouter();

  return (
    <>
      <button
        className={`${styles.feedback} button is-small`}
        onClick={() => {
          router.push(`/gop-y`);
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
            position: "bottom",
            showConfirmButton: false,
            timer: 3000,
          });
        }}
      >
        <FontAwesomeIcon icon={faCommentDots} />
      </button>
    </>
  );
};

export default BaseFooter;
