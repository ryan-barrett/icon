const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }), cors());

app.get("/test", (req, res) => {
    console.log("test");
    res.send("hello");
})

app.post("/searchForProduct", (req, res, next) => {
  let image = req.body;
  res.send(image);
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
