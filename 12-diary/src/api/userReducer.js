import { initialState } from "./itemReducer";
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

const userinitialState = {
  user: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case LOGIN:
      return;
    case LOGOUT:
      return;
    default:
      return state;
  }
}

export { userinitialState, userReducer };
