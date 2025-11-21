const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors());

app.use(express.static("public"));

app.use(express.json());

app.use("/users", require("./routes/user.route"));

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
