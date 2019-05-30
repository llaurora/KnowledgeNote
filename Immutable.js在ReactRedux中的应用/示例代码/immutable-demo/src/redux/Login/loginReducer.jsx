const initialState = { isLogin: false, userInfo: {} };
export default function loginInfo(state = initialState, action) {
  switch (action.type) {
    case 'CANCEL_LOGIN_STATE':
      return {
        ...state,
        ...{ isLogin: !state.isLogin, userInfo: action.data },
      };
    case 'CLEAR_LOGIN_STATE':
      return initialState;
    default:
      return state;
  }
}
