import React, { useState, useEffect } from 'react';
import './PomodoroClock.css';

const PomodoroClock = () => {
  const [workTime, setWorkTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [longBreakTime, setLongBreakTime] = useState(15 * 60);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime === 0) {
            handleEndOfCycle();
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isWork, round, workTime, breakTime, longBreakTime]);

  const handleEndOfCycle = () => {
    if (isWork) {
      setRound(prevRound => prevRound + 1);
      if ((round + 1) % 4 === 0) {
        setTimeLeft(longBreakTime);
      } else {
        setTimeLeft(breakTime);
      }
      setIsWork(false);
      playSound('break');
    } else {
      setTimeLeft(workTime);
      setIsWork(true);
      playSound('work');
      setCurrentTaskIndex(prevIndex => (prevIndex + 1) % tasks.length);
    }
    setHistory(prevHistory => [...prevHistory, { type: isWork ? 'Work' : 'Break', duration: isWork ? workTime : (round + 1) % 4 === 0 ? longBreakTime : breakTime }]);
  };

  const playSound = (type) => {
    const audio = new Audio(type === 'work' ? '/sounds/work.mp3' : '/sounds/break.mp3');
    audio.play();
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(workTime);
    setIsWork(true);
    setRound(0);
    setCurrentTaskIndex(0);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="pomodoro-clock">
      <h3>番茄钟</h3>
      <div className="settings">
        <label>
          工作时间（分钟）:
          <input type="number" value={workTime / 60} onChange={(e) => setWorkTime(e.target.value * 60)} />
        </label>
        <label>
          休息时间（分钟）:
          <input type="number" value={breakTime / 60} onChange={(e) => setBreakTime(e.target.value * 60)} />
        </label>
        <label>
          长休息时间（分钟）:
          <input type="number" value={longBreakTime / 60} onChange={(e) => setLongBreakTime(e.target.value * 60)} />
        </label>
      </div>
      <div className="timer">
        <div className={`timer-display ${isWork ? 'work' : 'break'}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${((isWork ? workTime : (round + 1) % 4 === 0 ? longBreakTime : breakTime) - timeLeft) / (isWork ? workTime : (round + 1) % 4 === 0 ? longBreakTime : breakTime) * 100}%` }}
          ></div>
        </div>
        <div className="controls">
          <button onClick={handleStart} disabled={isRunning}>开始</button>
          <button onClick={handlePause} disabled={!isRunning}>暂停</button>
          <button onClick={handleStop}>停止</button>
        </div>
      </div>
      <div className="round-info">
        <p>当前轮次: {round + 1}</p>
        <p>状态: {isWork ? '工作' : '休息'}</p>
        <p>当前任务: {tasks[currentTaskIndex] || '无任务'}</p>
      </div>
      <div className="task-manager">
        <h4>任务管理</h4>
        <div className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="输入任务"
          />
          <button onClick={handleAddTask}>添加任务</button>
        </div>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>
      <div className="history">
        <h4>历史记录</h4>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>{entry.type} - {formatTime(entry.duration)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PomodoroClock;
