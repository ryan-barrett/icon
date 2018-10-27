// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

const request = {
  image: {
    source: {imageUri: './resources/woman.jpg'}
  }
};

// Performs label detection on the image file
client
  .labelDetection('./resources/woman.jpg')
  .then(results => {
    console.log(results[0].labelAnnotations); 
    // console.log('Labels:');
    // labels.forEach(label => console.log(label.description));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });