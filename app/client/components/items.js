
app.get('/items.json', function (req, res) {
  res.sendFile(path.join(__dirname, 'items.json'));
});

