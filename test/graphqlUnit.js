import path from 'path';
import assert from 'assert';
import mockery from 'mockery';
import {toGlobalId, fromGlobalId} from 'graphql-relay';
import {hash, assertIsStrongEnough} from '../data/password';
const config = require(path.join(process.env.HOME, 'tagpad_config.js'));
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
});


describe('add item', function() {
  it('added item should have the userId of the session user', function(done) {
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
	  let session = { user: { id: 7 }};
    graphql(Schema, query, null, session).then(function (result) {
      assert(String(result.errors[0]).indexOf('Authentication') > -1, 'error should be auth');
      assert(!result.data.item, 'item should not be returned as it belongs to a different user');
      done();
    }).catch(done);
  });
});
