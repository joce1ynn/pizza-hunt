const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

// ongoose.connect()告诉 Mongoose 我们要连接到哪个数据库。
// 如果环境变量MONGODB_URI存在，比如我们稍后部署的 Heroku 上，它将使用它。
// 否则，它将与本地 MongoDB 服务器的数据库短路mongodb://localhost:27017/pizza-hunt。
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/pizza-hunt",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Use this to log mongo queries being executed!
mongoose.set("debug", true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
