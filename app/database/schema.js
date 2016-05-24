import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} from 'graphql';
import Db from './db';

const User = new GraphQLObjectType({
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
      }
    }
  }
});

const Item = new GraphQLObjectType({
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
          return item.id;
        }
      },
      description: {
        type: GraphQLString,
        resolve(item) {
          return item.description;
        }
      }
    }
  }
});


const Query = new GraphQLObjectType({
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
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query
});

export default Schema;
