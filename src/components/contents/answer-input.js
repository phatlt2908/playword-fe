"use client";

import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faForward } from "@fortawesome/free-solid-svg-icons";

import styles from "./answer-input.module.css";

const AnswerInput = ({ preResponseWord, onAnswer, onSkip }) => {
  const [answerWord, setAnswerWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const hasSkip = !!onSkip;

  useState(() => {
    if (preResponseWord) {
      setInputValue(preResponseWord);
    }
  }, [preResponseWord]);

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
    
    setInputValue(preResponseWord);
    setAnswerWord("");
  };

  return (
    <>
      <div className="field has-addons">
        <div className="control is-large">
          <input
            onKeyDown={handleKeyDown}
            className="input is-large"
            type="text"
            placeholder="..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(
                preResponseWord +
                  e.target.value.substring(preResponseWord.length)
              );
              setAnswerWord(e.target.value.substring(preResponseWord.length));
            }}
            autoFocus
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
        <div className="w-100 has-text-centered">
          <button className="button is-text is-medium" onClick={onSkip}>
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
