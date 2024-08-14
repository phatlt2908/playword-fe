"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faHouse } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";

import wordLinkApi from "@/services/wordLinkApi";
import reportApi from "@/services/reportApi";

import SpinnerLoading from "@/components/utils/spinner-loading";
import BaseTimer from "@/components/utils/base-timer";
import WordDetail from "@/components/contents/word-detail";
import StandardModal from "@/components/contents/standard-modal";
import UserInput from "@/components/contents/user-input";
import { useUserStore } from "@/stores/user-store";
import AnswerInput from "./answer-input";

const turnTime = 60;

export default function WordLinkSingle({ isLiteMode }) {
  const router = useRouter();
  const [isShowManual, setIsShowManual] = useState(!isLiteMode);
  const [responseWord, setResponseWord] = useState("");
  const [responseWordDescription, setResponseWordDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false); // The server can not find any word
  const [point, setPoint] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [rank, setRank] = useState();
  const [answeredList, setAnsweredList] = useState([]);

  const { user, setIsFirstTime } = useUserStore();

  const timerRef = useRef();

  const preResponseWord = useMemo(() => {
    return responseWord.split(" ").pop() + " ";
  });

  useEffect(() => {
    init();

    const storage = localStorage.getItem("user-store");
    const storageData = JSON.parse(storage);

    if (!(storageData && storageData.state && storageData.state.isFirstTime)) {
      setIsShowManual(false);
    }
  }, []);

  useEffect(() => {
    if (!isShowManual) {
      setIsFirstTime(false);
      setIsLoading(false);
    }
  }, [isShowManual]);

  useEffect(() => {
    if (isOver) {
      wordLinkApi
        .getResult(point, user.code)
        .then((response) => {
          setRank(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isOver]);

  useEffect(() => {
    if (isFinished) {
      timerRef.current.update(5);
      setPoint(point + 5);
      setIsFinished(false);
      init();

      swal.fire({
        toast: true,
        position: "bottom",
        title: "Bí rồi...",
        icon: "info",
        timer: 500,
        showConfirmButton: false,
      });
    }
  }, [isFinished]);

  const init = () => {
    wordLinkApi
      .init()
      .then((response) => {
        setResponseWord(response.data.word);
        setAnsweredList((prev) => [...prev, response.data.word]);
        setResponseWordDescription(response.data.description);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onAnswer = (answerWord) => {
    if (answerWord === "") {
      return;
    }

    const answer = preResponseWord + answerWord;

    if (answeredList.includes(answer)) {
      swal.fire({
        toast: true,
        position: "bottom",
        text: `Từ [${answer}] đã được trả lời 😣`,
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });

      return;
    }

    wordLinkApi
      .answer({ answer: answer, answeredList: answeredList })
      .then((response) => {
        if (!response.data.isSuccessful) {
          swal
            .fire({
              toast: true,
              position: "bottom",
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
                      position: "bottom",
                      text: "Báo cáo thành công! 🤩",
                      icon: "success",
                      timer: 3000,
                      showConfirmButton: false,
                    });
                  });
              }
            });

          timerRef.current.update(-5);
        } else {
          timerRef.current.update(1);
          setPoint(point + 1);

          if (response.data.isFinished) {
            setIsFinished(true);
            return;
          }
          setResponseWord(response.data.wordDescription.word);
          setAnsweredList((prev) => [
            ...prev,
            answer,
            response.data.wordDescription.word,
          ]);
          setResponseWordDescription(response.data.wordDescription.description);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onSkip = () => {
    timerRef.current.update(-5);
    init();
  };

  return (
    <>
      {isOver ? (
        <>
          <div className="has-text-centered w-100">
            <h1 className="title is-1 base-background w-100">GAME OVER</h1>
          </div>
          <div className="has-text-centered mt-5 mb-5">
            <p className="is-size-4">Điểm số: {point}</p>
            <p className="is-size-4">
              <span>Xếp hạng: {rank ? rank : "Không xếp hạng"}</span>
              <span
                className="ml-2 is-size-6 hover-underlined cursor-pointer"
                onClick={() => router.push(`/xep-hang`)}
              >
                (Xem)
              </span>
            </p>
          </div>
          <div>
            <p className="is-size-6 mt-3 mb-4 has-text-centered">
              Nhập tên để lưu danh sử sách 😜
            </p>
            <UserInput />
            {!isLiteMode && (
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
            )}
          </div>
        </>
      ) : (
        <>
          {isLoading ? (
            <SpinnerLoading />
          ) : (
            <>
              <div className="is-flex is-flex-direction-column is-align-items-center w-100">
                <div>
                  {/* <span className="mr-2">User</span>
              <span className="icon is-large circle-border mb-4">
                <FontAwesomeIcon icon={faUser} />
              </span> */}
                  <span className="is-size-4">Điểm: {point}</span>
                </div>

                {!isOver && (
                  <BaseTimer
                    ref={timerRef}
                    maxTime={turnTime}
                    onOver={() => {
                      setIsOver(true);
                    }}
                  />
                )}
              </div>

              <div>
                <p className="mb-4">
                  <WordDetail
                    styleClass="has-text-centered is-size-1 is-inline-block w-100"
                    word={responseWord}
                    description={responseWordDescription}
                  />
                </p>

                <AnswerInput
                  key={responseWord}
                  preResponseWord={preResponseWord}
                  onAnswer={onAnswer}
                  onSkip={onSkip}
                />
              </div>
            </>
          )}

          {!isLiteMode && (
            <div
              className="icon-text p-2 cursor-pointer hover-underlined"
              onClick={() => {
                setIsShowManual(true);
              }}
            >
              <span>Hướng dẫn</span>
              <span className="icon">
                <FontAwesomeIcon icon={faBook} />
              </span>
            </div>
          )}
        </>
      )}

      {isShowManual && (
        <StandardModal id="manual" onClose={() => setIsShowManual(false)}>
          <div className="content">
            <div
              className="w-100 has-text-centered mb-4"
              onClick={() => setIsShowManual(false)}
            >
              <button className="button has-text-centered">Bắt đầu chơi</button>
            </div>
            <p>
              Đây là chế độ chơi game nối từ giữa người với máy. Bạn hãy cố gắng
              đạt được nhiều điểm nhất có thể.
            </p>
            <div className="has-text-centered">
              <Image
                src="/try.jpg"
                alt="luat choi noi tu solo"
                width={300}
                height={300}
              />
            </div>
            <h2>Luật chơi game nối từ online với máy:</h2>
            <ul>
              <li>Bạn có 1 phút</li>
              <li>
                Máy sẽ đưa ra 1 từ và bạn sẽ bắt đầu nối từ lần lượt với máy
              </li>
              <li>Nối thành công sẽ được +1 điểm</li>
              <li>
                Nếu từ bạn trả lời không có từ nào để nối (máy bó tay): bạn được
                +5 điểm và +5 giây thời gian
              </li>
              <li>Trả lời sai bị -5 giây</li>
              <li>
                Bạn có thể bỏ qua nếu từ quá khó, mỗi lần bỏ qua bạn bị -5s
              </li>
            </ul>

            <div
              className="w-100 has-text-centered mt-4"
              onClick={() => setIsShowManual(false)}
            >
              <button className="button has-text-centered">Bắt đầu chơi</button>
            </div>
          </div>
        </StandardModal>
      )}
    </>
  );
}
