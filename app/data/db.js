import Sequelize from 'sequelize';

const conn = getConnection(config);

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
  conn = getConnection(config);

  const User = conn.define('user', {
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
  const Item = conn.define('item', {
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

exports.getItemList = function (args) {
  let query = {where: {}};
  if (args.title) {
    query.where.title = {$like: '%' + args.title + '%'};
  }
  query.limit = 20;
  return conn.models.item.findAll(query).then(function (items) {
    return {id: '1', items: items};
  });
};

/*exports.addItem = function (item) {
  return Db.

};*/


