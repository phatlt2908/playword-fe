"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faQuestion,
  faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";

import stickApi from "@/services/stickApi";

import { b64DecodeUnicode } from "@/utils/commonUtils";

import SpinnerLoading from "@/components/utils/spinner-loading";
import BaseTimer from "@/components/utils/base-timer";
import StandardModal from "@/components/contents/standard-modal";
import UserInput from "@/components/contents/user-input";
import { useUserStore } from "@/stores/user-store";
import StickAnswerInput from "./stick-answer-input";

const turnTime = 90;

export default function StickSingle({ isLiteMode }) {
  const router = useRouter();
  const [isShowManual, setIsShowManual] = useState(!isLiteMode);
  const [characters, setCharacters] = useState([]);
  const [word, setWord] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [isIncorrectAnswer, setIsIncorrectAnswer] = useState(false);
  const [point, setPoint] = useState(0);
  const [isOver, setIsOver] = useState(false);
  const [rank, setRank] = useState();
  const [streakNum, setStreakNum] = useState(0);

  const { user, setIsFirstTime } = useUserStore();

  const timerRef = useRef();

  useEffect(() => {
    getWord();

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
      stickApi
        .getResult(point, user.code)
        .then((response) => {
          setRank(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isOver]);

  const getWord = () => {
    setIsIncorrectAnswer(false);
    setIsCheckingAnswer(true);

    stickApi
      .getWord()
      .then((response) => {
        const data = response.data;
        setCharacters(data.characters);
        setWord(b64DecodeUnicode(data.wordBase64Encoded));
        setDescription(b64DecodeUnicode(data.descriptionBase64Encoded));

        setIsCheckingAnswer(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onAnswer = (answer) => {
    setIsCheckingAnswer(true);
    stickApi
      .answer(answer)
      .then((response) => {
        if (!response.data.isSuccessful) {
          swal.fire({
            toast: true,
            position: "bottom",
            text: "[" + answer + "] Không chính xác 😣",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
          setStreakNum(0);
          setIsIncorrectAnswer(true);
          setIsCheckingAnswer(false);
        } else {
          swal.fire({
            toast: true,
            position: "bottom",
            title: "[" + response.data.wordDescription.word + "] Chính xác 😍",
            html: `<div class="limit-2-lines">${response.data.wordDescription.description}</div>`,
            icon: "success",
            timer: 5000,
            showConfirmButton: false,
          });

          timerRef.current.update(3);
          setPoint(point + characters.length + streakNum);
          setStreakNum(streakNum + 1);
          getWord();
          setIsIncorrectAnswer(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onSkip = () => {
    swal.fire({
      toast: true,
      position: "bottom",
      html: `<div class="limit-2-lines"><span class="has-text-weight-bold">${word}</span>: ${description}</div>`,
      icon: "info",
      timer: 5000,
      showConfirmButton: false,
    });

    timerRef.current.update(-5);
    setStreakNum(0);
    getWord();
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
                onClick={() => router.push(`/xep-hang?game=2`)}
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
                  <span className="is-size-4">Điểm: {point}</span>
                </div>

                {!isOver && (
                  <BaseTimer
                    ref={timerRef}
                    maxTime={turnTime}
                    onOver={() => {
                      swal
                        .fire({
                          title: "Hết giờ!",
                          timer: 1000,
                          showConfirmButton: false,
                        })
                        .then(() => {
                          setIsOver(true);
                        });
                    }}
                  />
                )}
              </div>

              <StickAnswerInput
                key={characters}
                characters={characters}
                onAnswer={onAnswer}
                onSkip={onSkip}
                isLoading={isCheckingAnswer}
                isError={isIncorrectAnswer}
              />
            </>
          )}

          {!isLiteMode && (
            <div>
              <Link
                href="/xep-hang?game=2"
                className="button p-2 cursor-pointer hover-underlined mr-2"
              >
                <FontAwesomeIcon icon={faRankingStar} size="sm" />
              </Link>
              <div
                className="button p-2 cursor-pointer hover-underlined"
                onClick={() => {
                  setIsShowManual(true);
                }}
              >
                <FontAwesomeIcon icon={faQuestion} size="sm" />
              </div>
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
              <strong>Trùm Khắc Nhập Từ</strong> là trò chơi ghép các ký tự bị
              xáo trộn thành từ có nghĩa. Bạn hãy cố gắng đạt được nhiều điểm
              nhất có thể.
            </p>
            <div className="has-text-centered is-size-2">
              K / H / Ắ / C / N / H / Ậ / P / T / Ừ
            </div>
            <h2>Luật chơi:</h2>
            <ul>
              <li>Bạn có 2 phút 30 giây</li>
              <li>
                Máy sẽ đưa ra các từ bao gồm 2 âm tiết với vị trí các chữ cái bị
                xáo trộn. Bạn phải chọn theo thứ tự các chữ cái để ghép thành từ
                có nghĩa
              </li>
              <li>Ghép thành công sẽ được cộng điểm và thêm 3 giây thời gian</li>
              <li>Số điểm được cộng sẽ tương ứng với số lượng chữ cái của từ ghép</li>
              <li>Ghép thành công liên tiếp sẽ được cộng dồn 1 điểm</li>
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
