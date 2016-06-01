import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import Db from './db';

var ItemType = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    id: {type: GraphQLString},
  }),
});

// This needs to exist due to a limitation in Relay
//https://github.com/facebook/relay/issues/112
var ItemsListType = new GraphQLObjectType({
  name: 'ItemsList',
  fields: () => ({
    items: {type: new GraphQLList(ItemType)},
  }),
});

export var Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      itemsList: {
        type: ItemsListType,
        resolve: function (root, args) {
          return Db.conn.models.item.findAll({where: args}).then(function (items) {
            return {items: items};
          });
        }
      }
    })
  })
});
