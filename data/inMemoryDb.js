let _ = require('lodash');
let Faker = require('faker');
let items = [];

function createFakeData() {
  for (let i = 2; i <= 5; i += 1) {
    items.push({
      id: String(i),
      title: Faker.lorem.words() + ' ' + String(i),
      content: Faker.lorem.paragraph(),
      tags: Faker.lorem.words()
    });
  }
}
exports.define = function (config, callback) {
  createFakeData();
  callback();
};


function getItemsSync(args) {
  if (args.title && args.title.length) {
    let filtered = _.filter(items, function (item) {
      return (item.title.indexOf(args.title) !== -1);  
    });
    return filtered;
  } else {
    return items;
  }
}

// must use promise here to stay compatible with postgres version
exports.getItems = function (args) {
  return (new Promise(
    function(resolve, reject) {
      resolve(getItemsSync(args));
    }
  ));
};

exports.getItem = function (id) {
  return (new Promise(
    function(resolve, reject) {
      resolve(_.filter(items, function (item) { return item.id === id; })[0]);
    }
  ));
};

exports.updateItem = function (itemToUpdate) {
  return (new Promise(
    function(resolve, reject) {
      items = _.map(items, function (item) {
        if (item.id === itemToUpdate.id) {
          return itemToUpdate;
        } else {
          return item;
        }
      });
      resolve(itemToUpdate);
    }
  ));
};

exports.deleteItem = function (id) {
  return (new Promise(
    function(resolve, reject) {
      items = _.filter(items, function (item) { return item.id !== id; });
      resolve();
    }
  ));
};




exports.addItem = function (item) {
  item.id = String(items.length + 2);
  items.push(item);
  return item;
};

