"use client";

import { useState, useEffect, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";

import wordLinkApi from "@/services/wordLinkApi";

import SpinnerLoading from "@/components/spinner-loading";
import BaseTimer from "@/components/base-timer";

import styles from "./page.module.scss";

const turnTime = 15;

export default function WordLink() {
  const [responseWord, setResponseWord] = useState("");
  const [responseWordDescription, setResponseWordDescription] = useState("");
  const [answerWord, setAnswerWord] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false); // The server can not find any word
  const [turn, setTurn] = useState(3); // Number of turns to answer (answer wrong 3 times => game over)
  const [point, setPoint] = useState(0);

  const preResponseWord = useMemo(() => {
    return responseWord.split(" ").pop();
  });

  useEffect(() => {
    setIsLoading(true);
    wordLinkApi
      .init()
      .then((response) => {
        setResponseWord(response.data.word);
        setResponseWordDescription(response.data.description);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (isFinished) {
      console.log("Finished");
    }
  }, [isFinished]);

  const onAnswer = () => {
    if (answerWord === "") {
      return;
    }

    const answer = preResponseWord + " " + answerWord;

    wordLinkApi
      .answer(answer)
      .then((response) => {
        if (!response.data.isSuccessful) {
          swal.fire({
            toast: true,
            position: "top-end",
            text: "Không tồn tại từ [" + answer + "] 😣",
            icon: "error",
            timer: 5000,
            confirmButtonText: "Yêu cầu thêm",
          });

          if (turn > 1) {
            setTurn(turn - 1);
          } else {
            onOver();
          }
        } else {
          setTurn(3);
          setPoint(point + 1);

          if (response.data.isFinished) {
            setIsFinished(true);
            return;
          }
          setResponseWord(response.data.wordDescription.word);
          setResponseWordDescription(response.data.wordDescription.description);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setAnswerWord("");
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onAnswer();
    }
  };

  const onOver = () => {
    swal.fire({
      title: "Hết giờ",
      text: "Bạn đã không trả lời kịp thời",
      icon: "error",
      confirmButtonText: "Thử lại",
    });
  }

  return (
    <>
      <div className="is-flex is-flex-direction-column is-align-items-center w-100">
        <div>
          <span className="mr-2">User</span>
          <span className="icon is-large circle-border mb-4">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <span className="ml-2">Điểm: {point}</span>
        </div>

        <BaseTimer key={point} maxTime={turnTime} onOver={onOver} />
      </div>

      {isLoading ? (
        <SpinnerLoading />
      ) : (
        <div>
          <p
            className="has-text-centered is-size-1 mb-4"
            title={responseWordDescription}
          >
            {responseWord}
          </p>

          <div className="field has-addons">
            <div className="control is-large">
              <a className="button is-static is-large">{preResponseWord}</a>
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
                onClick={onAnswer}
              >
                <span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
          </div>
          {turn < 3 && (
            <p className="help is-danger is-size-6 has-text-centered">
              ⚠️ Bạn còn {turn} lượt nhập sai
            </p>
          )}
        </div>
      )}

      <div>
        <div>ABC</div>
        <div>DEF</div>
      </div>
    </>
  );
}
