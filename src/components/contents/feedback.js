"use client";

import { useEffect, useState } from "react";

import UserInput from "./user-input";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { useUserStore } from "@/stores/user-store";
import feedbackApi from "@/services/feedbackApi";
import swal from "sweetalert2";

const Feedback = () => {
  const { user } = useUserStore();
  const [content, setContent] = useState("");
  const [isDisabledSend, setIsDisabledSend] = useState(true);

  const sendFeedback = () => {
    if (content) {
      feedbackApi.send({ userCode: user.code, content: content }).then(() => {
        swal.fire({
          title: "Cảm ơn bạn 🥰",
          toast: true,
          icon: "success",
          position: "bottom",
          showConfirmButton: false,
          timer: 3000,
        });

        setIsDisabledSend(true);
      });
    } else {
      swal.fire({
        title: "Vui lòng nhập nội dung 🥺",
        toast: true,
        icon: "warning",
        position: "bottom",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  useEffect(() => {
    if (content) {
      setIsDisabledSend(false);
    } else {
      setIsDisabledSend(true);
    }
  }, [content]);

  return (
    <>
      <div className="mt-6 w-100">
        <UserInput />
      </div>
      <div className="control mt-6 w-100">
        <textarea
          className="textarea"
          placeholder="Phản hồi và góp ý của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {isDisabledSend ? (
        <button disabled className="button mt-4">
          <span>Gửi</span>
          <span className="icon">
            <FontAwesomeIcon icon={faPaperPlane} size="xs" />
          </span>
        </button>
      ) : (
        <button className="button mt-4" onClick={() => sendFeedback()}>
          <span>Gửi</span>
          <span className="icon">
            <FontAwesomeIcon icon={faPaperPlane} size="xs" />
          </span>
        </button>
      )}
    </>
  );
};

export default Feedback;
