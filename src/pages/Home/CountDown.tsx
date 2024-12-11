import React, { useState, useEffect } from "react";
import styles from "./CountDown.module.css";

const CountDown: React.FC = () => {
  const targetDate = new Date("2024-12-21T15:00:00Z"); // 목표 날짜 (2024년 12월 21일 자정)
  // 한국 표준 시를 고려하여 전날 15시로 설정해야 함

  // 상태 변수
  const [isClose, setIsClose] = useState<boolean>(false);
  const [onBurst, setOnBurst] = useState<boolean>(false);
  const [datetimeUntilTarget, setDatetimeUntilTarget] = useState<string>(""); // D-x / h-시간 / 🎉 / End.

  const updateOnMidnight = () => {
    const now = new Date();
    // 자정 갱신을 위한 타이머 계산
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0); // 자정 설정

    const timeUntilMidnight = nextMidnight.getTime() - now.getTime();
    return setTimeout(updateTime, timeUntilMidnight); // 자정마다 갱신
  };

  const updateOnNextHour = () => {
    const now = new Date();
    // 다음 정각 갱신을 위한 타이머 계산
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);

    const timeUntilNextHour = nextHour.getTime() - now.getTime();
    return setTimeout(updateTime, timeUntilNextHour); // 정각마다 갱신
  };

  const updateTime = () => {
    const now = new Date();
    const timeDiff = targetDate.getTime() - now.getTime();

    // D-10, D-9 등의 남은 날짜 계산
    if (timeDiff > 86400000) {
      const days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
      setDatetimeUntilTarget(`D-${days}`);

      return updateOnMidnight();
    }
    // D-1 일 때 남은 시간을 시, 분, 초로 계산
    if (timeDiff > 3600000) {
      const hours = Math.floor(timeDiff / 1000 / 60 / 60);
      setDatetimeUntilTarget(`${hours}H`);

      return updateOnNextHour();
    }

    // 10분전부터는 1분마다 갱신
    if (timeDiff > 0) {
      const minutes = Math.floor(timeDiff / 1000 / 60);
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      if (timeDiff <= 10000) {
        if (!isClose) {
          setIsClose(true);
        }

        if (seconds == 0) {
          setOnBurst(true);
        }
        setDatetimeUntilTarget(`${seconds}`);
      } else if (seconds === 59) {
        setDatetimeUntilTarget(`${minutes + 1}:00`);
      } else if (seconds < 9) {
        setDatetimeUntilTarget(`${minutes}:0${seconds + 1}`);
      } else {
        setDatetimeUntilTarget(`${minutes}:${seconds + 1}`);
      }

      return setTimeout(updateTime, 1000); // 1초마다
    }

    // 다음 날부터는 이벤트 종료
    if (timeDiff > -86400000) {
      setDatetimeUntilTarget("🎉");

      return updateOnMidnight();
    }

    setDatetimeUntilTarget("End.");
  };

  useEffect(() => {
    updateTime();

    return () => {};
  }, []);

  return (
    <>
      {!onBurst && (
        <p className={isClose ? styles.closeCountdown : styles.countdown}>
          {datetimeUntilTarget}
        </p>
      )}
      {onBurst && (
        <p className={styles.onBurst}>
          Happy,
          <br />
          Birth
          <br />
          Day 🎉
        </p>
      )}
    </>
  );
};

export default CountDown;
