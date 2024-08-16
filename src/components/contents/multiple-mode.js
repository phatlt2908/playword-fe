"use client";

import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";

import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faEllipsis,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";

import reportApi from "@/services/reportApi";

import BrandLoading from "@/components/utils/brand-loading";
import BaseTimer from "@/components/utils/base-timer";
import WordDetail from "@/components/contents/word-detail";
import UserIcon from "@/components/contents/user-icon";
import BaseCountdown from "@/components/utils/base-countdown";
import UserInput from "@/components/contents/user-input";
import AnswerInput from "@/components/contents/answer-input";
import DotLoading from "@/components/utils/dot-loading";
import WordLinkSingle from "./single-mode";
import StandardModal from "./standard-modal";

const turnTime = 20;
const waitingSecond = 20;

export default function WordLinkMulti({ roomId }) {
  const router = useRouter();
  const [stompClient, setStompClient] = useState();
  const [responseWord, setResponseWord] = useState("");
  const [responseWordDescription, setResponseWordDescription] = useState("");
  const [turnNumber, setTurnNumber] = useState(1);
  const [turn, setTurn] = useState(3); // Number of turns to answer (answer wrong 3 times => game over)
  const [isReady, setIsReady] = useState(false);
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isDisplayDropdown, setIsDisplayDropdown] = useState(false);
  const [isSingleModeWaiting, setIsSingleModeWaiting] = useState(false);

  // User state
  const { user } = useUserStore();

  // Room info
  const [roomName, setRoomName] = useState();
  const [roomUserList, setRoomUserList] = useState([]);
  const [answerUser, setAnswerUser] = useState();
  const [isRoomPreparing, setIsRoomPreparing] = useState(true);
  const [wordList, setWordList] = useState([]);

  const isAnswering = useMemo(() => {
    return answerUser && answerUser.code == user.code;
  });
  const preResponseWord = useMemo(() => {
    return responseWord.split(" ").pop() + " ";
  });

  const isAnsweringRef = useRef();
  isAnsweringRef.current = isAnswering;
  const answerRef = useRef();
  const turnRef = useRef();
  turnRef.current = turn;
  const stompClientRef = useRef();
  stompClientRef.current = stompClient;

  useEffect(() => {
    connect();

    // On unmount
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
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
    // Waiting until user has data to do under code
    stompClient.subscribe(`/room/${roomId}`, onMessageReceived);
    stompClient.send(
      `/app/addUser/${roomId}`,
      {},
      JSON.stringify({ sender: user, roomId: roomId, type: "JOIN" })
    );
  };

  const onError = (error) => {
    console.error("Websocket error >>> ", error);
    swal
      .fire({
        toast: true,
        position: "top",
        icon: "error",
        text: "Lỗi không thể vào phòng 😣",
        timer: 3000,
        showConfirmButton: false,
      })
      .then(() => {
        window.location.href = "/nhieu-minh";
      });
  };

  const onMessageReceived = (payload) => {
    var res = JSON.parse(payload.body);
    if (res.type === "ANSWER") {
      handleReceiveAnswer(res);
    } else {
      handleReceiveRoomInfo(res);
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
      `/app/over/${roomId}`,
      {},
      JSON.stringify({ sender: user, roomId: roomId, type: "OVER" })
    );
  };

  const onReady = () => {
    setIsReady(true);
    stompClient.send(
      `/app/ready/${roomId}`,
      {},
      JSON.stringify({ sender: user, roomId: roomId, type: "READY" })
    );
  };

  const onAnswer = (answerWord) => {
    if (!answerWord) {
      return;
    }

    answerRef.current = preResponseWord + answerWord;

    // Check if answer is contained in word list
    if (wordList.includes(answerRef.current)) {
      swal.fire({
        toast: true,
        position: "top",
        text: `Từ [${answerRef.current}] đã được trả lời 😣`,
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
      `/app/answer/${roomId}`,
      {},
      JSON.stringify({
        sender: user,
        roomId: roomId,
        message: answerRef.current,
      })
    );
  };

  const handleReceiveRoomInfo = (message) => {
    if (message.type === "JOIN") {
      if (message.user.code !== user.code) {
        swal.fire({
          toast: true,
          position: "top",
          icon: "info",
          text: `${message.user.name} đã vào phòng`,
          timer: 3000,
          showConfirmButton: false,
        });

        setIsSingleModeWaiting(false);
      }
    } else if (message.type === "JOIN_FAIL") {
      if (message.user.code === user.code) {
        swal.fire({
          icon: "error",
          text: `Có lỗi khi vào phòng hoặc vượt giới hạn số lượng người chơi Vui lòng thử lại 😣`,
          timer: 3000,
          showConfirmButton: false,
        });
        router.push("/nhieu-minh");
      }
    } else if (message.type === "LEAVE") {
      swal.fire({
        toast: true,
        position: "top",
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
      if (message.user.code !== user.code) {
        swal.fire({
          icon: "info",
          toast: true,
          position: "top",
          text: `${message.user.name} đã bị loại`,
          timer: 3000,
          showConfirmButton: false,
        });

        updateResponseWord(message.word);
      }
    } else if (message.type === "END") {
      if (message.user.code === user.code) {
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
      if (message.user.code === user.code) {
        swal.fire({
          icon: "success",
          text: `Tuyệt vời! Bạn đã trả lời đúng 🤩`,
          timer: 2000,
          showConfirmButton: false,
        });

        setTurn(3);
      }

      setTurnNumber((prev) => prev + 1);
      updateRoomInfo(message.room);
      updateResponseWord(message.word);
    } else {
      if (isAnsweringRef.current) {
        swal
          .fire({
            toast: true,
            position: "top",
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
                    position: "top",
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
    setWordList((prev) => [...prev, word.word]);
    setResponseWord(word.word);
    setResponseWordDescription(word.description);
  };

  const resetGame = () => {
    setIsRoomPreparing(true);
    setIsReady(false);
    setTurn(3);
  };

  const onWaitingTimeout = () => {
    window.location.href = "/nhieu-minh";
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    swal.fire({
      toast: true,
      position: "top",
      title: "Đã sao chép đường dẫn phòng chơi",
      text: "Hãy gửi đường dẫn này cho bạn bè mà bạn muốn chơi cùng nhé! 🥰",
      icon: "success",
      timer: 5000,
      showConfirmButton: false,
    });
  };

  const onSingleModeWaiting = () => {
    setIsSingleModeWaiting(true);
    onReady();
  };

  return (
    <>
      <div className="is-flex is-flex-direction-column is-align-items-center">
        <p className="icon-text cursor-pointer" onClick={onCopyLink}>
          {roomName && <span>Phòng: {roomName}</span>}
          <span className="icon">
            <FontAwesomeIcon icon={faLink} size="sm" />
          </span>
        </p>

        <div className={`dropdown ${isDisplayDropdown && "is-active"}`}>
          <div className="dropdown-trigger">
            <button
              className="button is-text"
              aria-controls="dropdown-menu3"
              onClick={() => {
                setIsDisplayDropdown(!isDisplayDropdown);
              }}
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <Link href="/nhieu-minh" className="dropdown-item icon-text">
                <span className="icon">
                  <FontAwesomeIcon icon={faChevronLeft} size="sm" />
                </span>
                <span>Rời phòng</span>
              </Link>
            </div>
          </div>
        </div>
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
              {roomUserList.length <= 1 && (
                <div className="content is-flex is-flex-direction-column is-align-items-center">
                  <div className="is-size-6 mb-2">
                    <p className="has-text-centered">
                      Xin lỗi vì đã để bạn đợi lâu 😟
                    </p>
                    <ul>
                      <li>
                        <a className="text-underlined" onClick={onCopyLink}>
                          Sao chép link
                        </a>{" "}
                        để mời bạn bè chơi cùng
                      </li>
                      <li>
                        Hoặc thử{" "}
                        <a
                          className="text-underlined is-size-6"
                          onClick={onSingleModeWaiting}
                        >
                          chơi đơn
                        </a>{" "}
                        trong lúc đợi nhé
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              {isReady ? (
                <div className="is-flex is-flex-direction-column is-align-items-center">
                  <p className="has-text-centered is-size-4 mb-2">
                    Đã sẵn sàng, chờ người chơi khác
                  </p>
                  <BrandLoading />
                </div>
              ) : (
                <div className="is-flex is-flex-direction-column is-align-items-center w-100">
                  <UserInput />
                  <button
                    className="button is-large drawing-border is-flex is-flex-direction-column is-align-items-center"
                    onClick={onReady}
                  >
                    <span>Sẵn sàng</span>
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
                  <AnswerInput
                    key={responseWord}
                    preResponseWord={preResponseWord}
                    onAnswer={onAnswer}
                  />
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

      <div className="columns is-multiline is-centered is-vcentered is-mobile w-100">
        {roomUserList.map((user, index) => (
          <div
            key={index}
            className="column is-flex is-flex-direction-column is-align-items-center"
          >
            <UserIcon
              username={user.name}
              avatarUrl={user.avatar}
              isSelf={user.code == user.code}
              isReady={isRoomPreparing && user.isReady}
              isAnswer={user.isAnswering}
              isBlur={!isRoomPreparing && !user.isReady}
            />
          </div>
        ))}

        {roomUserList.length <= 1 && (
          <div className="column is-flex is-flex-direction-column is-align-items-center">
            <div>Đợi đối thủ</div>
            <DotLoading />
          </div>
        )}
      </div>

      {isSingleModeWaiting && roomUserList.length <= 1 && (
        <StandardModal
          id="single-waiting"
          onClose={() => setIsSingleModeWaiting(false)}
        >
          <div className="is-flex is-flex-direction-column is-align-items-center mb-4">
            <h1 className="title is-4 has-text-centered">
              Chơi đơn trong lúc tìm đối thủ
            </h1>
            <BrandLoading />
          </div>
          <WordLinkSingle isLiteMode={true} />
        </StandardModal>
      )}
    </>
  );
}
