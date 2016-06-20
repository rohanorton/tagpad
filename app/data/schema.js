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
  nodeDefinitions,
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';

import path from 'path';
const config = require(path.join(process.env.HOME, 'tagpad_config.js'));
const db = require('./' + config.database + '.js');


// Doesn't matter what this is as there is only 1 itemsList
const itemsListId = 'itemsList'; 

// Used to create getItemById
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Item') {
      return db.getItem(id);
    } else {
      return null;
    }
  },
  (obj) => {
    let type = 'Item';
    if (type === 'Item') {
      return ItemType;
    } else {
      return null;
    }
  }
);


const ItemType = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    title: {type: GraphQLString},
    content: {type: GraphQLString},
    id: globalIdField('Item'),
  }),
  interfaces: [nodeInterface]
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
    id: globalIdField('ItemsList'),
    items: {
      type: ItemsConnection,
      args: {
        title: {
          type: GraphQLString,
          defaultValue: '',
        },
       ...connectionArgs, 
      },
      resolve: function (obj, {title, ...args}) {
        return db.getItems({title}).then(function (items) {
          return connectionFromArray(items, args);
        });
      }
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
        return { id: itemsListId };
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
      node: nodeField,
      item: {
        args: { id: { type: GraphQLString } },
        type: ItemType,
        resolve: function (root, args) {
          var {type, id} = fromGlobalId(args.id);
          return db.getItem(id);
        }
      },
      itemsList: {
        args: {
          title: { type: GraphQLString }
        },
        type: ItemsListType,
        resolve: function (root, args) {
          return { id: itemsListId }
        }
      }
    }
  })
});
