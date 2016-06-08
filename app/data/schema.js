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
        return db.getItemList({title:''});
      }
    },
  },
  mutateAndGetPayload: ({title, content}) => {
    console.log('add item here, title = ', title, ', content = ', content);
    return {itemListId: '1'};
  },
});



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
          return db.getItemList(args);
        }
      }
    })
  })
});
