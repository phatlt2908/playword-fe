"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import swal from "sweetalert2";

import wordLinkApi from "@/services/wordLinkApi";
import reportApi from "@/services/reportApi";

import SpinnerLoading from "@/components/utils/spinner-loading";
import BaseTimer from "@/components/utils/base-timer";
import WordDetail from "@/components/contents/word-detail";
import StandardModal from "@/components/contents/standard-modal";

const turnTime = 15;

export default function WordLinkMulti({ params }) {
  const router = useRouter();
  const [stompClient, setStompClient] = useState();
  const [messageList, setMessageList] = useState([]);
  const [answerWord, setAnswerWord] = useState("");
  const [turnNumber, setTurnNumber] = useState(1);
  const [overType, setOverType] = useState();
  const [turn, setTurn] = useState(3); // Number of turns to answer (answer wrong 3 times => game over)
  const [user, setUser] = useState({
    id: Math.random().toString(36).substring(2, 10),
    name: Math.random().toString(36).substring(2, 10),
  });
  const [isReady, setIsReady] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);

  // Room info
  const [roomUserList, setRoomUserList] = useState([]);
  const [isRoomPreparing, setIsRoomPreparing] = useState(true);

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
    var socket = new SockJS("http://localhost:8081/ws");
    setStompClient(Stomp.over(socket));
  };

  const onConnected = () => {
    stompClient.subscribe(`/room/${params.id}`, onMessageReceived);
    stompClient.send(
      `/app/addUser/${params.id}`,
      {},
      JSON.stringify({ sender: user, roomId: params.id, type: "JOIN" })
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
        router.push("noi-tu/nhieu-minh");
      });
  };

  const onMessageReceived = (payload) => {
    var res = JSON.parse(payload.body);
    console.log("Received message >>> : ", res);

    if (res.type === "ANSWER") {
      let message = res.user.name + ": " + res.message;
      setMessageList((prev) => [...prev, message]);
    } else {
      handleReceiveRoomInfo(res);
    }
  };

  const onAnswer = () => {
    if (!answerWord) {
      return;
    }

    console.log("Sending message...", stompClient);
    if (stompClient) {
      var answerMessage = {
        sender: user,
        message: answerWord,
        type: "CHAT",
      };
      stompClient.send(
        `/app/sendMessage/${params.id}`,
        {},
        JSON.stringify(answerMessage)
      );
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
    console.log("Over");
    setOverType(type);
  };

  const onReady = () => {
    setIsReady(true);
    stompClient.send(
      `/app/ready/${params.id}`,
      {},
      JSON.stringify({ sender: user, roomId: params.id, type: "READY" })
    );
  };

  const handleReceiveRoomInfo = (message) => {
    if (message.type === "JOIN") {
      if (message.user.id !== user.id) {
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
      if (message.room.userList.every((user) => user.isReady)) {
        swal
          .fire({
            title: "Bắt đầu game",
            timer: 1000,
            showConfirmButton: false,
          })
          .then(() => {
            setIsRoomPreparing(false);
          });
      }
    }

    setRoomUserList(message.room.userList);
  };

  return (
    <>
      <div className="is-flex is-flex-direction-column is-align-items-center w-100">
        <div>
          <span className="mr-2">User</span>
          <span className="icon is-large circle-border mb-4">
            <FontAwesomeIcon icon={faUser} />
          </span>
        </div>

        {!overType && (
          <BaseTimer
            key={turnNumber}
            maxTime={turnTime}
            onOver={() => {
              onOver(2);
            }}
          />
        )}
      </div>

      {isRoomPreparing ? (
        <>
          {isReady ? (
            <p className="has-text-centered is-size-5">
              Đã sẵn sàng, chờ người chơi khác
            </p>
          ) : (
            <button className="button is-large" onClick={onReady}>
              Sẵn sàng
            </button>
          )}
        </>
      ) : (
        <div>
          <p className="mb-4">
            <WordDetail
              styleClass="has-text-centered is-size-1 is-inline-block w-100"
              word="Test word"
              description="Test word description"
            />
          </p>

          <div className="field has-addons">
            <div className="control is-large">
              <a className="button is-static is-large">Test</a>
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
          <div>
            {messageList.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        </div>
      )}

      <div className="columns is-centered is-mobile w-100">
        {roomUserList.map((user, index) => (
          <div
            key={index}
            className="column is-half-mobile is-one-third-widescreen is-one-quarter-fullhd is-flex is-flex-direction-column is-align-items-center"
          >
            <span className="icon is-large circle-border">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <span className="is-size-7">{user.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}
