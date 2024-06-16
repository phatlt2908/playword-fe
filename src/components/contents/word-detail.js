import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

import StandardModal from "@/components/contents/standard-modal";

import reportApi from "@/services/reportApi";

const WordDetail = ({ word, description, styleClass }) => {
  const [isShowDescription, setIsShowDescription] = useState(false);

  const report = () => {
    reportApi.create({
      word: word,
      issueType: 0,
    });
  };

  return (
    <>
      <a
        className={styleClass}
        onClick={() => setIsShowDescription(true)}
      >
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
              <button
                className="button is-danger is-outlined drawing-border"
                onClick={report}
              >
                <span>Báo lỗi</span>
                <span className="icon">
                  <FontAwesomeIcon icon={faFlag} />
                </span>
              </button>
            </div>
            <p>
              <pre>{description}</pre>
            </p>
          </div>
        </StandardModal>
      )}
    </>
  );
};

export default WordDetail;
