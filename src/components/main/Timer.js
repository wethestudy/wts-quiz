import React, {useState, useEffect, useRef} from "react";
import timerStyles from './styles/timer.module.css'

const Timer = ({initSeconds=0, onTimerEnd, disable=false}) => {
  const [seconds, setSeconds] = useState(initSeconds);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if(!disable){
      const handleTick = () => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
            if (onTimerEnd) {
              // Use setTimeout to wait for the onTimerEnd callback to complete
              setTimeout(() => {
                onTimerEnd();
                clearInterval(intervalIdRef.current);
              }, 0);
            }
            return 0;
          }
          return prevSeconds - 1;
        });
      };
  
      intervalIdRef.current = setInterval(handleTick, 1000);
  
      return () => {
        clearInterval(intervalIdRef.current);
      };
    }
  }, [onTimerEnd]);

    const formattedTime = () => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  
      return `${minutes}:${formattedSeconds}`;
    };

    return <div className={timerStyles['timer-wrapper']}>
      <div className={timerStyles['timer-bar-wrapper']}>
        <div 
          className={timerStyles['timer-bar-gauge']} 
          style={!disable ? {animation: `${timerStyles['decreaseWidth']} ${initSeconds}s linear`} : {width: "50%"}}></div>
      </div>
      <div>{formattedTime()}</div>
    </div>
}

export default Timer