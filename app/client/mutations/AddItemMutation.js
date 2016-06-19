import Relay from 'react-relay';

export default class AddItemMutation extends Relay.Mutation {
  getVariables() {
    // server can decide how to handle this.
    return {
      title: this.props.item.title,
      content: this.props.item.content
    }
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
