import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} from 'graphql';
import Db from './db';

var UserType = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id
        }
      },
      email: {
        type: GraphQLString,
        resolve(user) {
          return user.email;
        }
      },
      /*items: {
        type: new GraphQLList(Item),
        resolve(user) {
          return user.getItems();
        }
      }*/
    }
  }
});

var StoreType = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    users: { type: new GraphQLList(UserType)},
  }),
});


let STORE = {
  users: [
    {email: 'foo1@bar.com', id: 0},
    {email: 'foo2@bar.com', id: 1},
    {email: 'foo3@bar.com', id: 2},
    {email: 'foo4@bar.com', id: 3},
  ],
};



export var Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query', 
    fields: () => ({
      store: {
        type: StoreType,
        resolve: () => STORE,
      }
    })
  })
});



/*const Item = new GraphQLObjectType({
  name: 'Item',
  description: 'This is an Item',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(item) {
          return item.id;
        }
      },
      title: {
        type: GraphQLString,
        resolve(item) {
          return item.title;
        }
      },
      description: {
        type: GraphQLString,
        resolve(item) {
          return item.description;
        }
      },
      user: {
        type: User,
        resolve(item) {
          return item.getUser();
        }
      }
    }
  }
});*/


/*const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields: () => {
    return {
      users: {
        type: new GraphQLList(User),
        args: {
          id: { 
            type: GraphQLInt
          },
          email: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return Db.conn.models.user.findAll({where: args});
        }
      },
      items: {
        type: new GraphQLList(Item),
        args: {
          id: { 
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          },
          description: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return Db.conn.models.item.findAll({where: args});
        }
      }
    }
  }
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Function to create stuff',
  fields() {
    return {
      addItem: {
        type: Item,
        args: {
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(_, args) {
          return Db.conn.models.item.create({
            title: args.title,
            description: args.description
          });
        }
      }
    }
  }
});

export var Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
*/
