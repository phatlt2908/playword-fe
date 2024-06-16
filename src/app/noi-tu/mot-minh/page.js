"use client";

import { useState, useEffect, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";

import wordLinkApi from "@/services/wordLinkApi";
import reportApi from "@/services/reportApi";

import SpinnerLoading from "@/components/utils/spinner-loading";
import BaseTimer from "@/components/utils/base-timer";
import WordDetail from "@/components/contents/word-detail";
import StandardModal from "@/components/contents/standard-modal";

import styles from "./page.module.scss";

const turnTime = 15;

export default function WordLinkSingle() {
  const [responseWord, setResponseWord] = useState("");
  const [responseWordDescription, setResponseWordDescription] = useState("");
  const [answerWord, setAnswerWord] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false); // The server can not find any word
  const [turn, setTurn] = useState(3); // Number of turns to answer (answer wrong 3 times => game over)
  const [point, setPoint] = useState(0);
  const [overType, setOverType] = useState();

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
          swal
            .fire({
              toast: true,
              position: "top-end",
              text: "Không tồn tại từ [" + answer + "] 😣",
              icon: "error",
              timer: 5000,
              confirmButtonText: "Yêu cầu thêm",
            })
            .then((result) => {
              if (result.isConfirmed) {
                reportApi
                  .create({
                    word: answer,
                    issueType: 1,
                  })
                  .then(() => {
                    swal.fire({
                      toast: true,
                      position: "top-end",
                      text: "Báo cáo thành công! 🤩",
                      icon: "success",
                      timer: 3000,
                      showConfirmButton: false,
                    });
                  });
              }
            });

          if (turn > 1) {
            setTurn(turn - 1);
          } else {
            onOver(1);
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

  /**
   * type = 1: Over turn
   * type = 2: Over time
   * @param {int} type
   */
  const onOver = (type) => {
    console.log("Over");
    setOverType(type);
  };

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

        {!overType && (
          <BaseTimer
            key={point}
            maxTime={turnTime}
            onOver={() => {
              onOver(2);
            }}
          />
        )}
      </div>

      {isLoading ? (
        <SpinnerLoading />
      ) : (
        <div>
          <p className="mb-4">
            <WordDetail
              styleClass="has-text-centered is-size-1 is-inline-block w-100"
              word={responseWord}
              description={responseWordDescription}
            />
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
            <p className="help is-warning is-size-6 has-text-centered has-text-weight-semibold">
              ⚠️ Bạn còn {turn} lượt nhập sai
            </p>
          )}
        </div>
      )}

      <div>
      </div>

      {overType && (
        <StandardModal
          id="game-over"
          uncloseable
          onClose={() => console.log("Restart")}
        >
          <h1 className="title is-1 has-text-centered">GAME OVER</h1>
          <p className="subtitle is-3 has-text-centered">
            {overType == 1
              ? "Hết lượt. Bạn đã trả lời sai 3 lần 😢"
              : "Hết thời gian trả lời 😢"}
          </p>
          <p className="is-size-4">Điểm số: {point}</p>
          <p className="is-size-4">Xếp hạng: 1450</p>
          <div className="buttons">
            <button className="button is-large is-primary is-outlined drawing-border">
              Chơi lại 💪
            </button>
            <button className="button is-large is-outlined drawing-border">
              Về trang chủ
            </button>
          </div>
        </StandardModal>
      )}
    </>
  );
}
