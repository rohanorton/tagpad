var express = require('express');
var app = express();

app.get('/foo', function (req, res) {
  res.send('express app says hello');
});

app.get('/items/foo', function (req, res) {
  res.send([1,2,3,4]);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
