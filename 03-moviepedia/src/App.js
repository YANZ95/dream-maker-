import { useEffect, useState } from 'react';
import './App.css';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import logoImg from './assets/logo.png';
import mockItems from './mock.json';
import {
  addDatas,
  deleteDatas,
  getDatas,
  getDatasByOrder,
  getDatasByOrderLimit,
  updateDatas,
} from './firebase';
import LocaleSelect from './LocaleSelect';
// 이 부분에서는 필요한 모듈과 파일을 가져옵니다. 
// useEffect와 useState는 React 훅(hook)으로 컴포넌트의 상태 관리와 라이프사이클 이벤트를 
// 처리하는 데 사용됩니다. App.css는 스타일 시트, ReviewForm과 ReviewList는 다른 컴포넌트, 
// logoImg는 로고 이미지, mockItems는 JSON 데이터, firebase는 Firebase 관련 함수들, 
// LocaleSelect는 지역 선택 컴포넌트를 가져옵니다.

const LIMIT = 10;
// 데이터를 가져올 때 사용할 최대 항목 수를 정의하는 상수

function AppSortButton({ children, onClick, selected }) {
  let isSelected = '';
  if (selected) {
    isSelected = 'selected';
  }
  return (
    <button className={`AppSortButton ${isSelected}`} onClick={onClick}>
      {children}
    </button>
  );
}
// 이 컴포넌트는 정렬 버튼을 렌더링합니다. selected prop이 true일 경우 버튼에 
// 'selected' 클래스를 추가하여 스타일을 변경합니다. 
// onClick prop은 버튼 클릭 시 호출될 함수입니다

function App() {
  // App 컴포넌트는 애플리케이션의 주요 로직을 담당합니다. 
  // useState를 사용하여 상태를 관리합니다
  const [items, setItems] = useState([]);
  // items: 리뷰 목록 데이터
  const [order, setOrder] = useState('createdAt');
  // order: 정렬 순서
  const [lq, setLq] = useState();
  // lq: 마지막 쿼리(페이징 처리에 사용)
  const [hasNext, setHasNext] = useState(true);
  // hasNext: 더 가져올 데이터가 있는지 여부

  const handleLoad = async (options) => {
    // handleLoad 함수는 데이터를 가져오는 함수
    // options 매개변수로 정렬 순서와 페이징 정보를 받음.
    // 데이터를 가져온 후 상태를 업데이트함
    const { resultData, lastQuery } = await getDatasByOrderLimit(
      'movie',
      options
    );
    if (!options.lq) {
      setItems(resultData);
    } else {
      setItems((prevItems) => [...prevItems, ...resultData]);
    }
    if (!lastQuery) {
      setHasNext(false);
    }
    setLq(lastQuery);
  };
  const handleNewestClick = () => setOrder('createdAt');
  const handleBestClick = () => setOrder('rating');
  // 이 함수들은 정렬 순서를 변경합니다. 
  // 각각 최신순과 베스트순으로 설정합니다.
  const handleMoreClick = () => {
    handleLoad({ order: order, limit: LIMIT, lq: lq });
  };
  // 더보기 버튼 클릭 시 추가 데이터를 로드합니다.
  const handleAddSuccess = (data) => {
    setItems((prevItems) => [data, ...prevItems]);
  };
// 리뷰가 성공적으로 추가되면 items 상태를 업데이트하여 
// 새 리뷰를 목록의 맨 앞에 추가
  const handleUpdateSuccess = (result) => {
    // 화면처리.. 기존데이터는 items 에서 삭제, 수정된 데이터는 items 의 기존 위치에 추가
    setItems((prevItems) => {
      const splitIdx = prevItems.findIndex(item => item.id === result.id);

      return [
        ...prevItems.slice(0, splitIdx),
        result,
        ...prevItems.slice(splitIdx + 1)
      ];
    })
  }
// 리뷰가 업데이트되면 items 상태를 업데이트하여 기존 항목을 수정된 항목으로 교체
  const handleDelete = async (docId, imgUrl) => {
    // 1. 파이어베이스에 접근해서 imgUrl 을 사용해 스토리지에 있는 사진파일 삭제
    // 2. docId 를 사용해 문서 삭제
    const result = await deleteDatas('movie', docId, imgUrl);
    // db에서 삭제를 성공햇을 때만 그 결과를 화면에 반영한다.
    if (!result) {
      alert('저장된 이미지 파일이 없습니다. \n관리자에게 문의하세요.');
      return false;
    }
    // 3. items 에서 docId 가 같은 요소(객체)를 찾아서 제거
    // setItems((prevItems) => {
    //   const filteredArr = prevItems.filter(item => {
    //     return item.docId !== docId;
    //   })
    //   return filteredArr;
    // })
    setItems((prevItems) => prevItems.filter((item) => item.docId !== docId));
  };
  // 리뷰를 삭제하는 함수입니다. Firebase에서 데이터를 
  // 삭제한 후 items 상태에서 해당 항목을 제거합니다.
  useEffect(() => {
    handleLoad({ order: order, limit: LIMIT });
    setHasNext(true);
  }, [order]);
// 컴포넌트가 마운트되거나 order 상태가 변경될 때 
// 데이터를 로드합니다.
  return (
    <div className='App'>
      <nav className='App-nav'>
        <div className='App-nav-container'>
          <img className='App-logo' src={logoImg} />
          <LocaleSelect />
        </div>
      </nav>
      <div className='App-container'>
        <div className='App-ReviewForm'>
          <ReviewForm
            onSubmit={addDatas}
            handleSubmitSuccess={handleAddSuccess}
          />
        </div>
        <div className='App-sorts'>
          <AppSortButton
            selected={order === 'createdAt'}
            onClick={handleNewestClick}
          >
            최신순
          </AppSortButton>
          <AppSortButton
            selected={order === 'rating'}
            onClick={handleBestClick}
          >
            베스트순
          </AppSortButton>
        </div>
        <div className='App-ReviewList'>
          <ReviewList
            items={items}
            handleDelete={handleDelete}
            onUpdate={updateDatas}
            onUpdateSuccess={handleUpdateSuccess}
          />
          {/* {hasNext && (<button className='App-load-more-button' onClick={handleMoreClick}>
            더보기
          </button>)} */}
          <button
            className='App-load-more-button'
            onClick={handleMoreClick}
            disabled={!hasNext}
          >
            더보기
          </button>
        </div>
      </div>
      <footer className='App-footer'>
        <div className='App-footer-container'>| 개인정보 처리방침</div>
      </footer>
    </div>
  );
}

export default App;
// 이 코드의 주요 흐름은 Firebase에서 데이터를 가져와 
// 정렬하고, 추가, 수정, 삭제 등의 작업을 수행하는 
// 리뷰 애플리케이션을 만드는 것입니다. 각 기능은 적절한 
// React 훅과 상태 관리를 통해 구현되었습니다.