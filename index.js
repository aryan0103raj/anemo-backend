const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const blogRouter = require("./routes/blog");
const profileRouter = require("./routes/profile");
const findRouter = require("./routes/find");
const messageRouter = require("./routes/message");
const Pusher = require("pusher");
const message = require("./models/message");

const pusher = new Pusher({
  appId: "1429086",
  key: "fa9ed026dede4902b34e",
  secret: "bb5c30700acff73b06c0",
  cluster: "ap2",
  useTLS: true,
});

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

const uri =
  "mongodb+srv://aryan:aryan@anemo.3kbza5o.mongodb.net/?retryWrites=true&w=majority";

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/auth.routes")(app);

const db = require("./models");
db.mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const DB = mongoose.connection;
DB.once("open", () => {
  console.log("DB.ONCE()");

  const chatListCollection = DB.collection("chatlists");
  const chatListChangeStream = chatListCollection.watch();

  const msgCollection = DB.collection("messages");

  chatListChangeStream.on("change", async (change) => {
    const msgChangeStream2 = msgCollection.watch();
    msgChangeStream2.on("change", (change) => {
      if (change.operationType === "update") {
        const messageDetails = change;

        pusher.trigger("private" + messageDetails.documentKey._id, "updated", {
          _id: messageDetails.documentKey._id,
          chats: messageDetails.updateDescription.updatedFields.chats,
        });
      }
    });

    if (change.operationType === "update") {
      console.log("hi");
      const chatDetails = change;
      const chatList = await db.chatList
        .findOne({
          _id: change.documentKey._id,
        })
        .populate("user1", "name username")
        .populate("chatList.user2", "name username");
      chatList.chatList.sort(function (a, b) {
        var dateA = new Date(a.lastUpdate),
          dateB = new Date(b.lastUpdate);
        return dateB - dateA;
      });
      console.log(change);
      pusher.trigger(
        "private" + chatDetails.documentKey._id,
        "updated",
        chatList
      );
    } else if (change.operationType === "insert") {
      const chatDetails = change.fullDocument;
      const chatList = await db.chatList
        .findOne({
          _id: change.documentKey._id,
        })
        .populate("user1", "name username")
        .populate("chatList.user2", "name username");

      chatList.chatList.sort(function (a, b) {
        var dateA = new Date(a.lastUpdate),
          dateB = new Date(b.lastUpdate);
        return dateB - dateA;
      });
      console.log(change);
      pusher.trigger("private" + chatDetails.user1, "inserted", chatList);
    }
  });
});

const initUnhandledExceptions = () => {
  process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UNHANDLED REJECTION! Shutting down...");
    process.exit(1);
  });

  process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("UNCAUGHT EXCEPTION!  Shutting down...");
    process.exit(1);
  });
};
initUnhandledExceptions();

app.use("/blogs", blogRouter);
app.use("/profile", profileRouter);
app.use("/find", findRouter);
app.use("/messages", messageRouter);

app.listen(8080, () => {
  console.log("Server up at 8080");
});
