import { useEffect, useState } from "react";
const BaseCountdown = ({ totalTime, onTimeout, styleClass }) => {
  const [time, setTime] = useState(totalTime);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    countdown();
  }, []);

  useEffect(() => {
    if (isOver) {
      onTimeout();
    }
  }, [isOver]);

  const countdown = () => {
    const interval = setInterval(() => {
      setTime((time) => {
        if (time === 0) {
          clearInterval(interval);
          setIsOver(true);
          return;
        }
        return time - 1;
      });
    }, 1000);
  };

  return <div className={styleClass}>{time}</div>;
};

export default BaseCountdown;
