import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';
import passwordHelper from './password.js';

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
    callback();
  }).catch(function(error) {
    callback(error);
  });
}

function createFakeData(callback) {
  let email = Faker.internet.email();
  let password = Faker.internet.password();
  console.log(email, password);
  passwordHelper.hash(password, function (err, hash) {
    if (err) {
      return callback(err);
    }
    exports.conn.models.user.create({
      email: email,
      password: hash
    }).then(user => {
      _.times(3, (i) => {
        return user.createItem({
          title: Faker.lorem.words() + ' ' + String(i),
          content: Faker.lorem.paragraph(),
          tags: Faker.lorem.words()
        });
      });
    }).catch(callback).then(callback);
  });
}


exports.connect = function (config) {
  exports.conn = getConnection(config);
  let User = exports.conn.define('user', {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
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
    tags: {
      type: Sequelize.STRING
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

}

exports.sync = function (callback) {
  sync(function (err) {
    if (err) {
      return callback(err);
    }
    createFakeData(callback);
  });
};

exports.getItems = function (args) {
  let query = {where: {}};
  if (args.title) {
    query.where.title = {$like: '%' + args.title + '%'};
  }

  query.limit = 20;

  if (args.userId) {
    query.where.userId = args.userId;
  }

  return exports.conn.models.item.findAll(query).then(function (items) {
    return items.map(function ({title, content, id, tags}) {
      return {title, content, id: String(id), tags: tags || ""};
    });
  });
};

exports.getItem = function (id) {
  return exports.conn.models.item.findById(id);
};

exports.getUserByEmail = function (email) {
  return exports.conn.models.user.findOne({where: {email}});
};

exports.addUser = function ({email, password}) {
  return exports.conn.models.user.create({email, password});
};

exports.addItem = function (item) {
  return exports.conn.models.item.create(item);
};

exports.deleteItem = function (id) {
  return exports.conn.models.item.destroy({where: {id}});
};

exports.updateItem = function (item) {
  return exports.conn.models.item.update(item, {where: {id: item.id}} );
};

