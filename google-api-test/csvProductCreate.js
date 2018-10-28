const csvFilePath='data.csv'
const csv=require('csvtojson')

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision').v1p3beta1;
const projectId = 'enstyle-220706';
const location = 'us-east1';
const productSetId = 'test_data';

// Creates a client
const client = new vision.ProductSearchClient();

// Update products
csv()
.fromFile(csvFilePath)
.then((json)=>{
  json.forEach(product => {
    const productPath = client.productPath(projectId, location, product.ID)

    const productTest = {
      name: productPath,
      productLabels: [
        {
          key: 'price',
          value: product.price,
        }
      ]
    }

    const updateMask = {
      paths: ['product_labels'],
    };

    const request = {
      product: productTest,
      updateMask: updateMask,
    };

    client
      .updateProduct(request)
      .then(results => {
        const product = results[0];
        console.log(`Product name: ${product.name}`);
        console.log(`Product display name: ${product.displayName}`);
        console.log(`Product category: ${product.productCategory}`);
        console.log(
            `Product Labels: ${product.productLabels[0].key}: ${
              product.productLabels[0].value
            }`
          );
      }).catch(error => {
        console.log(error)
      })
    })
  }).catch(error => {
    console.log(error)
  })

  // Creating products
  //
  // const locationPath = client.locationPath(projectId, location);
  // csv()
  // .fromFile(csvFilePath)
  // .then((json)=>{
  //   console.log(json);
  //   json.forEach(product => {
  //     const productTest = {
  //       displayName: product.name,
  //       productCategory: 'apparel'
  //       productLabels: [
  //         {
  //           key: 'price',
  //           value: product.price
  //         }
  //       ]
  //     }
  //
  //     const request = {
  //       parent: locationPath,
  //       product: productTest,
  //       productId: product.ID
  //     }
  //
  //     client
  //       .createProduct(request)
  //       .then(results => {
  //         const createdProduct = results[0];
  //         console.log(`Product name: ${createdProduct.name}`);
  //       }).catch(error => {
  //         console.log(error)
  //       })
  //     })
  //   })

  // .catch(err => {
  //   console.error('ERROR:', err);
  // });
  //     })
  // })
  // const product = {
  //   imageUri: json[0],
  //   productSetId: productSetId,
  //   productCategory: "apparel",
  //   labels: json[3],
  //   price: json[4],
  //   displayName: json[5],
  // }.catch(error => { console.log(error) });
  //
  // const request = {
  //   parent: locationPath,
  //   product: product,
  //   productId: productId,
  // };
  //
  // client
  //   .createProduct(request)
  //   .then(results => {
  //     // The response is the product with the `name` field populated
  //     const createdProduct = results[0];
  //     console.log(`Product name: ${createdProduct.name}`);
  //   })
  //   .catch(err => {
  //     console.error('ERROR:', err);
  //   });
//})
