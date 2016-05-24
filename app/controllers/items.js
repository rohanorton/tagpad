var express = require('express');
var router = express.Router();

exports.getRouter = function () {
  var Item = require('../database/db.js').models.Item;
  router.param('item_id', function(req, res, next, id) {
    Item.findOne({
      where: {
        id: id
      }
    }).then(function (items) {
      req.item = items && items[0];
      next();
    }).catch(function (err) {
      next(err);
    });
  });

  router.put('/:item_id', function(req, res) {
    var update = Object.assign({}, req.body, req.item);
    Item.update(update).then(function (count, items) {
      res.send(items[0]);
    });
  });

  router.post('/', function(req, res) {
    Item.create(req.body).then(function (createdItem) {
      req.send(createdItem);
    });
  });

  router.get('/', function(req, res) {
    Item.findAll().then(function (items) {
      res.send(items);
    });
  });

  router.get('/:item_id', function(req, res) {
    res.send(req.item);
  });


  return router;
};
