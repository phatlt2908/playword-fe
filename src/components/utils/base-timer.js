import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

import styles from "./base-timer.module.scss";

const BaseTimer = forwardRef(function BaseTimer(props, ref) {
  const [time, setTime] = useState(props.maxTime);
  const [isOver, setIsOver] = useState(false);
  const [isUpTime, setIsUpTime] = useState(false);
  const [upValue, setUpValue] = useState(0);

  useEffect(() => {
    countdown();
  }, []);

  useEffect(() => {
    if (isOver) {
      props.onOver();
    }
  }, [isOver]);

  useEffect(() => {
    if (time <= -1) {
      setIsOver(true);
    }
  }, [time]);

  useImperativeHandle(ref, () => ({
    update(second) {
      setTime((time) => time + second);

      setUpValue(second);
      setIsUpTime(true);
      setTimeout(() => {
        setIsUpTime(false);
      }, 1000);
    },
  }));

  const countdown = () => {
    const interval = setInterval(() => {
      setTime((time) => {
        if (time < 0) {
          clearInterval(interval);
          return;
        }
        return time - 1;
      });
    }, 1000);
  };

  return (
    <>
      {time > -1 && (
        <div className={styles.timer}>
          <progress className="progress" value={time} max={props.maxTime} />

          {isUpTime && (
            <div className={`${styles.upTime} trans-bounce`}>
              <span className={upValue < 0 ? "has-text-danger-light" : ""}>
                {upValue > 0 && "+"}
                {upValue}s
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
});

export default BaseTimer;
