/* @flow */

const initialState = {
  groupsList: [],
  groupsData: [],
  friendsData: [],
  balance: {}
};

export default function groups(state: Object = initialState, action: Object = {}) {
  switch (action.type) {
    case 'SET_GROUPS':
      return { ...state, groupsList: action.groups };
    case 'SET_GROUPS_DATA':
      return { ...state, groupsData: action.groupsData };
    case 'SET_FRIENDS_DATA':
      return { ...state, friendsData: action.friendsData };
    case 'SET_USER_BALANCE':
      return { ...state, balance: action.balance };
    default:
      return state;
  }
}
