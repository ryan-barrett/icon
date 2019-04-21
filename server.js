const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const vision = require('@google-cloud/vision').v1p3beta1;

const app = express();

//trust Heroku
app.enable('trust proxy');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: 'Too many requests. Wait an hour and try again'
});

app.use(cors());

//compress all responses
app.use(compression());

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

app.use(
  bodyParser.json({ limit: '50mb', extended: true }),
  bodyParser.urlencoded({ limit: '50mb', extended: true })
);

app.get('/test', (req, res) => {
  console.log('test');
  res.send(req.get('host') === 'localhost:3000');
});

app.post('/searchForProduct', limiter, (req, res, next) => {
  //only allow requests from icon
  if (req.get('origin') === 'https://ryan-barrett.github.io') {
    let image = req.body.payload.substring(23);
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    // Performs label detection on the image file
    client
      .labelDetection(Buffer.from(image, 'base64'))
      .then(results => {
        const labels = results[0].labelAnnotations;

        labels.forEach(label => console.log(label.description));
        res.send(labels);
      })
      .catch(err => {
        res.send(err);
      });
  } else {
    res.send(req.get('origin'));
  }
});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});
