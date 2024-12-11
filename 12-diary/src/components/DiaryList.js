import React, { useState } from "react";
import Button from "./Button";
import "./DiaryList.css";
import DiaryItem from "./DiaryItem";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserAuth } from "../api/firebase";

const sortOptionList = [
  { name: "최신순", value: "latest" },
  { name: "오래된 순", value: "oldest" },
];
const filterOptionList = [
  { name: "전부다", value: "all" },
  { name: "좋은 감정만", value: "good" },
  { name: "안좋은 감정만", value: "bad" },
];

function ControlMenu({ optionList, value, onChange }) {
  return (
    <select
      className="ControlMenu"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {optionList.map((option, idx) => {
        return (
          <option key={idx} value={option.value}>
            {option.name}
          </option>
        );
      })}
    </select>
  );
}

function DiaryList({ diaryList }) {
  // diaryList 을 넣으면 필터링을 넣을 수 있다.
  const [order, setOrder] = useState("latest");
  const [filter, setFilter] = useState("all");
  const Navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user);
  // {isAuthenticated, awefr} 같은 객체로 묶어 쓰지 말고 따로 쓸 것
  // 오류는 안 나더라도 경고문구 나올 확률이 매우 높음
  const auth = getUserAuth();
  // 이러면 function DiaryList({ diaryList, auth }) { 중 auth
  // auth 제거 가능

  const checkLogin = () => {
    if (!auth.currentUser) {
      alert("로그인을 해주세요.");
      Navigate("/login");
    } else {
      Navigate("/new");
    }
  };

  const getSortedDiaryList = () => {
    // 필터링 함수
    const getFilteredList = (diary) => {
      if (filter === "good") {
        // filter state가 good 이면(emotion의 값이 3보다 작거나 같을 때)
        return diary.emotion <= 3;
      } else {
        // filter state가 good 이 아니면(emotion의 값이 3보다 클 때)
        return diary.emotion > 3;
      }
    };

    // [1, 11, 21].sort((a,b) => b - a);
    // 정렬 함수
    const getOrderedList = (a, b) => {
      if (order === "latest") {
        // order state가 latest 가 아니면 a - b
        return b.date - a.date;
      } else {
        // const filteredList = diaryList.filter((diary) => getFilteredList(diary));
        return a.date - b.date;
      }
    };
    const filteredList =
      filter === "all"
        ? diaryList
        : diaryList.filter((diary) => getFilteredList(diary));
    const sortedList = filteredList.sort(getOrderedList);
    return sortedList;
  };

  return (
    <div className="diaryList">
      <div className="menu_wrapper">
        <div className="control_menus">
          <ControlMenu optionList={sortOptionList} onChange={setOrder} />
          <ControlMenu optionList={filterOptionList} onChange={setFilter} />
        </div>

        <div className="new_btn">
          <Button
            text={"새 일기쓰기"}
            type="positive"
            onClick={checkLogin}
            // onClick={() => Navigate("/new")}
          />
        </div>
        {auth.currentUser && (
          <div>
            <Button
              text={"로그아웃"}
              type={"negative"}
              onClick={() => auth.signOut()}
            />
          </div>
        )}
      </div>
      {getSortedDiaryList().map((diary) => {
        return <DiaryItem key={diary.id} {...diary} />;
        {
          /* 원래 같았으면 홈페이지에서 렌더링을 하는데 다이어리에서 컴포넌트를 만들어서 할 수도 있다. */
        }
      })}
    </div>
  );
}

export default DiaryList;
