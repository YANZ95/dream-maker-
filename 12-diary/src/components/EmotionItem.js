import React from "react";
import "./EmotionItem.css";

function EmotionItem({
  emotion_img,
  emotion_id,
  emotion_description,
  name,
  onClick,
  isSelected,
}) {
  // 다이어리 에디터 파일에서 스프레드 연산자에서 보낸 거 파라미터로 받아줌
  const handleClick = () => {
    onClick(name, emotion_id);
  };

  const emotionClass = `emotionItem ${
    isSelected ? "emotionItem_on_" + emotion_id : "emotionItem_off"
  }`;
  return (
    <div className={emotionClass} onClick={handleClick}>
      <img src={emotion_img} />
      <span> {emotion_description}</span>
    </div>
  );
}

export default EmotionItem;
