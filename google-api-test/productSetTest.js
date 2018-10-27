// Imports the Google Cloud client library
const vision = require('@google-cloud/vision').v1p3beta1;

// Creates a client
const client = new vision.ProductSearchClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
const projectId = 'enstyle-220706';
const location = 'us-east1';
const productSetId = 'test_data';
const productSetDisplayName = 'test_data_catlog';

// Resource path that represents Google Cloud Platform location.
const locationPath = client.locationPath(projectId, location);

const productSet = {
  displayName: productSetDisplayName,
};

const request = {
  parent: locationPath,
  productSet: productSet,
  productSetId: productSetId,
};

client
  .createProductSet(request)
  .then(results => {
    // The response is the product set with the `name` field populated
    const createdProductSet = results[0];
    console.log(`Product Set name: ${createdProductSet.name}`);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });