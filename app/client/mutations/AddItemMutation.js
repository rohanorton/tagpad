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
        itemEdge,
        itemsList {
          items
        }
      }
    `
  }
  getConfigs() {
    return [
      {
        type: 'RANGE_ADD',
        //type: 'FIELDS_CHANGE',
        parentName: 'itemsList',
        parentID: this.props.itemsListId,
        connectionName: 'items',
        edgeName: 'itemEdge',
        rangeBehaviors: () => {
          return 'append'
        }
      },
      //{
        // field in the fat query would normally be ignored.
        // `REQUIRED_CHILDREN` forces it to be retrieved anyway.
        /*type: 'REQUIRED_CHILDREN',
        children: [
          Relay.QL`
            fragment on AddItemPayload {
              itemEdge,
              itemsList {
                items
              }
            }
          `,
        ]*/
      //}
    ];
  }
  getMutation() {
    return Relay.QL`mutation { addItem }`;
  }
}
