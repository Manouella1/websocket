const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;

// Mongoose

const connectionMongoDB = require("./connectionMongoDB");
const gameModel = require("./models/gameModel");
connectionMongoDB();

app.use(express.static("public"));

// Endpoint för att visa meddelanden från mongoDB
app.get("/players", async (req, res) => {
  try {
    const allPlayers = await gameModel.find();
    return res.status(200).json(allPlayers);
  } catch (error) {
    return res.status(500).json({
      error: error.players,
    });
  }
});

io.on("connection", (socket) => {
  console.log(`A client with id ${socket.id} connected!`);

  socket.on("diceThrow", async (data) => {
    const { user, dice } = data;
    try {
      const lastScore = await gameModel
        .findOne({ user: user })
        .sort({ date: -1 })
        .limit(1);
      const totalScore = lastScore ? lastScore.totalScore + dice : dice;

      const newGameEntry = new gameModel({
        user: user,
        diceThrow: dice,
        totalScore: totalScore,
      });
      await newGameEntry.save();

      io.emit(
        "diceUpdate",
        `${user} threw a ${dice}. Total score: ${totalScore}`
      );
    } catch (error) {
      console.error("Error processing dice throw:", error);
      // Hantera eventuella fel här, t.ex. skicka ett felmeddelande till klienten
    }
  });

  socket.on("chatMessage", async (msg) => {
    io.emit("newChatMessage", `${msg.user} : ${msg.message}`);
    // const newMessage = new gameModel({
    //   ...msg,
    //   diceThrow: undefined,
    //   totalScore: undefined,
    // });
    // await newMessage.save();
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected!`);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
