const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const blogRouter = require("./routes/blog");
const profileRouter = require("./routes/profile");
const findRouter = require("./routes/find");
const messageRouter = require("./routes/messages");
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
  const msgCollection = DB.collection("messages");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", messageDetails);
    } else if (change.operationType === "update") {
      const messageDetails = change;
      pusher.trigger("messages", "updated", {
        _id: messageDetails.documentKey._id,
        messages: messageDetails.updateDescription.updatedFields.chats,
      });
    } else {
      console.log("Error Triggering Pusher");
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
