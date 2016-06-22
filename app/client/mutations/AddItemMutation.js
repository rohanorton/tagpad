import Relay from 'react-relay';
import _ from 'lodash';

export default class AddItemMutation extends Relay.Mutation {
  getVariables() {
    // server can decide how to handle this.
    return _.pick(this.props.item, ['title', 'content', 'tags']);
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddItemPayload {
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
    return Relay.QL`mutation { addItem }`;
  }
}
