import { useState, useEffect } from "react";


interface ClockProps {
  onStop: (time: number) => void
}

const Clock = ({
  onStop,
} : ClockProps) => {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false); // Whether the clock is running
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null); // Interval reference

  // Start the clock
  const startClock = () => {
    if (isRunning) return; // Do nothing if the clock is already running
    setIsRunning(true);
    const id = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id as NodeJS.Timeout);
  };

  // Pause the clock
  const pauseClock = () => {
    if (!isRunning) return; // Do nothing if the clock is not running
    clearInterval(intervalId!); // Stop the interval
    setIsRunning(false);
  };

  // Stop the clock and reset it
  const stopClock = () => {
    clearInterval(intervalId!); // Stop the interval
    setIsRunning(false);
    setTime(0); // Reset time
  };

  // // Cleanup on unmount
  // useEffect(() => {
  //   return () => {
  //     if (intervalId) clearInterval(intervalId); // Clear the interval if the component is unmounted
  //   };
  // }, [intervalId]);

  return (
    <div className="text-center">
      <p className="text-sm text-white">
        Time: {new Date(time * 1000).toISOString().substr(11, 8)}
      </p>
      <div className="flex gap-4 mt-4">
      <button
          className={`${
            isRunning ? "bg-gray-500" : "bg-green-500"
          } text-white px-4 py-2 rounded`}
          onClick={startClock}
          disabled={isRunning}
        >
          Start
        </button>

        <button
          className={`${
            !isRunning ? "bg-gray-500" : "bg-yellow-500"
          } text-white px-4 py-2 rounded`}
          onClick={pauseClock}
          disabled={!isRunning}
        >
          Pause
        </button>

        <button
          className={`${
            !isRunning ? "bg-gray-500" : "bg-red-500"
          } text-white px-4 py-2 rounded`}
          onClick={() => {
            onStop(time);
            stopClock();
          }}
        >
          End
        </button>
      </div>
    </div>
  );
};

export default Clock;
