import path from 'path';
//import assert from 'chai';
import assert from 'assert';
import mockery from 'mockery';
import {hash, assertIsStrongEnough} from '../data/password';
const config = require(path.join(process.env.HOME, 'tagpad_config.js'));
import {graphql} from 'graphql';

before(function () {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  });

});

after(function () {
  mockery.disable();
});

describe('ItemsList', function() {
  it('should get items from db for user in session', function(done) {
    var mockDb = {
			getItems: function (filter) { 
				assert.equal(filter.userId, 4, 'user id should match the one in the session');
				done();
			}
    };
    mockery.registerMock('./' + config.database + '.js', mockDb);
    const {Schema} = require('../data/schema');
		let session = {
			user: { email: 'user@example.com', id: 4 }
		};
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
		graphql(Schema, query, null, session).then(result => {
			done(result.errors);	
		}).catch(function (e) {
      done(e);
    });
	});
});


