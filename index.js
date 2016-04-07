var fs = require('fs')
var path = require('path')
var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var format = require('util').format
var dataUriToBuffer = require('data-uri-to-buffer')

var app = express()

app.use(express.static('users'))
app.use(bodyParser())
app.use(cors())

app.get('/', function (req, res) {
  fs.readdir('users', function (err, files) {
    if (err || !files) {
      console.log(err)
      res.send('no')
    }
    res.json(files.filter(function (f) {
      return f.indexOf('.jpg') > -1
    }))
  })
})

app.post('/', function (req, res, next) {
  if (!req.body.datauri) return res.send('no data')
  var buffer = dataUriToBuffer(req.body.datauri)
  var filename = path.join(__dirname, 'users', Date.now() + '.jpg')
  fs.writeFile(filename, buffer, {encoding: 'binary'}, function (err) {
    if (err) return res.send('failed to save')
    res.send('done')
    console.log(filename)
  })
})

app.listen(1337, function () {
  console.log('ouroboros...')
})
