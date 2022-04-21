const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

// mongoose.connect()告诉Mongoose 我们要连接到哪个数据库。
mongoose.connect(
  // use heroku MONGODB_URI or local mongodb 
  process.env.MONGODB_URI || "mongodb://localhost:27017/pizza-hunt",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Use this to log mongo queries being executed!
mongoose.set("debug", true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
