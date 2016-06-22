import Relay from 'react-relay';
import _ from 'lodash';

export default class UpdateItemMutation extends Relay.Mutation {
  getVariables() {
    // server can decide how to handle this.
    return _.pick(this.props.item, ['id', 'title', 'content', 'tags']);
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateItemPayload {
        item
      }
    `
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          item: this.props.item.id
        },
      },
    ];
  }
  getMutation() {
    return Relay.QL`mutation { updateItem }`;
  }
}
