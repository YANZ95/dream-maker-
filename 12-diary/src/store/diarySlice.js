import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addDatas, deleteDatas, getDatas, updateDatas } from "../api/firebase";

const diarySlice = createSlice({
  name: "diary",
  initialState: {
    items: [],
    // 바꾸고자 하는 녀석
    error: null,
    status: "welcome",
  },
  reducers: {
    // 비동기 아닌 거 작업해주는 애
  },
  extraReducers: (builder) => {
    // 비동기작업은 .actionCreator 를 자동으로 만들어주지 못한다.
    // 그래서 아래에 임의로 만들어준 거임
    builder
      .addCase(fetchItems.pending, (state, action) => {
        // pending =>
          console.log(action);
        state.status = "Loading";
        // 불변성을 유지하는 상태
        // 뒤에서 이런 작업들을 알아서 처리해줌
        // 원래는 리듀서에서는 스위치문 썻는데 편리함을 위해 스테이트를 써주게 됨
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        // fulfilled => 완료된 상태
        console.log(action);
        state.items = action.payload;
        state.status = 'complete';
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.status = "fail";
        // ----------------------------------------------
        // state.items.map((item) => {
        //   item.id === action.payload.id ? action.paload : item;
        // });
        //  state.items.map => 바꾸려고 하는 녀석
        // 원본 냅두고 바꾸는 것, 웝본 냅두고 참조하는 것, 원본 냅두고 참조하고 반복하는 것
        // 23번째를 쓴다. 반복해서 참조하는 것이 맵함수다.
        // 필터 함수 쓰는 이유 -> 원하는 것을 뽑으려고
        // 원초적인 것은 인덱스만 찾으면 됨
        //state.items[index] = {} //-> 이 방법이 더 쉬운 방법이다.
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = 'complete';
      })
      .addCase(updateItem.fulfilled, (state, action) => {
             // state.items = state.items.map(item => {
        //   item.id === action.payload.id ? action.payload : item
        // })
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        state.items[index] = action.payload;
        state.status = "complete";
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.docId !== action.payload
        );
        state.status = "complete";
      });
  },
});

const fetchItems = createAsyncThunk(
  "items/fetchAllItems",
  async ({ collectionName, queryOptions }) => {
    try {
      const resultData = await getDatas(collectionName, queryOptions);
      // dispatchEvent({type: "FETCH_ITEM", payload: resultData});
      return resultData;
    } catch (error) {
      console.log("FETCH Error: ", error);
    }
  }
);
// 원래 비동기 함수 관리하는 게 굉장히 까다로운데 패치아이템 함수 쓰면 편해짐

const addItem = createAsyncThunk(
  // 파라미터를 만들면 두번 째에 들어간다.
  "items/addItem",
  async ({ collectionName, addObj }) => {
    try {
      const resultData = await addDatas(collectionName, addObj);
      return resultData;
    } catch (error) {
      console.log("ADD Error:", error);
    }
  }
);

// type, payload;
// dispatch({});
// => 아이템리듀서에서 이렇게 씀
// 페이로드 => 디스패치에 전달
// createAsyncThunk가 알아서 요 모양을 만들어준다. => (type, payload)
// 비동기 로직을 처리 => createAsyncThunk

const updateItem = createAsyncThunk(
  // 함수의 로직 안에 비동기 함수가 들어있는 게 createAsyncThunk
  // 액션과 크레이이터를 디스패치라고 한다?
  "items/updateItem",
  async ({ collectionName, docId, updateObj }) => {
    try {
      const resultData = await updateDatas(collectionName, docId, updateObj);
      // 요 함수가 끝나면 디스패치와 페이로드 안으로 들어간다.
      //  디스패치가 실행하면 들어가는 곳이 리듀서임
      return resultData;
    } catch (error) {
      console.log("UPDATE Error:", error);
    }
  }
);

const deleteItem = createAsyncThunk(
  // 액션크레이터를 만들어주는 게 createAsyncThunk?
  "items/deleteItem",
  async ({ collectionName, docId }) => {
    // 하나로 들어오게 하기 위해서 중괄호로 감싼 거
    // 계속 보려고 노력하다 보면 흐름을 파악할 수 있게 됨
    // 흐름을 먼저 파악해야 학생들이 손을 댈 수 있음
    try {
      const resultData = await deleteDatas(collectionName, docId);
      return docId;
    } catch (error) {
      console.log("DELETE Error:", error);
    }
  }
);

export default diarySlice;
export { fetchItems, addItem, updateItem, deleteItem };
// export const {fetchItems} = diarySlice.actions
// 위에서 만들어줘서 그대로 빼오기만 하면 됨
