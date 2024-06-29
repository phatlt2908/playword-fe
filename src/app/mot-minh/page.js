"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHouse } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";

import wordLinkApi from "@/services/wordLinkApi";
import reportApi from "@/services/reportApi";

import SpinnerLoading from "@/components/utils/spinner-loading";
import BaseTimer from "@/components/utils/base-timer";
import WordDetail from "@/components/contents/word-detail";
import StandardModal from "@/components/contents/standard-modal";

const turnTime = 15;

// export const metadata = {
//   title: 'Một mình',
//   description: "Chơi nối từ một mình, solo với máy để đạt điểm số cao nhất có thể 🚀",
// };

export default function WordLinkSingle() {
  const [responseWord, setResponseWord] = useState("");
  const [responseWordDescription, setResponseWordDescription] = useState("");
  const [answerWord, setAnswerWord] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false); // The server can not find any word
  const [turn, setTurn] = useState(3); // Number of turns to answer (answer wrong 3 times => game over)
  const [point, setPoint] = useState(0);
  const [overType, setOverType] = useState();
  const [rank, setRank] = useState();

  const preResponseWord = useMemo(() => {
    return responseWord.split(" ").pop();
  });

  useEffect(() => {
    setIsLoading(true);
    init();
  }, []);

  useEffect(() => {
    if (isFinished) {
      swal
        .fire({
          title: "Bí rồi...",
          icon: "info",
          timer: 500,
          showConfirmButton: false,
        })
        .then(() => {
          init();
        });
    }
  }, [isFinished]);

  const init = () => {
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
  };

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
    setOverType(type);

    wordLinkApi
      .getResult(point)
      .then((response) => {
        setRank(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="is-flex is-flex-direction-column is-align-items-center w-100">
        <div>
          {/* <span className="mr-2">User</span>
          <span className="icon is-large circle-border mb-4">
            <FontAwesomeIcon icon={faUser} />
          </span> */}
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

      <div></div>

      {overType && (
        <StandardModal
          id="game-over"
          uncloseable
          onClose={() => console.log("Restart")}
        >
          <div className="has-text-centered">
            <h1 className="title is-1 base-background">GAME OVER</h1>
            <h3 className="subtitle is-3 mb-5">
              {overType == 1
                ? "Hết lượt. Bạn đã trả lời sai 3 lần 😢"
                : "Hết thời gian trả lời 😢"}
            </h3>
            <p className="is-size-4">Điểm số: {point}</p>
            <p className="is-size-4">
              Xếp hạng: {rank ? rank : "Không xếp hạng"}
            </p>
            <div className="buttons is-justify-content-center mt-5">
              <button
                className="button is-large drawing-border"
                onClick={() => location.reload()}
              >
                Chơi lại 💪
              </button>
              <Link href="/" className="button is-large drawing-border">
                <span className="icon">
                  <FontAwesomeIcon icon={faHouse} />
                </span>
                <span>Về trang chủ</span>
              </Link>
            </div>
          </div>
        </StandardModal>
      )}
    </>
  );
}
