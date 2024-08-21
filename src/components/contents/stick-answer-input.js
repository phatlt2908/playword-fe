"use client";

import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward, faRotate } from "@fortawesome/free-solid-svg-icons";

import styles from "./stick-answer-input.module.css";
import BrandLoading from "../utils/brand-loading";

const StickAnswerInput = ({
  characters,
  onAnswer,
  onSkip,
  isLoading,
  isError,
}) => {
  const [inputCharacters, setInputCharacters] = useState([]);
  const [answers, setAnswers] = useState("");
  const [isInputError, setIsInputError] = useState(false);
  const hasSkip = !!onSkip;

  useEffect(() => {
    setIsInputError(isError);
  }, [isError]);

  useEffect(() => {
    setInputCharacters(characters);
  }, [characters]);

  const answer = (answer) => {
    onAnswer(answer);

    setInputCharacters(characters);
    setAnswers("");
  };

  const onChooseCharacter = (index) => () => {
    const character = inputCharacters[index];
    const newAnswers = answers + character;
    let newInputCharacters = [...inputCharacters];
    newInputCharacters[index] = "";

    setAnswers(newAnswers);
    setInputCharacters(newInputCharacters);

    if (newInputCharacters.every((character) => character === "")) {
      answer(newAnswers);
    }
  };

  const onReset = () => {
    setInputCharacters(characters);
    setAnswers("");
  };

  return (
    <>
      <div>
        <div className="is-justify-content-center">
          <div className={`${styles.answer} is-size-2 has-text-centered`}>
            {answers}
          </div>
        </div>

        {isLoading ? (
          <BrandLoading />
        ) : (
          <div
            className={`${styles.inputZone} ${
              isInputError ? "anim-shake" : ""
            } is-flex is-align-items-center is-justify-content-center w-100 trans-float-left`}
          >
            <div className="has-text-centered w-100">
              {inputCharacters.map((character, index) => (
                <div
                  key={index}
                  className={`${styles.character} ${index != 0 ? "ml-2" : ""} ${
                    isInputError ? " anim-warning-color" : ""
                  } button p-5 cursor-pointer mb-2`}
                  onClick={onChooseCharacter(index)}
                >
                  <div className="is-size-4">{character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <hr />

        <div className="is-flex is-flex-direction-column is-align-items-center">
          <div className="button p-2 cursor-pointer" onClick={onReset}>
            <span>Chọn lại</span>
            <span className="icon">
              <FontAwesomeIcon icon={faRotate} />
            </span>
          </div>
          {hasSkip && (
            <div className="w-100 has-text-centered">
              <button className="button is-text" onClick={onSkip}>
                <span>Bỏ qua</span>
                <span className="icon">
                  <FontAwesomeIcon icon={faForward} />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StickAnswerInput;
