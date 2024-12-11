import React, { createContext, useEffect, useReducer } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewPage from "./pages/NewPage";
import {
  // additem,
  // deleteItem,
  //fetchItems,
  initialState,
  reducer,
  // updateItem, //새로운 아이템으로 바꾸려고 주석함
} from "./api/itemReducer";
import DiaryPage from "./pages/DiaryPage";
import EditPage from "./pages/EditPage";
import Button from "./components/Button";
import LoginPage from "./pages/LoginPage";
import { getUserAuth } from "./api/firebase";
import { userinitialState, userReducer } from "./api/userReducer";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  deleteItem,
  fetchItems,
  updateItem,
} from "./store/diarySlice";
import { loginSuccess, logout } from "./store/userSlice";

// 2개 컨텍스트 설정
export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

function App() {
  // const [state, dispatch] = useReducer(reducer, initialState);
  // [state, dispatch]
  // (reducer, initialState)는 itemReducer에서 export해서 가져옴
  // const navigate = useNavigate();
  const items = useSelector((state) => state.diary.items);
  const dispatch = useDispatch();

  const [userState, loginDispatch] = useReducer(userReducer, userinitialState);
  const auth = getUserAuth();
  const [user] = useAuthState(auth);

  useEffect(() => {
    // serialize(직렬화): 데이터를 저장할 때 저장할 수 있는 형태로 변환하는 것
    // serialize 가 안 되는 타입: promise, symbol, map, set, function, class
    if (user) {
      dispatch(loginSuccess([user.email, true, null]));
    } else {
      dispatch(logout([null, false, null]));
    }
  }, [user]);

  // const goLogin = () => {
  //   navigate("/login");
  // };

  // create
  const onCreate = async (values) => {
    const addObj = {
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      date: new Date(values.date).getTime(),
      content: values.content,
      emotion: values.emotion,
      userEmail: user.email,
    };
    const param = {
      collectionName: "diary",
      addObj,
    };
    // await additem("diary", addObj, dispatch);
    // addObj - 사용자가 입력한 값을 가져온다.
    dispatch(addItem(param));
  };

  // READ
  // UPDATE
  const onUpdate = async (values, docId) => {
    const updateObj = {
      updatedAt: new Date().getTime(),
      date: new Date(values.date).getTime(),
      content: values.content,
      emotion: values.emotion,
    };
    const param = {
      collectionName: "diary",
      docId: values.docId,
      updateObj: updateObj,
    };
    // await updateItem("diary", values.docId, updateObj, dispatch);
    dispatch(updateItem(param));
  };
  // DELETE
  const onDelete = async (docId) => {
    // await deleteItem('diary', docId, dispatch);
    const param = {
      collectionName: "diary",
      docId: docId,
    };
    dispatch(deleteItem(param));
  };

  useEffect(() => {
    //   fetchItems(
    //     "diary",
    //     {
    //       conditions: [
    //         {
    //           field: "userEmail",
    //           operator: "==",
    //           value: user ? user.email : "admin@gmail.com",
    //         },
    //         // 로그인한 사용자의 계정이 들어가야됨, 그 이메일이 있다면 여기에 넣어주면
    //         // 그 사람이 작성한 게시물만 가져와짐
    //       ],
    //       orderBys: [{ field: "date", direction: "desc" }],
    //     },
    //     dispatch
    //   );
    const param = {
      collectionName: "diary",
      queryOptions: {
        conditions: [
          {
            field: "userEmail",
            operator: "==",
            value: user ? user.email : "admin@gmail.com",
          },
        ],
        orderBys: [{ field: "date", direction: "desc" }],
      },
    };

    dispatch(fetchItems(param));
  }, [user]);
  //   dispatch(
  //     fetchItems({
  //       collectionName: "diary",
  //       queryOptions: {
  //         conditions: [
  //           {
  //             field: "userEmail",
  //             operator: "==",
  //             value: user ? user.email : "admin@gmail.com",
  //           },
  //         ],
  //         orderBys: [{ field: "date", direction: "desc" }],
  //       },
  //     })
  //   );
  // }, [user]);

  return (
    // 아래 2개 컨텍스트 범위 설정  DiaryStateContext, DiaryDisatchContext
    // <DiaryStateContext.Provider value={{ diaryList: items, auth }}>
    <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
      {/* auth: userState */}
      {/* 요런 것들은 없애고 아래에 프롭 만들어서 쓸 수도 있지만 개인취향이다.  */}
      <BrowserRouter>
        {/* 여기서 위 2개의 벨류 안의 내용물을 사용함  */}
        <div className="App">
          {/* <Button text={"로그인"} className="btn_login" /> */}
          {/* 네비게이션을 라우트 안 쪽에 써야 되는데 안 쪽에 쓸 수 없어서 다른 방법으로 바꿈 */}
          <Routes>
            <Route path="/">
              <Route index element={<HomePage />} />
              <Route path="new" element={<NewPage auth={auth} />} />
              <Route path="edit/:id" element={<EditPage />} />
              <Route path="diary/:id" element={<DiaryPage />} />
              <Route path="login" element={<LoginPage />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </DiaryDispatchContext.Provider>
    // </DiaryStateContext.Provider>
  );
}

export default App;
