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
var ItemsViewType = new GraphQLObjectType({
  name: 'ItemsView',
  fields: () => ({
    items: {type: new GraphQLList(ItemType)},
  }),
});

export var Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      itemsView: {
        type: ItemsViewType,
        resolve: function (root, args) {
          return Db.conn.models.item.findAll({where: args}).then(function (items) {
            return ({items: items});
          });
        }
      }
    })
  })
});
