import Immutable from 'immutable';

const $initialState = Immutable.fromJS({ isLogin: false, userInfo: {} });
export default function($state = $initialState, action) {
  switch (action.type) {
    case 'CANCEL_LOGIN_STATE':
      return Immutable.mergeDeep($state, {
        isLogin: true,
        userInfo: action.data,
      });
    case 'CLEAR_LOGIN_STATE':
      return $initialState;
    default:
      return $state;
  }
}
