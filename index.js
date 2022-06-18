const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const blogRouter = require("./routes/blog");

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

app.use("/blogs", blogRouter);

app.listen(8080, () => {
  console.log("Server up at 8080");
});
