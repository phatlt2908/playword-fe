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
const username = Math.random().toString(36).substring(2, 10);

export default function WordLinkMulti({ params }) {
  const router = useRouter();
  const [stompClient, setStompClient] = useState();
  const [isConnecting, setIsConnecting] = useState(true);
  const [messageList, setMessageList] = useState([]);
  const [answerWord, setAnswerWord] = useState("");

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
    setIsConnecting(false);
    stompClient.subscribe(`/room/${params.id}`, onMessageReceived);
    stompClient.send(
      `/app/chat.addUser/${params.id}`,
      {},
      JSON.stringify({ sender: username, type: "JOIN" })
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
    if (res.type === "CHAT") {
      let message = res.sender + ": " + res.message;
      setMessageList((prev) => [...prev, message]);
    } else if (res.type === "JOIN") {
      setMessageList((prev) => [...prev, res.sender + " đã vào phòng"]);
    } else if (res.type === "LEAVE") {
      setMessageList((prev) => [...prev, res.sender + " đã rời phòng"]);
    }
  };

  const onAnswer = () => {
    if (!answerWord) {
      return;
    }

    console.log("Sending message...", stompClient);
    if (stompClient) {
      var answerMessage = {
        sender: username,
        message: answerWord,
        type: "CHAT",
      };
      stompClient.send(
        `/app/chat.sendMessage/${params.id}`,
        {},
        JSON.stringify(answerMessage)
      );
    }
  };

  return (
    <>
      {isConnecting ? (
        <SpinnerLoading />
      ) : (
        <div className="w-100">
          <div className="field has-addons">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="message..."
                onChange={(e) => setAnswerWord(e.target.value)}
              />
            </div>
            <div className="control">
              <button className="button is-info" onClick={() => onAnswer()}>
                Send
              </button>
            </div>
          </div>
          <div>
            {messageList.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
