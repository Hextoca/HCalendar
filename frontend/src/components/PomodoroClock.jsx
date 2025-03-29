import React, { useState, useEffect } from 'react';
import './PomodoroClock.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
        <div className="row mt-4">
          <div
            className="col-12 text-secondary"
            align="center"
            style={{ fontFamily: 'SimHei, Arial, sans-serif', fontSize: '18px', color: '#000' }}
          >
            工作时间（分钟）:
            <input
              className="rounded rounded-pill text-secondary"
              style={{
                textAlign: 'center',
                border: '1px solid #DDDDDD',
                fontSize: '18px',
                width: '100px',
                height: '40px',
                color: '#000', // Ensure font color is black
              }}
              value={workTime / 60}
              onChange={(e) => {
                const newWorkTime = e.target.value * 60;
                setWorkTime(newWorkTime);
                if (isWork && !isRunning) {
                  setTimeLeft(newWorkTime);
                }
              }}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            休息时间（分钟）:
            <input
              className="rounded rounded-pill text-secondary"
              style={{
                textAlign: 'center',
                border: '1px solid #DDDDDD',
                fontSize: '18px',
                width: '100px',
                height: '40px',
                color: '#000', // Ensure font color is black
              }}
              value={breakTime / 60}
              onChange={(e) => setBreakTime(e.target.value * 60)}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            长休息时间（分钟）:
            <input
              className="rounded rounded-pill text-secondary"
              style={{
                textAlign: 'center',
                border: '1px solid #DDDDDD',
                fontSize: '18px',
                width: '100px',
                height: '40px',
                color: '#000', // Ensure font color is black
              }}
              value={longBreakTime / 60}
              onChange={(e) => setLongBreakTime(e.target.value * 60)}
            />
          </div>
        </div>
      </div>
      <div className="timer">
        <div className="timer-display">
          <CircularProgressbar
            value={((isWork ? workTime : (round + 1) % 4 === 0 ? longBreakTime : breakTime) - timeLeft) / (isWork ? workTime : (round + 1) % 4 === 0 ? longBreakTime : breakTime) * 100}
            text={formatTime(timeLeft)}
            styles={buildStyles({
              textColor: '#000',
              pathColor: isWork ? '#0000FF' : '#4caf50',
              trailColor: '#d6d6d6',
            })}
          />
        </div>
        <div className="controls">
          <div className="row justify-content-center">
            <div className="col-12 mb-4">
              <span
                className="btn btn-outline-secondary"
                id="start_button"
                onClick={handleStart}
                role="button"
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '50px',
                  border: '2px solid #000',
                  color: '#000',
                  textAlign: 'center',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                onMouseEnter={(e) => (e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                onMouseLeave={(e) => (e.target.style.boxShadow = 'none')}
              >
                开始番茄
              </span>
            </div>
            <div className="col-12 mb-4">
              <span
                className="btn btn-outline-secondary"
                id="pause_button"
                onClick={handlePause}
                role="button"
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '50px',
                  border: '2px solid #000',
                  color: '#000',
                  textAlign: 'center',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                onMouseEnter={(e) => (e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                onMouseLeave={(e) => (e.target.style.boxShadow = 'none')}
              >
                暂停
              </span>
            </div>
            <div className="col-12">
              <span
                className="btn btn-outline-secondary"
                id="stop_button"
                onClick={handleStop}
                role="button"
                style={{
                  display: 'block',
                  width: '100%',
                  borderRadius: '50px',
                  border: '2px solid #000',
                  color: '#000',
                  textAlign: 'center',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
                onMouseEnter={(e) => (e.target.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)')}
                onMouseLeave={(e) => (e.target.style.boxShadow = 'none')}
              >
                停止
              </span>
            </div>
          </div>
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
