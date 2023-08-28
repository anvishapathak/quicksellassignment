import React, { useState, useEffect } from 'react';
import './App.css';

function Stopwatch() {
  const initialMinutes = parseInt(localStorage.getItem('minutes')) || 5;
  const initialSeconds = parseInt(localStorage.getItem('seconds')) || 0;
  const initialAngle = parseFloat(localStorage.getItem('angle')) || 0;
  const initialColor = localStorage.getItem('color') || 'green';

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [color, setColor] = useState(initialColor);
  const [angle, setAngle] = useState(initialAngle);

  const totalTime = initialMinutes * 60 + initialSeconds;
  const revolutionTime = 5 * 60;
  const angleIncrement = (360 / revolutionTime) * (running ? 1 : 0);

  useEffect(() => {
    if (running) {
      localStorage.setItem('minutes', minutes);
      localStorage.setItem('seconds', seconds);
      localStorage.setItem('angle', angle);
      localStorage.setItem('color', color);
    }
  }, [minutes, seconds, running, angle, color]);

  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else {
          if (minutes > 0) {
            setMinutes(minutes - 1);
            setSeconds(59);
          } else {
            clearInterval(interval);
            setRunning(false);
          }
        }

        setAngle(prevAngle => (prevAngle + angleIncrement) % 360);

        if (minutes === 2 && seconds === 30) {
          setColor('orange');
        } else if (minutes === 0 && seconds <= 30) {
          setColor(color === 'red' ? 'transparent' : 'red');
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [running, minutes, seconds, color, angleIncrement]);

  useEffect(() => {
    if (running) {
      localStorage.setItem('minutes', minutes);
      localStorage.setItem('seconds', seconds);
    }
  }, [minutes, seconds, running]);

  const startTimer = () => {
    setRunning(true);
  };

  const stopTimer = () => {
    setRunning(false);
  };

  const resetTimer = () => {
    setMinutes(5);
    setSeconds(0);
    setRunning(false);
    setColor('green');
    setAngle(0);
    localStorage.removeItem('minutes');
    localStorage.removeItem('seconds');
  };

  return (
    <div className="main-div">
      <div className="circular-track">
        <div
          className="circular-bead"
          style={{ backgroundColor: color, transform: `translate(-50%, -50%) rotate(${angle}deg) translate(233px, 0)` }}
        ></div>
        <div className="circular-track" style={{ height: '460px', width: '460px' }}>
          <div className="timer-card">
            <div className="timer-display" style={{ color: color }}>
              <span>{minutes.toString().padStart(2, '0')}m</span>&nbsp;&nbsp;&nbsp;
              <span>{seconds.toString().padStart(2, '0')}s</span>
            </div>
            <div className="line"></div>
            <div className="timer-buttons">
              <button className="start-button" onClick={startTimer}>
                START
              </button>
              <button className="stop-button" onClick={stopTimer}>
                STOP
              </button>
              <button className="reset-button" onClick={resetTimer}>
                RESET
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stopwatch;
