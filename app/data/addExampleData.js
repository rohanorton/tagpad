
var db = require('./db.js');
var config = require(process.env.HOME + '/tagpad_config.js').database;
var _ = require('lodash');
var Faker = require('faker');

 function createFakeData() {
    _.times(2, () => {
      return db.conn.models.user.create({
        email: Faker.internet.email()
      }).then(user => {
        _.times(200, (i) => {
          return user.createItem({
            title: Faker.lorem.words() + ' ' + String(i),
            content: Faker.lorem.paragraph()
          });
        })

      });
    });
 }
exports.run = function () {
  createFakeData(); 
};
