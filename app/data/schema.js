import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import path from 'path';

const config = require(path.join(process.env.HOME, 'tagpad_config.js'));
const db = require('./' + config.database + '.js');

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
    return db.addItem({title, content});
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
          title: { type: GraphQLString }
        },
        type: ItemsListType,
        resolve: function (root, args) {
          return db.getItemList({title: args.title}); 
        }
      }
    })
  })
});
