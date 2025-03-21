import React, { useState, useEffect } from 'react';
import './CalendarViews.css';

const DayView = ({ date, tasks, markedDates }) => {
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dateStr = date?.toISOString().split('T')[0];
  const dayTasks = tasks[dateStr] || [];

  useEffect(() => {
    const checkOccupiedSlots = async () => {
      const occupied = [];
      for (let hour = 0; hour < 24; hour++) {
        const start_time = `${hour}:00`;
        const end_time = `${hour + 1}:00`;
        const response = await fetch('http://localhost:5000/api/check-time-slot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: dateStr, start_time, end_time }),
        });
        const data = await response.json();
        if (data.occupied) {
          occupied.push(hour);
        }
      }
      setOccupiedSlots(occupied);
    };

    checkOccupiedSlots();
  }, [dateStr]);

  return (
    <div className="day-view">
      <div className="timeline">
        {hours.map(hour => (
          <div key={hour} className="hour-slot">
            <div className="hour-label">{`${hour}:00`}</div>
            <div className="hour-content">
              {occupiedSlots.includes(hour) && (
                <div className="occupied-box"></div>
              )}
              {dayTasks.filter(task => new Date(task.start_time).getHours() === hour)
                .map(task => (
                  <div key={task.id} className="task-item" style={{ backgroundColor: '#007bff' }}>
                    {task.title} ({new Date(task.start_time).toLocaleTimeString()} - {new Date(task.end_time).toLocaleTimeString()})
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeekView = ({ date, tasks, markedDates, onDateSelect }) => {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  // 重新排序，将周日移到最后
  const reorderedWeekDays = [...weekDays.slice(1), weekDays[0]];
  const weekDayNames = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div className="week-view">
      <div className="week-header">
        <div className="week-day-header empty-header"></div>
        {reorderedWeekDays.map((day, index) => (
          <div key={day.toISOString()} className="week-day-header">
            <div>{weekDayNames[index]}</div>
            <div className="day-number">{day.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="week-body">
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={hour} className="week-row">
            <div className="hour-label">{hour > 0 ? `${hour}:00` : ''}</div>
            {reorderedWeekDays.map(day => {
              const dateStr = day.toISOString().split('T')[0];
              const dayTasks = tasks[dateStr] || [];
              const hourTasks = dayTasks.filter(task => {
                const taskHour = new Date(task.start_time).getHours();
                return taskHour === hour;
              });
              
              return (
                <div
                  key={day.toISOString()}
                  className="week-cell"
                  onClick={() => onDateSelect(day)}
                  style={{ backgroundColor: hourTasks.length ? '#007bff' : 'transparent' }}
                >
                  {hourTasks.map(task => (
                    <div key={task.id} className="task-item">
                      {task.title} ({new Date(task.start_time).toLocaleTimeString()} - {new Date(task.end_time).toLocaleTimeString()})
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const MonthView = ({ date, tasks, markedDates, onDateSelect, onAddTask }) => {
  const [popupDate, setPopupDate] = useState(null);
  const [popupTask, setPopupTask] = useState({ title: '', start_time: '', end_time: '', location: '' });
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const days = Array.from(
    { length: lastDay.getDate() },
    (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1)
  );

  const handleDateClick = (day) => {
    setPopupDate(day);
  };

  const closePopup = () => {
    setPopupDate(null);
    setPopupTask({ title: '', start_time: '', end_time: '', location: '' });
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setPopupTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  const handleAddTask = () => {
    if (!popupTask.title || !popupTask.start_time || !popupTask.end_time) {
      alert('事件名称和时间不能为空');
      return;
    }
    onAddTask(popupDate, popupTask);
    closePopup();
  };

  return (
    <div className="month-view">
      <div className="month-grid">
        {Array(firstDay.getDay()).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="day-cell empty" />
        ))}
        {days.map(day => {
          const dateStr = day.toISOString().split('T')[0];
          const dayTasks = tasks[dateStr] || [];
          const isMarked = dateStr in markedDates;
          
          return (
            <div
              key={day.toISOString()}
              className={`day-cell ${isMarked ? 'marked' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              <div className="day-number">{day.getDate()}</div>
              <div className="day-tasks">
                {dayTasks.map(task => (
                  <div key={task.id} className="task-indicator" title={task.title} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {popupDate && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-button" onClick={closePopup}>×</button>
            <h3>{popupDate.toLocaleDateString('zh-CN')}</h3>
            <input type="text" name="title" placeholder="事件名称" value={popupTask.title} onChange={handleTaskChange} />
            <input type="time" name="start_time" placeholder="开始时间" value={popupTask.start_time} onChange={handleTaskChange} />
            <input type="time" name="end_time" placeholder="结束时间" value={popupTask.end_time} onChange={handleTaskChange} />
            <input type="text" name="location" placeholder="事件地点" value={popupTask.location} onChange={handleTaskChange} />
            <button onClick={handleAddTask}>确认添加事件</button>
          </div>
        </div>
      )}
    </div>
  );
};

const YearView = ({ date, tasks, markedDates, onDateSelect }) => {
  const [hoveredTask, setHoveredTask] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(date.getFullYear(), i, 1);
    return monthDate;
  });

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const getMonthDays = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取上个月的最后几天
    const prevMonthDays = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
      const day = new Date(year, month, -i);
      prevMonthDays.unshift(day);
    }
    
    // 获取当前月的所有天
    const currentMonthDays = Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(year, month, i + 1)
    );
    
    // 获取下个月的前几天
    const nextMonthDays = [];
    const remainingDays = 35 - (prevMonthDays.length + currentMonthDays.length);
    if (remainingDays > 0) {
      for (let i = 1; i <= remainingDays; i++) {
        nextMonthDays.push(new Date(year, month + 1, i));
      }
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const getDateColor = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return markedDates[dateString] || null;
  };

  const handleMouseEnter = (task, event) => {
    setHoveredTask(task);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredTask(null);
  };

  return (
    <div className="year-view">
      {months.map(monthDate => (
        <div key={monthDate.toISOString()} className="year-month">
          <h3>{monthDate.toLocaleDateString('zh-CN', { month: 'long' })}</h3>
          <div className="mini-month-header">
            {weekDays.map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mini-month">
            {getMonthDays(monthDate).map(day => {
              const dateStr = day.toISOString().split('T')[0];
              const isMarked = dateStr in markedDates;
              const dayTasks = tasks[dateStr] || [];
              const isOtherMonth = day.getMonth() !== monthDate.getMonth();
              const color = getDateColor(day);

              return (
                <div
                  key={day.toISOString()}
                  className={`mini-day ${isMarked ? 'marked' : ''} ${isOtherMonth ? 'other-month' : ''}`}
                  onClick={() => onDateSelect(day)}
                  style={{ backgroundColor: dayTasks.length ? '#0000FF' : (color ? color : 'transparent'), color: isMarked ? 'white' : (isOtherMonth ? 'gray' : 'black') }}
                  onMouseEnter={(event) => handleMouseEnter(dayTasks[0], event)}
                  onMouseLeave={handleMouseLeave}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {hoveredTask && (
        <div className="task-tooltip" style={{ top: tooltipPosition.y, left: tooltipPosition.x }}>
          <div>任务名称: {hoveredTask.title}</div>
          <div>任务时间: {hoveredTask.start_time} - {hoveredTask.end_time}</div>
          <div>任务地点: {hoveredTask.location}</div>
        </div>
      )}
    </div>
  );
};

const EventsView = ({ tasks, onDeleteTask }) => {
  const allTasks = Object.entries(tasks).flatMap(([date, dateTasks]) =>
    dateTasks.map(task => ({
      ...task,
      date: new Date(date)
    }))
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const handleDeleteTask = async (task) => {
    await onDeleteTask(task.date, task.id);
    const dateStr = task.date.toISOString().split('T')[0];
    if (!tasks[dateStr] || tasks[dateStr].length === 0) {
      await fetch(`http://localhost:5000/api/marked-dates/${dateStr}`, {
        method: 'DELETE',
      });
    }
  };

  return (
    <div className="events-view">
      {allTasks.map(task => (
        <div key={`${task.date}-${task.id}`} className="event-item">
          <div className="event-date">
            {task.date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="event-title">{task.title}</div>
          <button className="delete-button" onClick={() => handleDeleteTask(task)}>删除</button>
        </div>
      ))}
    </div>
  );
};

const CalendarViews = ({ view, date, tasks, markedDates, onDateSelect, onAddTask, onDeleteTask }) => {
  const handleDateSelect = (selectedDate) => {
    switch (view) {
      case 'year':
        onDateSelect(selectedDate, 'month');
        break;
      case 'month':
        onDateSelect(selectedDate, 'week');
        break;
      case 'week':
        onDateSelect(selectedDate, 'day');
        break;
      default:
        onDateSelect(selectedDate);
    }
  };

  switch (view) {
    case 'day':
      return <DayView date={date} tasks={tasks} markedDates={markedDates} />;
    case 'week':
      return <WeekView date={date} tasks={tasks} markedDates={markedDates} onDateSelect={handleDateSelect} />;
    case 'month':
      return <MonthView date={date} tasks={tasks} markedDates={markedDates} onDateSelect={handleDateSelect} onAddTask={onAddTask} />;
    case 'year':
      return <YearView date={date} tasks={tasks} markedDates={markedDates} onDateSelect={handleDateSelect} />;
    case 'events':
      return <EventsView tasks={tasks} onDeleteTask={onDeleteTask} />;
    default:
      return <MonthView date={date} tasks={tasks} markedDates={markedDates} onDateSelect={handleDateSelect} onAddTask={onAddTask} />;
  }
};

export default CalendarViews;