import { useEffect, useState } from "react";
const BaseTimer = ({ maxTime, onOver }) => {
  const [time, setTime] = useState(maxTime);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    countdown();
  }, []);

  useEffect(() => {
    if (isOver) {
      onOver();
    }
  }, [isOver]);

  const countdown = () => {
    const interval = setInterval(() => {
      setTime((time) => {
        if (time === -1) {
          clearInterval(interval);
          setIsOver(true);
          return;
        }
        return time - 1;
      });
    }, 1000);
  };

  return (
    <>
      {time > -1 && (
        <progress className="progress" value={time} max={maxTime} />
      )}
    </>
  );
};

export default BaseTimer;
