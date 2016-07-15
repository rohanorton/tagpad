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

function assertAuth(context) {
  if (!context.user) {
    throw new Error('Authentication required');
  }
}

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
    tags: {type: GraphQLString},
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
    content: { type: new GraphQLNonNull(GraphQLString) },
    tags: { type: new GraphQLNonNull(GraphQLString) }
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
  mutateAndGetPayload: (item, context) => {
    assertAuth(context);
    return db.addItem(item);
  },
});

const DeleteItemMutation = mutationWithClientMutationId({
  name: 'DeleteItem',
  inputFields: {
    itemToDeleteId: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    itemsList: {
      type: ItemsListType,
      resolve: function () {
        return { id: itemsListId };
      }
    },
  },
  mutateAndGetPayload: ({itemToDeleteId}, context) => {
    assertAuth(context);
    let localId = fromGlobalId(itemToDeleteId).id;
    db.deleteItem(localId);
    return { id: itemsListId };
  }
});

const UpdateItemMutation = mutationWithClientMutationId({
  name: 'UpdateItem',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    tags: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    item: {
      type: ItemType,
      resolve: function (item) {
        return item;
      }
    },
  },
  mutateAndGetPayload: (item, context) => {
    assertAuth(context);
    let localId = fromGlobalId(item.id).id;
    item.id = localId;
    return db.updateItem(item).then(function () {
      return db.getItem(localId);
    });
  },
});

export const Schema = new GraphQLSchema({
  mutation : new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      addItem: AddItemMutation,
      updateItem: UpdateItemMutation,
      deleteItem: DeleteItemMutation,
    },
  }),
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      node: nodeField,
      item: {
        args: { id: { type: GraphQLString } },
        type: ItemType,
        resolve: function (root, args, context) {
          assertAuth(context);
          var {type, id} = fromGlobalId(args.id);
          return db.getItem(id);
        }
      },
      itemsList: {
        args: {
          title: { type: GraphQLString }
        },
        type: ItemsListType,
        resolve: function (root, args, context) {
          assertAuth(context);
          return { id: itemsListId }
        }
      }
    }
  })
});
