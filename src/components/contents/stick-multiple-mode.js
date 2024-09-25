"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";

import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faEllipsis,
  faHourglassHalf,
  faLink,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";

import BrandLoading from "@/components/utils/brand-loading";
import BaseTimer from "@/components/utils/base-timer";
import UserIcon from "@/components/contents/user-icon";
import BaseCountdown from "@/components/utils/base-countdown";
import UserInput from "@/components/contents/user-input";
import DotLoading from "@/components/utils/dot-loading";
import StandardModal from "./standard-modal";
import StickAnswerInput from "./stick-answer-input";
import StickSingle from "./stick-single-mode";

import { b64DecodeUnicode } from "@/utils/commonUtils";

const turnTime = 20;
const waitingSecond = 20;

export default function StickMulti({ roomId }) {
  const router = useRouter();
  const [stompClient, setStompClient] = useState();
  const [characters, setCharacters] = useState([]);
  const [word, setWord] = useState("");
  const [description, setDescription] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isDisplayDropdown, setIsDisplayDropdown] = useState(false);
  const [isSingleModeWaiting, setIsSingleModeWaiting] = useState(false);
  const [isWatingNewQuestion, setIsWatingNewQuestion] = useState(false);

  // User state
  const { user } = useUserStore();

  // Room info
  const [roomName, setRoomName] = useState();
  const [roomUserList, setRoomUserList] = useState([]);
  const [isRoomPreparing, setIsRoomPreparing] = useState(true);

  const stompClientRef = useRef();
  stompClientRef.current = stompClient;
  const isCheckingAnswer = useRef();
  const isInputError = useRef();

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
      `/app/stick/add-user/${roomId}`,
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
        window.location.href = "/online";
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

  const onReady = () => {
    setIsReady(true);
    stompClient.send(
      `/app/stick/ready/${roomId}`,
      {},
      JSON.stringify({ sender: user, roomId: roomId, type: "READY" })
    );
  };

  const onAnswer = (answer) => {
    if (!answer) {
      return;
    }

    isCheckingAnswer.current = true;
    stompClient.send(
      `/app/stick/answer/${roomId}`,
      {},
      JSON.stringify({
        sender: user,
        roomId: roomId,
        message: answer,
      })
    );
  };

  const onOverTime = () => {
    isCheckingAnswer.current = true;

    swal.fire({
      icon: "info",
      title: "Hết thời gian",
      text: word + ": " + description,
      timer: 2000,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    const currentUser = roomUserList.find((user) => user.code === user.code);
    if (currentUser.isKey) {
      stompClient.send(
        `/app/stick/over/${roomId}`,
        {},
        JSON.stringify({ roomId: roomId, type: "OVER" })
      );
    }
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
        router.push("/online");
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
            updateQuestion(message.stickWord);
          });

        isInputError.current = false;
      }
    } else if (message.type === "OVER") {
      updateQuestion(message.stickWord);
    } else if (message.type === "END") {
      // Sort user list by score
      const sortedList = message.room.userList.sort(
        (a, b) => b.score - a.score
      );
      const resultList = sortedList.map((user) => {
        return `<p>${user.name}: ${user.score}</p>`;
      });

      const resultHtml = `
        <div class="is-flex is-flex-direction-column is-align-items-center">
          ${
            message.user.code === user.code
              ? `<p class="is-size-4">Chúc mừng! Bạn đã chiến thắng 🎉</p>`
              : `<p>${message.user.name} đã chiến thắng 🎉</p>`
          }
          <p class="is-size-4">Điểm số</p>
          ${resultList.join("")}
        </div>`;

      swal.fire({
        icon: message.user.code === user.code ? "success" : "info",
        html: resultHtml,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "Đóng",
      });

      resetGame();
    }

    if (message.room) {
      updateRoomInfo(message.room);
    }

    setIsLoadingInit(false);
    isCheckingAnswer.current = false;
  };

  const handleReceiveAnswer = (message) => {
    if (message.isAnswerCorrect) {
      setIsWatingNewQuestion(true);

      if (message.user.code === user.code) {
        swal
          .fire({
            icon: "success",
            title: `Tuyệt vời! Bạn đã trả lời đúng 🤩`,
            text: message.message,
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          })
          .then(() => {
            nextTurn(message);
          });
      } else {
        swal
          .fire({
            icon: "info",
            title: `${message.user.name} đã trả lời đúng`,
            text: message.message,
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
          })
          .then(() => {
            nextTurn(message);
          });
      }

      isInputError.current = false;
    } else {
      if (message.user.code === user.code) {
        swal.fire({
          toast: true,
          position: "bottom",
          text: "[" + message.message + "] Không chính xác 😣",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
        });
        isInputError.current = true;
      } else {
        // TODO: Display message for other user
      }
    }

    isCheckingAnswer.current = false;
  };

  const updateRoomInfo = (room) => {
    setRoomUserList(room.userList);
    setRoomName(room.name);
  };

  const updateQuestion = (word) => {
    setCharacters(word.characters);
    setWord(b64DecodeUnicode(word.wordBase64Encoded));
    setDescription(b64DecodeUnicode(word.descriptionBase64Encoded));
  };

  const resetGame = () => {
    setIsRoomPreparing(true);
    setIsReady(false);
  };

  const onWaitingTimeout = () => {
    window.location.href = "/online";
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

  const nextTurn = (message) => {
    setIsWatingNewQuestion(false);
    updateRoomInfo(message.room);
    updateQuestion(message.stickWord);
  };

  const onLeaveRoom = () => {
    swal
      .fire({
        text: "Bạn có chắc chắn muốn rời khỏi phòng?",
        icon: "question",
        confirmButtonText: "Rời khỏi phòng",
        showCancelButton: true,
        cancelButtonText: "Không",
      })
      .then((result) => {
        if (result.isConfirmed) {
          router.push("/online");
        }
      });
  }

  return (
    <>
      <div className="is-flex is-flex-direction-column is-align-items-center">
        <p className="icon-text cursor-pointer" onClick={onCopyLink}>
          {roomName && <span>Phòng: {roomName}</span>}
          <span className="icon">
            <FontAwesomeIcon icon={faLink} size="sm" />
          </span>
        </p>

        <div className="button is-text is-size-6" onClick={onLeaveRoom}>
          <span className="icon">
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </span>
          <span className="text-underlined">Rời khỏi phòng</span>
        </div>
      </div>
      <div className="w-100">
        <div>
          {!isRoomPreparing && !isWatingNewQuestion && (
            <BaseTimer
              key={characters}
              maxTime={turnTime}
              onOver={onOverTime}
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
                  <div className="button is-text" onClick={onCopyLink}>
                    <span className="icon">
                      <FontAwesomeIcon icon={faShare} size="sm" />
                    </span>
                    <span className="text-underlined">
                      Chia sẻ link chơi cùng
                    </span>
                  </div>
                  <div className="button is-text" onClick={onSingleModeWaiting}>
                    <span className="icon">
                      <FontAwesomeIcon icon={faHourglassHalf} size="sm" />
                    </span>
                    <span className="text-underlined">
                      Chơi với máy trong lúc đợi
                    </span>
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
            <StickAnswerInput
              key={characters}
              characters={characters}
              onAnswer={onAnswer}
              isLoading={isCheckingAnswer.current}
              isError={isInputError.current}
            />
          )}
        </>
      )}

      <div className="w-100">
        <div className="has-text-centered is-size-3">5</div>
        <div className="columns is-multiline is-centered is-vcentered is-mobile">
          {roomUserList.map((roomUser, index) => (
            <div
              key={index}
              className="column is-flex is-flex-direction-column is-align-items-center"
            >
              <UserIcon
                username={roomUser.name}
                avatarUrl={roomUser.avatar}
                isSelf={user.code == roomUser.code}
                isReady={isRoomPreparing && roomUser.isReady}
                isBlur={!isRoomPreparing && !roomUser.isReady}
                score={isRoomPreparing ? null : roomUser.score}
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
          <StickSingle isLiteMode={true} />
        </StandardModal>
      )}
    </>
  );
}
