import path from 'path';
import assert from 'assert';
import {toGlobalId, fromGlobalId} from 'graphql-relay';
import {hash, assertIsStrongEnough} from '../data/password';
import config from '../loadConfig';
const {Schema, setDb} = require('../data/schema');
import {graphql} from 'graphql';

describe('ItemsList', function() {
  it('should get items from db for user in session', function(done) {
    setDb({ 
      getItems: function (filter) { 
        if (filter.userId === 4) {
          done();
        } else {
          done(new Error('user id should match the one in the session, filter.userId = ' + filter.userId));
        }
      }
    });
    let session = { user: { id: 4 }};
    let query = (`
      {itemsList {
        id
        items {
          edges {
            node {
              id
              title
            }
          }
        }
      }}
    `);
    graphql(Schema, query, null, session);
  });

  it('should throw error if no user in session', function (done) {
    let query = (`
      {itemsList {
        id
        items {
          edges {
            node {
              id
              title
            }
          }
        }
      }}
    `);
    let session = {};
    graphql(Schema, query, null, session).then(function (result) {
      assert(String(result.errors[0]).indexOf('Authentication') > -1, 'error should be auth');
      assert(!result.data.item, 'item should not be returned as it belongs to a different user');
      done();
    }).catch(done);
  });
});

describe('get item', function() {

  it('should get item from db for user in session', function(done) {
    let itemGlobalId = toGlobalId('Item', '14');
    let query = `
      {item(id:"${itemGlobalId}") {
          id,
          title,
          content,
          tags
      }}
    `;
    setDb({
      getItem: function (id) { 
        assert.equal(id, 14);
        return new Promise(function(resolve, reject) {
          resolve({ title: 'example', userId: 4, id: '14' });
        });
      }
    });
    let session = { user: { id: 4 }};
    graphql(Schema, query, null, session).then(function (result) {
      let {type, id} = fromGlobalId(result.data.item.id);
      assert.equal(id, 14, 'the id should match');
      done();
    }).catch(done);
  });

  it('should return authentication error if item belongs to different user', function(done) {
    let itemGlobalId = toGlobalId('Item', '19');
    let query = `
      {item(id:"${itemGlobalId}") {
          id,
          title,
          content,
          tags
      }}
    `;
     setDb({
      getItem: function (id, userId) { 
        // return an item with a userId which matches the user
        return new Promise(function(resolve, reject) {
          resolve({ title: 'example', userId: 5, id: id });
        });
      }
    });
    let session = { user: { id: 4 }};
    graphql(Schema, query, null, session).then(function (result) {
      assert(String(result.errors[0]).indexOf('Authentication') > -1, 'error should be auth');
      assert(!result.data.item, 'item should not be returned as it belongs to a different user');
      done();
    }).catch(done);
  });

  it('should throw error if no user in session', function (done) {
    let itemGlobalId = toGlobalId('Item', '19');
    let query = `
      {item(id:"${itemGlobalId}") {
          id,
          title,
          content,
          tags
      }}
    `;
    let session = {};
    graphql(Schema, query, null, session).then(function (result) {
      assert(String(result.errors[0]).indexOf('Authentication') > -1, 'error should be auth');
      assert(!result.data.item, 'item should not be returned as it belongs to a different user');
      done();
    }).catch(done);
  });


});


describe('add item', function() {
  it('added item should have the userId of the session user', function(done) {
    let itemInput = {"title":"example","content":"content","tags":"","clientMutationId":"0"};
    let query = `
      mutation AddItemMutation ($itemInput: AddItemInput!) {
        addItem(input: $itemInput) {
          clientMutationId
        }
      }
    `;
     setDb({
      addItem: function (item) {
        if (item.userId === 7) {
          done();
          return {}; // prevent graphql from falling over.
        } else {
          done(new Error('user id should match the one in the session, item.userId = ' + item.userId));
        }
      }
    });
    let session = { user: { id: 7 }};
    graphql(Schema, query, null, session, { itemInput });
  });

  it('should throw error if no user in session', function (done) {
    let itemInput = {"title":"example","content":"content","tags":"","clientMutationId":"0"};
    let query = `
      mutation AddItemMutation ($itemInput: AddItemInput!) {
        addItem(input: $itemInput) {
          clientMutationId
        }
      }
    `;
    let session = {};
    graphql(Schema, query, null, session, { itemInput}).then(function (result) {
      assert(String(result.errors[0]).indexOf('Authentication') > -1, 'error should be auth');
      done();
    }).catch(done);
  });


});


describe('delete item', function () {
  it('delete on other users item should cause auth error', function (done) {
    let input_0 = {"itemToDeleteId":toGlobalId('Item', '34'), "clientMutationId":"1"};
    let query = `
      mutation DeleteItemMutation($input_0:DeleteItemInput!) {
        deleteItem(input:$input_0) {
          clientMutationId
        }
      }
    `;
    setDb({
      // delete item will get the item first to do the auth check.
      getItem: function (id) {
        // return an item with a userId which does not match the user
        return new Promise(function(resolve, reject) {
          resolve({ title: 'example', userId: 5, id: id });
        });
      }
    });
    let session = { user: { id: 9 }};
    graphql(Schema, query, null, session, { input_0 }).then(function (result) {
      let errorString = String(result.errors[0]);
      assert(errorString.indexOf('Authentication') > -1, 'error should be auth, error = ' + errorString);
      done();
    }).catch(done);
  });

  it('should throw error if no user in session', function (done) {
    let input_0 = {"itemToDeleteId":toGlobalId('Item', '34'), "clientMutationId":"1"};
    let query = `
      mutation DeleteItemMutation($input_0:DeleteItemInput!) {
        deleteItem(input:$input_0) {
          clientMutationId
        }
      }
    `;
    let session = {};
    graphql(Schema, query, null, session, {input_0}).then(function (result) {
      assert(String(result.errors[0]).indexOf('Authentication') > -1, 'error should be auth');
      done();
    }).catch(done);
  });

});


describe('update item', function () {
  it('update other users item causes auth error', function (done) {
    let input_0 = {
      id: toGlobalId('Item', '34'),
      title: "example",
      content: "content2",
      tags: "",
      clientMutationId: "0"
    };
    let query = `
      mutation UpdateItemMutation($input_0:UpdateItemInput!) {
        updateItem(input:$input_0) {
          clientMutationId
        }
      }
    `;
    setDb({
      // update item will get the item first to do the auth check.
      getItem: function (id) {
        // return an item with a userId which does not match the user
        return new Promise(function(resolve, reject) {
          resolve({ title: 'example', userId: 5, id: id });
        });
      }
    });
    let session = { user: { id: 9 }};
    graphql(Schema, query, null, session, { input_0 }).then(function (result) {
      let errorString = String(result.errors[0]);
      assert(errorString.indexOf('Authentication') > -1, 'error should be auth, error = ' + errorString);
      done();
    }).catch(done);
  });

  it('should throw error if no user in session', function (done) {
   let input_0 = {
      id: toGlobalId('Item', '34'),
      title: "example",
      content: "content2",
      tags: "",
      clientMutationId: "0"
    };
    let query = `
      mutation UpdateItemMutation($input_0:UpdateItemInput!) {
        updateItem(input:$input_0) {
          clientMutationId
        }
      }
    `;
    let session = {};
    graphql(Schema, query, null, session, {input_0}).then(function (result) {
      assert(String(result.errors[0]).indexOf('Authentication') > -1, 'error should be auth');
      done();
    }).catch(done);
  });
});

