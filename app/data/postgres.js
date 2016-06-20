import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

function getConnection (config) {
  return new Sequelize(config.name, config.user, config.password, {
    host: config.host,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });
}

function sync (callback) {
  exports.conn.sync({force: true}).then(function() {
    console.log('callback called, exports.conn.models = ', exports.conn.models);
    callback();
  }).catch(function(error) {
    callback(error);
  });
}

function createFakeData() {
  _.times(1, () => {
    return exports.conn.models.user.create({
      email: Faker.internet.email()
    }).then(user => {
      _.times(3, (i) => {
        return user.createItem({
          title: Faker.lorem.words() + ' ' + String(i),
          content: Faker.lorem.paragraph()
        });
      });
    });
  });
}


exports.define = function (config, callback) {
  exports.conn = getConnection(config);
  let User = exports.conn.define('user', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  let Item = exports.conn.define('item', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT
    },
    type: {
      type: Sequelize.ENUM('note')
    },
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  
  User.hasMany(Item);
  Item.belongsTo(User);
  
  sync(function (err) {
    if (err) {
      return callback(err);
    }
    createFakeData();
    callback();
  });
};

exports.getItems = function (args) {
  let query = {where: {}};
  if (args.title) {
    query.where.title = {$like: '%' + args.title + '%'};
  }
  query.limit = 20;
  return exports.conn.models.item.findAll(query).then(function (items) {
    return items.map(function ({title, content, id}) {
      return {title, content, id: String(id)};
    });
  });
};

exports.getItem = function (id) {
  return exports.conn.models.item.findById(id);
};

exports.addItem = function (item) {
  return exports.conn.models.item.create(item);
};

