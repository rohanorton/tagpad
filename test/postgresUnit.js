import assert from 'assert';
import postgres from '../data/postgres.js';
import _ from 'lodash';

describe('postgres', function() {
  describe('getItems', function () {
    it.only('filters items by specific userid', function (done) {
      // mock the item model with a 
      // version with just findAll
      // so we can assert the correct args are passed.
      _.set(postgres, 'conn.models.item.findAll', function (args) {
        assert.equal(args.where.userId, 29)
        done();
        return {then: _.noop}
      });
      postgres.getItems({userId: 29});
    });
  });
});

