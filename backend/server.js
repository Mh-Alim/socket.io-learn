const { instrument } = require("@socket.io/admin-ui");

const io = require("socket.io")(5000, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true,
  },
});

const userIo = io.of("/user");

userIo.on("connection", (socket) => {
  console.log("connect to user namespace with username " + socket.username);
});

userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUserNameFromToken(socket.handshake.auth.token);
    next();
  } else {
    next(new Error("Token Doest not exist"));
  }
});

const getUserNameFromToken = (token) => {
  //  TODO: EXTRACT USER NAME FROM TOKEN
  return token;
};

io.on("connection", (socket) => {
  console.log(socket.id);

  //   socket.on("custom-event", (number, string, object, array) => {
  //     console.log(number, string, object, array);
  //   });

  socket.on("send-message", (message, room) => {
    console.log(message, room);
    if (room === "") {
      socket.broadcast.emit("receive-message", message);
    } else {
      socket.to(room).emit("receive-message", message); // room me messge send krne ke liye
    }
  });

  socket.on("join-room", (room, cb) => {
    socket.join(room); // room ke messages ko dekhne ke liye
    cb(`Joined in room ${room}`);
  });
    
    socket.on("ping", (cnt) => {
        console.log(cnt);
    })
});

instrument(io, { auth: false });
