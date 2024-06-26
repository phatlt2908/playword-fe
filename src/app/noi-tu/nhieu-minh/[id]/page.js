"use client";

import Image from "next/image";
import { useState, useEffect, useMemo, useRef } from "react";

import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";
import styles from "./page.module.scss";

import wordLinkApi from "@/services/wordLinkApi";
import reportApi from "@/services/reportApi";

import avatarConst from "@/constants/avatarConst";

import BrandLoading from "@/components/utils/brand-loading";
import BaseTimer from "@/components/utils/base-timer";
import WordDetail from "@/components/contents/word-detail";
import UserIcon from "@/components/contents/user-icon";
import BaseCountdown from "@/components/utils/base-countdown";
import StandardModal from "@/components/contents/standard-modal";

const turnTime = 15;
const waitingSecond = 20;

export default function WordLinkMulti({ params }) {
  const [stompClient, setStompClient] = useState();
  const [responseWord, setResponseWord] = useState("");
  const [responseWordDescription, setResponseWordDescription] = useState("");
  const [answerWord, setAnswerWord] = useState("");
  const [turnNumber, setTurnNumber] = useState(1);
  const [turn, setTurn] = useState(3); // Number of turns to answer (answer wrong 3 times => game over)
  const [currentUser, setCurrentUser] = useState({
    id: Math.random().toString(36).substring(2, 10),
    name: Math.random().toString(36).substring(2, 10),
    avatar: avatarConst.AVATAR_LIST[Math.floor(Math.random() * 5)],
  });
  const [isReady, setIsReady] = useState(false);
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const [isLoadingInit, setIsLoadingInit] = useState(true);

  // Room info
  const [roomName, setRoomName] = useState();
  const [roomUserList, setRoomUserList] = useState([]);
  const [answerUser, setAnswerUser] = useState();
  const [isRoomPreparing, setIsRoomPreparing] = useState(true);
  const [wordList, setWordList] = useState([]);

  const isAnswering = useMemo(() => {
    return answerUser && answerUser.id == currentUser.id;
  });
  const preResponseWord = useMemo(() => {
    return responseWord.split(" ").pop();
  });

  const isAnsweringRef = useRef();
  isAnsweringRef.current = isAnswering;
  const answerRef = useRef();
  answerRef.current = preResponseWord + " " + answerWord;
  const turnRef = useRef();
  turnRef.current = turn;

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (stompClient) {
      stompClient.connect({}, onConnected, onError);
    }
  }, [stompClient]);

  const connect = () => {
    console.log("Connecting websocket...");
    var socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_API_URL}/ws`);
    setStompClient(Stomp.over(socket));
  };

  const onConnected = () => {
    stompClient.subscribe(`/room/${params.id}`, onMessageReceived);
    stompClient.send(
      `/app/addUser/${params.id}`,
      {},
      JSON.stringify({ sender: currentUser, roomId: params.id, type: "JOIN" })
    );
  };

  const onError = (error) => {
    console.error("Websocket error >>> ", error);
    swal
      .fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "Lỗi không thể vào phòng 😣",
        timer: 3000,
        showConfirmButton: false,
      })
      .then(() => {
        window.location.href = "/noi-tu/nhieu-minh";
      });
  };

  const onMessageReceived = (payload) => {
    var res = JSON.parse(payload.body);
    console.log("Received message >>> : ", res);

    if (res.type === "ANSWER") {
      handleReceiveAnswer(res);
    } else {
      handleReceiveRoomInfo(res);
    }
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
    swal.fire({
      icon: "error",
      title: "Game Over",
      text:
        type == 1
          ? "Hết lượt. Bạn đã trả lời sai 3 lần 😢"
          : "Hết thời gian trả lời 😢",
      timer: 3000,
      showConfirmButton: false,
    });

    setIsReady(false);
    stompClient.send(
      `/app/over/${params.id}`,
      {},
      JSON.stringify({ sender: currentUser, roomId: params.id, type: "OVER" })
    );
  };

  const onReady = () => {
    setIsReady(true);
    stompClient.send(
      `/app/ready/${params.id}`,
      {},
      JSON.stringify({ sender: currentUser, roomId: params.id, type: "READY" })
    );
  };

  const onAnswer = () => {
    if (!answerWord) {
      return;
    }

    const answer = preResponseWord + " " + answerWord;

    // Check if answer is contained in word list
    if (wordList.includes(answer)) {
      swal.fire({
        toast: true,
        position: "top-end",
        text: `Từ [${answer}] đã được trả lời 😣`,
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });

      // Game over if over turn
      setTurn((prev) => prev - 1);
      if (turn === 1) {
        onOver(1);
      }

      return;
    }

    stompClient.send(
      `/app/answer/${params.id}`,
      {},
      JSON.stringify({
        sender: currentUser,
        roomId: params.id,
        message: answer,
      })
    );
  };

  const handleReceiveRoomInfo = (message) => {
    if (message.type === "JOIN") {
      if (message.user.id !== currentUser.id) {
        swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          text: `${message.user.name} đã vào phòng`,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } else if (message.type === "LEAVE") {
      swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        text: `${message.user.name} đã rời phòng`,
        timer: 3000,
        showConfirmButton: false,
      });
    } else if (message.type === "READY") {
      // if all of user ready, start game
      if (
        message.room.userList.every((user) => user.isReady) &&
        message.room.status === "STARTED"
      ) {
        swal
          .fire({
            title: "Bắt đầu game",
            timer: 1000,
            showConfirmButton: false,
          })
          .then(() => {
            setIsRoomPreparing(false);
            updateResponseWord(message.word);
          });
      }
    } else if (message.type === "OVER") {
      if (message.user.id !== currentUser.id) {
        swal.fire({
          icon: "info",
          toast: true,
          position: "top-end",
          text: `${message.user.name} đã bị loại`,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } else if (message.type === "END") {
      if (message.user.id === currentUser.id) {
        swal.fire({
          icon: "success",
          title: `Chúc mừng! Bạn đã chiến thắng 🎉`,
          timer: 3000,
          showConfirmButton: false,
        });
      } else if (!isAnsweringRef.current) {
        // Display winner message if curren user not playing
        swal.fire({
          icon: "info",
          title: `${message.user.name} đã chiến thắng 🎉`,
          timer: 3000,
          showConfirmButton: false,
        });
      }

      resetGame();
    }

    updateRoomInfo(message.room);
    setIsLoadingInit(false);
  };

  const handleReceiveAnswer = (message) => {
    if (message.isAnswerCorrect) {
      if (message.user.id === currentUser.id) {
        swal.fire({
          icon: "success",
          text: `Tuyệt vời! Bạn đã trả lời đúng 🤩`,
          timer: 3000,
          showConfirmButton: false,
        });

        setTurn(3);
        setAnswerWord("");
      }

      setWordList((prev) => [...prev, message.word]);
      setTurnNumber((prev) => prev + 1);
      updateRoomInfo(message.room);
      updateResponseWord(message.word);
    } else {
      if (isAnsweringRef.current) {
        swal
          .fire({
            toast: true,
            position: "top-end",
            text: "Không tồn tại từ [" + answerRef.current + "] 😣",
            icon: "error",
            timer: 5000,
            confirmButtonText: "Yêu cầu thêm",
          })
          .then((result) => {
            if (result.isConfirmed) {
              reportApi
                .create({
                  word: answerRef.current,
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

        // Game over if over turn
        setTurn((prev) => prev - 1);
        if (turnRef.current === 1) {
          onOver(1);
        }
      }
    }
  };

  const updateRoomInfo = (room) => {
    setRoomUserList(room.userList);
    let answerUser = room.userList.find((user) => user.isAnswering);
    setAnswerUser(answerUser);
    setRoomName(room.name);
  };

  const updateResponseWord = (word) => {
    setResponseWord(word.word);
    setResponseWordDescription(word.description);
  };

  const resetGame = () => {
    setIsRoomPreparing(true);
    setIsReady(false);
    setTurn(3);
  };

  const onWaitingTimeout = () => {
    window.location.href = "/noi-tu/nhieu-minh";
  };

  return (
    <>
      <div>
        <a href="/noi-tu/nhieu-minh" className={`${styles.back} icon-text`}>
          <span className="icon">
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </span>
          <span>Rời phòng</span>
        </a>
        {roomName && <p>Phòng: {roomName}</p>}
      </div>
      <div className="w-100">
        <div>
          {isReady && isAnswering && (
            <BaseTimer
              key={turnNumber}
              maxTime={turnTime}
              onOver={() => {
                onOver(2);
              }}
            />
          )}
        </div>
      </div>

      {isLoadingInit ? (
        <BrandLoading />
      ) : (
        <>
          {isRoomPreparing ? (
            <>
              {isReady ? (
                <div className="is-flex is-flex-direction-column is-align-items-center">
                  <p className="has-text-centered is-size-4 mb-2">
                    Đã sẵn sàng, chờ người chơi khác
                  </p>
                  <BrandLoading />
                </div>
              ) : (
                <div className="is-flex is-flex-direction-column is-align-items-center">
                  <div className="columns is-mobile">
                    <div
                      className="column is-narrow cursor-pointer py-2"
                      onClick={() => setIsSelectingAvatar(true)}
                    >
                      <div className="image is-32x32">
                        <Image
                          src={currentUser.avatar}
                          alt="Avatar"
                          width={100}
                          height={100}
                          priority
                        />
                      </div>
                      <div className="is-size-7 has-text-centered">Đổi</div>
                    </div>
                    <input
                      className="column input is-large drawing-border"
                      type="text"
                      value={currentUser.name}
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, name: e.target.value })
                      }
                      autoFocus
                      maxLength={20}
                    />
                  </div>
                  <button
                    className="button is-large drawing-border is-flex is-flex-direction-column is-align-items-center"
                    onClick={onReady}
                  >
                    <span>Sẵn sàng</span>
                    {roomUserList.length}
                    <BaseCountdown
                      totalTime={
                        roomUserList.length == 1
                          ? waitingSecond * 10
                          : waitingSecond
                      }
                      onTimeout={onWaitingTimeout}
                    />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div>
              <p className="mb-4">
                <WordDetail
                  styleClass="has-text-centered is-size-1 is-inline-block w-100"
                  word={responseWord}
                  description={responseWordDescription}
                />
              </p>

              {isAnswering ? (
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
                        autoFocus
                        maxLength={50}
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
                </>
              ) : (
                <div>{answerUser.name} đang trả lời</div>
              )}

              {!isReady && <div>Vui lòng đợi đến khi ván đấu kết thúc...</div>}
            </div>
          )}
        </>
      )}

      <div className="columns is-multiline is-centered is-mobile w-100">
        {roomUserList.map((user, index) => (
          <div
            key={index}
            className="column is-flex is-flex-direction-column is-align-items-center"
          >
            <UserIcon
              username={user.name}
              avatarUrl={user.avatar}
              isSelf={currentUser.id == user.id}
              isReady={isRoomPreparing && user.isReady}
              isAnswer={user.isAnswering}
              isBlur={!isRoomPreparing && !user.isReady}
            />
          </div>
        ))}
      </div>

      {isSelectingAvatar && (
        <StandardModal onClose={() => setIsSelectingAvatar(false)}>
          <h3 className="title is-3 has-text-centered mb-4">Chọn avatar</h3>
          <div className="columns is-multiline is-centered is-mobile w-100">
            {avatarConst.AVATAR_LIST.map((avatar, index) => (
              <div
                className="column is-flex is-justify-content-center"
                key={index}
                onClick={() => {
                  setCurrentUser({ ...currentUser, avatar });
                  setIsSelectingAvatar(false);
                }}
              >
                <figure className="image is-128x128">
                  <Image
                    src={avatar}
                    alt="Avatar"
                    width={100}
                    height={100}
                    priority
                  />
                </figure>
              </div>
            ))}
          </div>
        </StandardModal>
      )}
    </>
  );
}
