const vision = require('@google-cloud/vision').v1p3beta1;

const client = new vision.ProductSearchClient();
const projectId = 'enstyle-220706';
const location = 'us-east1';
const productSetId = 'test_data';
const csvFilePath='data.csv'
const csv=require('csvtojson')

csv()
.fromFile(csvFilePath)
.then((json)=>{
  json.forEach(product => {
    const formattedParent = client.productPath(projectId, location, product.ID);

    const referenceImage = {
      uri: 'gs://enstyle_bucket/images/' + product.ID + '.jpg',
    };

    const request = {
      parent: formattedParent,
      referenceImage: referenceImage,
      referenceImageId: product.ID,
    };

    client
      .createReferenceImage(request)
      .then(responses => {
        const response = responses[0];
        console.log(`response.name: ${response.name}`);
        console.log(`response.uri: ${response.uri}`);
      })
      .catch(err => {
        console.error(err);
      });
    })
  }).catch(error => {
    console.log(error)
  })
