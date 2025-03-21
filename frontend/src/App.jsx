import React, { useState, useEffect } from 'react';
import CalendarViews from './components/CalendarViews';
import Sidebar from './components/Sidebar';
import TodoList from './components/TodoList';
import PomodoroClock from './components/PomodoroClock';
import './App.css';

function App() {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    fetchMarkedDates();
    fetchTasks();
  }, []);

  const fetchMarkedDates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/marked-dates');
      const data = await response.json();
      setMarkedDates(data);
    } catch (error) {
      console.error('Error fetching marked dates:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleDateSelect = async (date, newView) => {
    setSelectedDate(date);
    if (newView) {
      setCurrentView(newView);
    }
    const dateString = date.toISOString().split('T')[0];
    
    try {
      const response = await fetch('http://localhost:5000/api/marked-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateString,
          color: '#007bff'
        }),
      });
      
      if (response.ok) {
        fetchMarkedDates();
      }
    } catch (error) {
      console.error('Error marking date:', error);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleAddTask = async (date, task) => {
    const dateString = date.toISOString().split('T')[0];

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateString,
          title: task.title,
          start_time: task.start_time,
          end_time: task.end_time,
          location: task.location
        }),
      });

      if (response.ok) {
        fetchTasks();
        fetchMarkedDates();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (date, taskId) => {
    const dateString = date.toISOString().split('T')[0];
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${dateString}/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks();
        fetchMarkedDates();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getViewTitle = (date, view) => {
    const options = { year: 'numeric' };
    
    switch (view) {
      case 'day':
        options.month = 'long';
        options.day = 'numeric';
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} - ${weekEnd.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} ${weekStart.getFullYear()}`;
      case 'month':
        options.month = 'long';
        break;
      case 'year':
        break;
      default:
        options.month = 'long';
    }
    
    return date.toLocaleDateString('zh-CN', options);
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);
    
    switch (currentView) {
      case 'day':
        newDate.setDate(selectedDate.getDate() + (direction === 'prev' ? -1 : 1));
        break;
      case 'week':
        newDate.setDate(selectedDate.getDate() + (direction === 'prev' ? -7 : 7));
        break;
      case 'month':
        newDate.setMonth(selectedDate.getMonth() + (direction === 'prev' ? -1 : 1));
        break;
      case 'year':
        newDate.setFullYear(selectedDate.getFullYear() + (direction === 'prev' ? -1 : 1));
        break;
    }
    
    setSelectedDate(newDate);
  };

  return (
    <div className="App">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <div className="main-content">
        <header className="App-header">
          <div className="title-container">
            <button className="nav-button" onClick={() => handleDateChange('prev')}>&lt;</button>
            <h1>{getViewTitle(selectedDate, currentView)}</h1>
            <button className="nav-button" onClick={() => handleDateChange('next')}>&gt;</button>
          </div>
        </header>
        <main>
          {currentView === 'todo' ? (
            <TodoList />
          ) : currentView === 'pomodoro' ? (
            <PomodoroClock />
          ) : (
            <CalendarViews
              view={currentView}
              date={selectedDate}
              tasks={tasks}
              markedDates={markedDates}
              onDateSelect={handleDateSelect}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;