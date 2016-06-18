import Sequelize from 'sequelize';

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
};

function sync (callback) {
  exports.conn.sync({force: true}).then(function() {
    console.log('callback called, exports.conn.models = ', exports.conn.models);
    callback();
  }).catch(function(error) {
    callback(error);
  });
};

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
  
  sync(callback);
};

exports.getItems = function (args) {
  let query = {where: {}};
  if (args.title) {
    query.where.title = {$like: '%' + args.title + '%'};
  }
  query.limit = 20;
  return exports.conn.models.item.findAll(query);
};

exports.addItem = function (item) {
  var promise = new Promise(
    function(resolve, reject) {
      setTimeout(function() {
        exports.conn.models.item.create(item).then(function (result) {
          resolve(result);
        });
      }, 3000);
    }
  );
  return promise;
};

