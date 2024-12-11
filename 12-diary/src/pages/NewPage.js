import React, { useEffect } from "react";
import DiaryEditor from "../components/DiaryEditor";

function NewPage(props) {
  // 중간에 다리 역할만 한다.
  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = "감정 일기장 - 새 일기";
  }, []);
  return (
    <div>
      <DiaryEditor />
    </div>
  );
}
export default NewPage;
