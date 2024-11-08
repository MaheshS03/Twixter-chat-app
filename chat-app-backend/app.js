const express = require("express");
const connectDB = require("./configurations/dbConfig");

const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const messageRouter = require("./routes/messageRouter");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const {PORT} = require('./configurations/config')
const path = require("path");
const cors = require("cors")

connectDB();
const app = express();

app.use(express.json()); 
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);


const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/chat-app-frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "chat-app-frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.use(notFound);
app.use(errorHandler);


const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },transports: ["websocket"],
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
