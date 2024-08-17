"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUserStore } from "@/stores/user-store";

import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import swal from "sweetalert2";

import styles from "./base-chat.module.css";
import PulsatingDot from "../utils/pulsating-dot";

import chatApi from "@/services/chatApi";

const BaseChat = () => {
  const { user } = useUserStore();

  const chatBodyRef = useRef();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);

  const [stompClient, setStompClient] = useState();
  const stompClientRef = useRef();
  stompClientRef.current = stompClient;

  useEffect(() => {
    connect();
    getHistoryChatList(0);

    // On unmount
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isChatOpen && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [isChatOpen, messages]);

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
    stompClient.subscribe(`/room/chat-room`, onMessageReceived);
    stompClient.send(
      `/app/join`,
      {},
      JSON.stringify({ userCode: user.code, type: "JOIN" })
    );
  };

  const onError = (error) => {
    console.error("Websocket error >>> ", error);
    swal.fire({
      toast: true,
      position: "top",
      icon: "error",
      text: "Lỗi không thể truy cập chat 😣",
      timer: 3000,
      showConfirmButton: false,
    });
  };

  const onMessageReceived = (payload) => {
    var res = JSON.parse(payload.body);

    setOnlineCount(res.onlineCount);

    if (res.type === "CHAT") {
      const message = {
        userCode: res.user.code,
        userName: res.user.name,
        avatar: res.user.avatar,
        message: res.message,
      };
      setMessages((prev) => [...prev, message]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") {
      return;
    }

    stompClient.send(
      `/app/chat`,
      {},
      JSON.stringify({ userCode: user.code, message: newMessage })
    );

    setNewMessage("");
  };

  const getHistoryChatList = (largestId) => {
    chatApi.getHistoryChatList(largestId).then((res) => {
      res.data.forEach((element) => {
        const message = {
          userCode: element.user.code,
          userName: element.user.name,
          avatar: element.user.avatar,
          message: element.message,
        };
        setMessages((prev) => [message, ...prev]);
      });
    });
  };

  return (
    <>
      <button
        className={`${styles.chat}`}
        onClick={() => {
          setIsChatOpen(true);
        }}
      >
        <FontAwesomeIcon icon={faCommentDots} />
      </button>

      {isChatOpen && (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => {
              setIsChatOpen(false);
            }}
          ></div>
          <div className="modal-card">
            <header className="modal-card-head p-4">
              <div className="modal-card-title">
                <span className="mr-2">{onlineCount}</span>
                <PulsatingDot />
              </div>
              <button
                className="delete"
                aria-label="close"
                onClick={() => {
                  setIsChatOpen(false);
                }}
              ></button>
            </header>
            <div ref={chatBodyRef} className="modal-card-body">
              <div className="content">
                {messages.map((message, index) => (
                  <article key={index} className="media">
                    {message.userCode != user.code && (
                      <figure className="media-left">
                        <p className="image is-64x64">
                          <Image
                            src={message.avatar}
                            alt="avatar"
                            width={100}
                            height={100}
                            priority
                          />
                        </p>
                      </figure>
                    )}
                    <div className="media-content">
                      <div
                        className={`content ${
                          message.userCode == user.code ? "has-text-right" : ""
                        }`}
                      >
                        <p>
                          <strong>{message.userName}</strong>
                          <br />
                          {message.message}
                        </p>
                      </div>
                    </div>
                    {message.userCode == user.code && (
                      <figure className="media-right">
                        <p className="image is-64x64">
                          <Image
                            src={message.avatar}
                            alt="avatar"
                            width={100}
                            height={100}
                            priority
                          />
                        </p>
                      </figure>
                    )}
                  </article>
                ))}
              </div>
            </div>
            <footer className="modal-card-foot p-4">
              <div className="field has-addons w-100">
                <div className="control w-100">
                  <input
                    onKeyDown={handleKeyDown}
                    className="input"
                    type="text"
                    placeholder="Aa"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                    }}
                    autoFocus
                  />
                </div>
                <div className="control">
                  <button
                    className="button transform-hover"
                    onClick={sendMessage}
                  >
                    <span>
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </span>
                  </button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default BaseChat;
