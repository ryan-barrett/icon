const productSetName = 'projects/enstyle-220706/locations/us-east1/productSets/random-id'

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision').v1p3beta1;

// Creates a client
const client = new vision.ProductSearchClient();

client.deleteProductSet({name: productSetName}).catch(err => { console.log(err) })