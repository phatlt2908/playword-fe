import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

import StandardModal from "@/components/contents/standard-modal";

import swal from "sweetalert2";

import reportApi from "@/services/reportApi";

const WordDetail = ({ word, description, styleClass }) => {
  const [isShowDescription, setIsShowDescription] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const report = () => {
    reportApi
      .create({
        word: word,
        issueType: 2,
      })
      .then(() => {
        swal.fire({
          toast: true,
          position: "bottom",
          text: "Báo cáo thành công! 🤩",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      })
      .finally(() => {
        setIsReported(true);
      });
  };

  return (
    <>
      <a className={`${styleClass} hover-underlined`} onClick={() => setIsShowDescription(true)}>
        {word}
      </a>

      {isShowDescription && (
        <StandardModal
          id="word-description"
          onClose={() => setIsShowDescription(false)}
        >
          <div className="box">
            <div className="is-flex is-justify-content-space-between">
              <h3 className="title is-3">{word}</h3>
              {!isReported && (
                <button
                  className="button is-danger is-text drawing-border has-text-danger"
                  onClick={report}
                >
                  <span>Báo lỗi</span>
                  <span className="icon">
                    <FontAwesomeIcon icon={faFlag} />
                  </span>
                </button>
              )}
            </div>
            <p>
              <pre>{description}</pre>
            </p>

            <div
              className="w-100 has-text-centered mt-4"
              onClick={() => setIsShowDescription(false)}
            >
              <button className="button has-text-centered">Đóng</button>
            </div>
          </div>
        </StandardModal>
      )}
    </>
  );
};

export default WordDetail;
