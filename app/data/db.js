var Sequelize = require('sequelize');

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

function sync (conn, callback) {
  conn.sync({force: true}).then(function() {
    module.exports.conn = conn;
    console.log('callback called, conn.models = ', module.exports.conn.models);
    callback();
  }).catch(function(error) {
    callback(error);
  });
};

exports.define = function (config, callback) {
  const conn = getConnection(config);

  var User = conn.define('user', {
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
  var Item = conn.define('item', {
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
  
  sync(conn, callback);
};

