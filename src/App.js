import { useEffect, useRef } from "react";
import "./App.css";

import { io } from "socket.io-client";

const displayMesssage = (message) => {
  let div = document.createElement("div");
  div.textContent = message;
  document.getElementById("message-container").append(div);
};

const socket = io("http://localhost:5000");
const userSocket = io("http://localhost:5000/user", {
  auth: { token: "Atomic" },
});

function App() {
  const messageRef = useRef("");
  const roomRef = useRef("");

  let count = 0;
  setInterval(() => {
    socket.volatile.emit("ping", ++count);
  }, 1000);

  document.addEventListener("keydown", (e) => {
    if (e.key === "c") socket.connect();
    if (e.key === "d") socket.disconnect();
  });

  const handleMessage = (e) => {
    console.log("handle message is running");
    e.preventDefault();
    let message = messageRef.current.value;
    let room = roomRef.current.value;

    if (message === "") return;

    displayMesssage(message);
    socket.emit("send-message", message, room);
  };

  const joinRoom = (e) => {
    console.log("join room is running");
    e.preventDefault();

    let room = roomRef.current.value;

    socket.emit("join-room", room, (message) => {
      displayMesssage(message);
    });

    roomRef.current.value = "";
  };

  useEffect(() => {
    socket.on("connect", () => {
      displayMesssage(`You are connected with id : ${socket.id}`);
      // socket.emit("custom-event", 10, "hello backend", { a: "Any object" });
    });
    socket.on("receive-message", (message) => {
      displayMesssage(message);
    });

    userSocket.on("connect_error", (error) => {
      displayMesssage(error);
    });
  }, []);

  return (
    <div className="App">
      <form id="form">
        <label htmlFor="message-input"> Message </label>
        <input ref={messageRef} type="text" id="message-input" />
        <button type="submit" id="send-button" onClick={handleMessage}>
          Send
        </button>
        <br />
        <br />
        <label htmlFor="room-input">Room</label>
        <input ref={roomRef} type="text" id="room-input" />
        <button id="room-button" onClick={joinRoom}>
          Join
        </button>
      </form>
      <div id="message-container"></div>
    </div>
  );
}

export default App;
