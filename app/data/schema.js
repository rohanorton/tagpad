import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import Db from './db';

var UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    email: {type: GraphQLString},
    steepingTime: {type: GraphQLInt},
    id: {type: GraphQLString},
  }),
});


// This needs to exist due to a limitation in Relay
//https://github.com/facebook/relay/issues/112
var RootType = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    users: {type: new GraphQLList(UserType)},
  }),
});

export var Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      root: {
        type: RootType,
        resolve: function (root, args) {
          return new Promise(
            function(resolve, reject) {
              console.log('query for users');
              return Db.conn.models.user.findAll({where: args}).then(function (users) {
                resolve({users: users});
              });
            }
          );
        }
      },
    }),
  }),
});
