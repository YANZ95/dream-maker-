import { addDatas, deleteDatas, getDatas, updateDatas } from "./firebase";
import { collection } from "firebase/firestore";

// action types
const FETCH_ITEMS = "FETCH_ITEMS";
// 비동기적으로 데이터를 가져와서 스토어에 저장할 때 사용
const ADD_ITEM = "ADD_ITEM";
// 새 아이템을 입력하고 저장할 때 주로 사용
const UPDATE_ITEM = "UPDATE_ITEM";
// 특정 아이템의 정보를 변경
const DELETE_ITEM = "DELETE_ITEM";
// 목록에서 아이템을 삭제하고자 할 때 사용
const SET_ERROR = "SET_ERROR";
// API 호출이 실패했거나 다른 오류가 발생했을 때 이를 처리하기 위해 사용

// initial state
export const initialState = {
  // Redux 상태 관리에서 사용되는 초기 상태(initialState)를 정의
  // 애플리케이션이 시작될 때 Redux 스토어가 가지게 되는 기본 상태를 설정
  items: [],
  // 아이템 목록을 저장하는 데 사용
  // 아직 로드된 아이템이 없으므로 빈 배열로 시작
  error: null,
  // 애플리케이션 시작 시에는 오류가 없으므로 null로 설정
  loading: false,
  // 로딩이 시작되면 true로 설정되고, 데이터가 성공적으로 로드되거나
  // 오류가 발생하면 false로 돌아옵니다.
};

export function reducer(state, action) {
  // 액션에 따라 애플리케이션 상태를 업데이트하는 순수 함수
  // 상태를 변경하는 방법과 액션 타입에 따라 상태가 어떻게
  // 업데이트되는지를 이해하는 것이 중요
  // state는 우리가 dispatch 함수를 호출할 때 명시적으로 건네주지 않아도
  // 리듀서가 알아서 관리를 하고 있다.
  // dispatch 함수를 호출할 때 넣어주는 객체가 action 으로 들어온다.
  switch (action.type) {
    case FETCH_ITEMS:
      return { ...state, items: action.payload, error: null };
    // 액션을 만들어주는 대가로 페이로드를 씀. <액션 크리에이터>
    //
    case ADD_ITEM:
      return { ...state, items: [...state.items, action.payload], error: null };
    // 교체되는 게 아니라 아예 새로운 걸로 바뀜. 리듀서는 순수함수임
    // 기존에 있던 state가 아니라 새로운 state로 바꿔주는 거임.
    // 리듀서는 새로운 거지만 그 안에 있는 함수는 바뀌면 안 됨
    case UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(
          (item) => (item.id === action.payload.id ? action.payload : item)
          // payload가 수정된 거
        ),
        error: null,
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.docId !== action.payload),
        error: null,
      };
    // 삭제하고 남은 나머지를 처리
    // 남겨야 되는 나머지 조건을 화살표로 처리
    //  불변성 유지 위해서 아이템 앞에 ...state,  추가함

    case SET_ERROR:
      return { ...state, error: action.payload };
      dafault: return state;
  }
}

// Actions(실제 reducer가 state를 변경하기 전에 수행해야 하 작업들)
export const fetchItems = async (collectionName, queryOptions, dispatch) => {
  const resultData = await getDatas(collectionName, queryOptions);
  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "FETCH DATAS 에러!!!" });
    // { type: SET_ERROR, payload: "FETCH DATAS 에러!!!" } => 액션
    // 페이로드를 만들어주는 거는 페이로드 크레이터 =>   const resultData = await getDatas(collectionName, queryOptions);
    // 여기선 얘가 그 역할을 함
  } else {
    dispatch({ type: FETCH_ITEMS, payload: resultData });
  }
};
export const additem = async (collectionName, addObj, dispatch) => {
  //  dispatch 할 변경된 state 값을 만들어야 한다.
  // 여기서 하려고 하는 게 아이템 추가
  const resultData = await addDatas(collectionName, addObj);
  // 여기서 resultData가 나온다는 것은 새로 추가된 문서객체가 들어있을 거임
  // 원래라면 resultData를 데리고 setState 써서 사용했을 거임
  // setState(prevItems => [...prevItems, resultData]);

  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "ADD Datas 에러!!!" });
  }

  //   dispatch 실행 시 reducer 함수로 간다.
  dispatch({ type: ADD_ITEM, payload: resultData });
};
export const updateItem = async (
  collectionName,
  docId,
  updateObj,
  dispatch
) => {
  const resultData = await updateDatas(collectionName, docId, updateObj);
  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "ADD Datas 에러!!!" });
  }

  //   dispatch 실행 시 reducer 함수로 간다.
  dispatch({ type: UPDATE_ITEM, payload: resultData });
};
export const deleteItem = async (collectionName, docId, dispatch) => {
  const resultData = await deleteDatas(collectionName, docId);
  // deleteDatas 끝내고 나서 디스패치 정리할 거임
  // 그게 리듀서 안에 정리를 해놓음, 디스패치 아이템 안에 리턴에 집어넣고
  // 불변하게 만들거임. 위에 DELETE_ITEM 참고
  if (!resultData) {
    dispatch({ type: SET_ERROR, payload: "DELETE Datas 에러!!!" });
  } else {
    dispatch({ type: DELETE_ITEM, payload: docId });
  }
};
