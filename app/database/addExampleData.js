
var db = require('./db.js');
var config = require(process.env.HOME + '/tagpad_config.js').database;
var _ = require('lodash');
var Faker = require('faker');

 function createFakeData() {
    _.times(10, () => {
      return db.conn.models.user.create({
        email: Faker.internet.email()
      }).then(user => {
        return user.createItem({
          title: `Sample title by ${user.email}`,
          description: 'This is the same note'
        });
      });
    });
 }
exports.run = function () {
  createFakeData(); 
};


/*db.define(config, function (err) {
  console.log('models = ', db.conn.models);
  if (err) {
    throw err;
  } else {
    createFakeData();  
  }
});*/
