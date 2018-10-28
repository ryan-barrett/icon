const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const vision = require('@google-cloud/vision').v1p3beta1;


app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }), cors());

app.get("/test", (req, res) => {
    console.log("test");
    res.send("hello");
})

app.post("/searchForProduct", (req, res, next) => {
  let image = req.body.payload.substring(23);

    // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  client
    .labelDetection(Buffer.from(image, 'base64'))
    .then(results => {
      const labels = results[0].labelAnnotations;

      console.log('Labels:');
      labels.forEach(label => console.log(label.description));
      res.send(labels)
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
