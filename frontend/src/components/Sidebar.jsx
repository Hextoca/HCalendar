import React from 'react';
import './Sidebar.css';

const Sidebar = ({ view, onViewChange }) => {
  const views = [
    { id: 'day', label: '日视图' },
    { id: 'week', label: '周视图' },
    { id: 'month', label: '月视图' },
    { id: 'year', label: '年视图' },
    { id: 'events', label: '事件视图' }
  ];

  return (
    <div className="sidebar">
      <div className="view-selector">
        <h3>视图选择</h3>
        {views.map(v => (
          <button
            key={v.id}
            className={`view-button ${view === v.id ? 'active' : ''}`}
            onClick={() => onViewChange(v.id)}
          >
            <span className="view-indicator"></span>
            {v.label}
          </button>
        ))}
      </div>
      <div className="additional-options">
        <h3>其他功能</h3>
        <button className="view-button" onClick={() => onViewChange('todo')}>
          清单列表
        </button>
        <button className="view-button" onClick={() => onViewChange('pomodoro')}>
          番茄钟
        </button>
        <button className="view-button" onClick={() => onViewChange('mindmap')}> {/* Add button for Mind Map */}
          思维导图
        </button>
      </div>
    </div>
  );
};

export default Sidebar;