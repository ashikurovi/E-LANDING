"use client";
import { useEffect, useState } from "react";

const CountDown = () => {
  const [timeLeft, setTimeLeft] = useState(3600 + 34 * 60 + 21); // Example: 1 hour, 34 minutes, and 21 seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-1">
        <div className="bg-white w-full text-center rounded text-primary font-medium">
          {hours}
        </div>
        <p className="text-white sm:text-sm text-xs">Hours</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="bg-white w-full text-center rounded text-primary font-medium">
          {minutes}
        </div>
        <p className="text-white sm:text-base text-xs">Minutes</p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="bg-white w-full text-center rounded text-primary font-medium">
          {seconds}
        </div>
        <p className="text-white sm:text-sm text-xs">Seconds</p>
      </div>
    </div>
  );
};

export default CountDown;
