import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Db from './db';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';


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
    id: {type: GraphQLString},
    items: {type: new GraphQLList(ItemType)},
  }),
});


const GraphQLAddItemMutation = mutationWithClientMutationId({
  name: 'AddItem',
  inputFields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    itemList: {
      type: ItemsListType,
      resolve: function () {
        return getItemList({title:'f'});
      }
    },
  },
  mutateAndGetPayload: ({title, content}) => {
    console.log('add item here, title = ', title, ', content = ', content);
    return {itemListId: '1'};
  },
});


function getItemList(args) {
  var query = {where: {}};

  if (args.title) {
    query.where.title = {$like: '%' + args.title + '%'};
  }
  query.limit = 20;
  
  return Db.conn.models.item.findAll(query).then(function (items) {
    return {id: '1', items: items};
  });
}

export var Schema = new GraphQLSchema({
  mutation : new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      addItem: GraphQLAddItemMutation,
    },
  }),
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      itemsList: {
        args: {
          id: { type: GraphQLString },
          title: { type: GraphQLString }
        },
        type: ItemsListType,
        resolve: function (root, args) {
          return getItemList(args);
        }
      }
    })
  })
});
