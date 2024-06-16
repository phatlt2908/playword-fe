"use client";

const { useState, useEffect } = require("react");
import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

const ChatDemo = () => {
  const [user, setUser] = useState({
    id: Math.random().toString(36).substring(2, 10),
    name: "Phat",
  });
  const [messageList, setMessageList] = useState([]);
  const [stompClient, setStompClient] = useState();

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
    console.log("stompClient: ", stompClient);
    stompClient.subscribe("/room/1234", onMessageReceived);

    stompClient.send(
      "/app/chat.addUser/1234",
      {},
      JSON.stringify({ sender: user, type: "JOIN" })
    );
  };

  const onError = (error) => {
    console.error("Error: ", error);
  };

  const onMessageReceived = (payload) => {
    var res = JSON.parse(payload.body);
    console.log("Received message >>> : ", res);
    let message = res.sender.name + ": " + res.message;
    setMessageList((prev) => [...prev, message]);
  };

  const sendMessage = (message) => {
    console.log("Sending message...", stompClient);
    if (message && stompClient) {
      var chatMessage = {
        sender: user,
        message: message,
        type: "CHAT",
      };
      stompClient.send(
        "/app/chat.sendMessage/1234",
        {},
        JSON.stringify(chatMessage)
      );
    }
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <div>
      <button
        className="button is-primary"
        onClick={() => sendMessage("Test message ")}
      >
        Add message
      </button>
      <div>Message:</div>
      <div>
        {messageList.map((message, index) => (
          <div key={index}>{message + index}</div>
        ))}
      </div>
    </div>
  );
};

export default ChatDemo;
