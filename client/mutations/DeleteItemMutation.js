import Relay from 'react-relay';
import _ from 'lodash';

export default class DeleteItemMutation extends Relay.Mutation {
  getVariables() {
    // server can decide how to handle this.
    return {itemToDeleteId: this.props.itemToDeleteId}
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteItemPayload {
        itemsList {
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
          itemsList: this.props.itemsListId
        },
      },
    ];
  }
  getMutation() {
    return Relay.QL`mutation { deleteItem }`;
  }
}
