const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.post('/searchForProduct', (req, res) => {
    let image = req.body
    console.log(image);
})

app.listen(3000, () => {
    console.log('Running on port 3000')
})