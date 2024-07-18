"use client";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faForward } from "@fortawesome/free-solid-svg-icons";

const AnswerInput = ({ preResponseWord, onAnswer, onSkip }) => {
  const [answerWord, setAnswerWord] = useState("");
  const hasSkip = !!onSkip;

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      answer();
    }
    if (e.key === "Escape" && hasSkip) {
      onSkip();
    }
  };

  const answer = () => {
    onAnswer(answerWord);
    setAnswerWord("");
  };

  return (
    <>
      <div className="field has-addons">
        <div className="control is-large">
          <a className="button is-large">{preResponseWord}</a>
        </div>
        <div className="control is-large">
          <input
            onKeyDown={handleKeyDown}
            className="input is-large"
            type="text"
            placeholder="..."
            value={answerWord}
            onChange={(e) => setAnswerWord(e.target.value)}
          />
        </div>
        <div className="control">
          <button
            className="button is-large transform-hover"
            onClick={() => answer(answerWord)}
          >
            <span>
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </button>
        </div>
      </div>

      {hasSkip && (
        <div className="w-100 has-text-centered" onClick={onSkip}>
          <button className="button is-text is-medium">
            <span>
              Bỏ qua <span className="is-size-7">(esc)</span>
            </span>
            <span className="icon">
              <FontAwesomeIcon icon={faForward} />
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default AnswerInput;
