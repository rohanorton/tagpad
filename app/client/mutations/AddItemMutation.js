var Relay = require('react-relay');

class AddItemMutation extends Relay.Mutation {
  getVariables() {
    // server can decide how to handle this.
    return {
      title: this.props.title,
      content: this.props.content
    }
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddItemPayload {
        itemList {
          items
        }
      }
    `
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          itemList: {id: '1'}
        }
      },
    ];
  }
  getMutation() {
    return Relay.QL`mutation { addItem }`;
  }
}

module.exports = AddItemMutation;
