import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, // 유저 정보
    isAuthenticated: false, // 로그인 상태
    error: null, // 에러 메세지
  },
  reducers: {
    // 로그인 성공 함수, 로그인 실패 함수, 로그아웃을 이 리듀서 안에 가져와서 입력을 한다.
    loginSuccess(state, action) {
      setUserState(state, action);
      // loginSuccess : loginSuccess(staste, action)  loginSuccess 생략
      //   Object.keys(state).forEach((key, i) => {
      //     state[key] = action[i];
      //   });
      //   state.user = action.payload;
      //   state.isAuthenticated = true;
      //   state.error = null;
    },
    loginFailure(state, action) {
      setUserState(state, action);
      //   state.user = null;
      //   state.isAuthenticated = false;
      //   state.error = action.payload;
    },
    logout(state, action) {
      setUserState(state, action);
      //   state.user = null;
      //   state.isAuthenticated = false;
      //   state.error = null;
    },
  },
  //   액션에다 값을 넣어주고 값을 유지하는 방법이 있나?
});

function setUserState(state, action) {
  Object.keys(state).forEach((key, idx) => {
    state[key] = action.payload[idx];
  });
}

export default userSlice;
// export const {} = userSlice.actions;
//   reducers: {} 없애고 싶으면 위에꺼 써야 됨
export const { loginSuccess, loginFailure, logout } = userSlice.actions;
