const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const vision = require("@google-cloud/vision").v1p3beta1;

const app = express();

//trust Heroku
app.enable("trust proxy");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: "Too many requests. Wait an hour and try again"
});

//only allow requests from icon
const whitelist = ['https://ryan-barrett.github.io/icon/'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

//compress all responses
app.use(compression());

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

app.get("/test", cors(corsOptions), (req, res) => {
  console.log("test");
  res.send("hello");
});

app.post("/searchForProduct", cors(corsOptions), limiter, (req, res, next) => {
  let image = req.body.payload.substring(23);

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  client
    .labelDetection(Buffer.from(image, "base64"))
    .then(results => {
      const labels = results[0].labelAnnotations;

      labels.forEach(label => console.log(label.description));
      res.send(labels);
    })
    .catch(err => {
      res.send(err);
    });
});

app.listen(port, function() {
  console.log("Our app is running on http://localhost:" + port);
});
