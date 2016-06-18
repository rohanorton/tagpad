import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  globalIdField,
  mutationWithClientMutationId,
} from 'graphql-relay';

import path from 'path';

const config = require(path.join(process.env.HOME, 'tagpad_config.js'));
const db = require('./' + config.database + '.js');

const ItemType = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    id: {type: GraphQLString},
  }),
});


const {
  connectionType: ItemsConnection,
  edgeType: GraphQLItemEdge,
} = connectionDefinitions({
  name: 'Item',
  nodeType: ItemType,
});

// This needs to exist due to a limitation in Relay
//https://github.com/facebook/relay/issues/112
const ItemsListType = new GraphQLObjectType({
  name: 'ItemsList',
  fields: {
    id: {type: GraphQLString},
    items: {
      type: ItemsConnection,
      args: {
        title: {
          type: GraphQLString,
          defaultValue: '',
        },
       ...connectionArgs, 
      },
      resolve: (obj, {title, ...args}) =>
        connectionFromArray(db.getItems({title}), args),
    },
  },
});

const AddItemMutation = mutationWithClientMutationId({
  name: 'AddItem',
  inputFields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    itemEdge: {
      type: GraphQLItemEdge,
      resolve: (item) => {
        return {
          cursor: cursorForObjectInConnection(db.getItems(), item), 
          node: item
        };
      }
    },
    itemsList: {
      type: ItemsListType,
      resolve: function () {
        return { id: '1' };
      }
    },
  },
  mutateAndGetPayload: ({title, content}) => {
    return db.addItem({title, content});
  },
});


export const Schema = new GraphQLSchema({
  mutation : new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      addItem: AddItemMutation,
    },
  }),
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      itemsList: {
        args: {
          title: { type: GraphQLString }
        },
        type: ItemsListType,
        resolve: function (root, args) {
          return { id: '1' }
        }
      }
    }
  })
});
