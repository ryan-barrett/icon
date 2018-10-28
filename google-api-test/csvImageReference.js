const csvFilePath='data.csv'
const csv=require('csvtojson')
let fs = require('fs'), request = require('request')

csv()
.fromFile(csvFilePath)
.then((json)=>{
  json.forEach(product=> {
    let uri = product.productURI
    request(uri).pipe(fs.createWriteStream(__dirname + "/images/" + product.ID + ".jpg"));
    //download(uri,"images/" + product.ID + ".jpg", function(){
    //  console.log(json);
    // })
  // })
})
})

// let download = function(uri, filename, callback){
//   request.head(uri, function(err, res, body){
//     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//   }).catch(error=>{
//     console.log(error)
//   });
// };
