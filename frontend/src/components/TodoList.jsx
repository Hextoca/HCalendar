import React, { useState } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleToggleTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleCompleteAll = () => {
    const updatedTodos = todos.map((todo) => ({ ...todo, completed: true }));
    setTodos(updatedTodos);
  };

  const handleClearAll = () => {
    setTodos([]);
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'todos.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTodos = JSON.parse(e.target.result);
          setTodos([...todos, ...importedTodos]);
        } catch (error) {
          console.error('Error importing todos:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div id="todo-app" className="todo-app" style={{ color: '#000' }}>
      <div className="container header">
        <div className="todo-input">
          <h1 className="title">
            <img src="assets/img/todo.svg" alt="" className="title-1" />
            <div className="ani-vector">
              <span></span>
              <span></span>
            </div>
            <div className="pendulums">
              <div className="pendulum">
                <div className="bar"></div>
                <div className="motion">
                  <div className="string"></div>
                  <div className="weight"></div>
                </div>
              </div>
              <div className="pendulum shadow">
                <div className="bar"></div>
                <div className="motion">
                  <div className="string"></div>
                  <div className="weight"></div>
                </div>
              </div>
            </div>
          </h1>
          <div className="add-content-wrapper">
            <input
              type="text"
              rows="3"
              placeholder="新增待办事项..."
              className="add-content"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <button type="button" className="btn submit-btn" onClick={handleAddTodo}>
              提交
            </button>
          </div>
        </div>
      </div>
      <div className="container main">
        <div className="todo-list-box">
          <div className="bar-message">
            <div>
              <div className="bar-message-text">
                今日事今日毕，勿将今事待明日!.☕
              </div>
            </div>
          </div>
          {todos.length === 0 ? (
            <ul className="empty-tips">
              <li>添加你的第一个待办事项！📝</li>
              <li>食用方法💡：</li>
              <li>✔️ 所有提交操作支持Enter回车键提交</li>
              <li>✔️ 拖拽Todo上下移动可排序(仅支持PC)</li>
              <li>✔️ 双击上面的标语和 Todo 可进行编辑</li>
              <li>✔️ 右侧的小窗口是快捷操作哦</li>
              <li>🔒 所有的Todo数据存储在浏览器本地</li>
              <li>📝 支持下载和导入，导入追加到当前序列</li>
            </ul>
          ) : (
            <ul className="todo-list">
              {todos.map((todo, index) => (
                <li key={index} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <span onDoubleClick={() => handleToggleTodo(index)}>{todo.text}</span>
                  <button className="btn-small action-delete" onClick={() => handleDeleteTodo(index)}>
                    删除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="footer side-bar">
          <div className="side-shortcut">
            <div className="shortcut-switch">
              <span className="shortcut-title">开✨</span>
              <span className="shortcut-name">快捷操作</span>
            </div>
          </div>
          <div className="todo-footer-box">
            <ul className="todo-func-list filter">
              <li>
                <input type="button" value="全部" className="btn-small action-showAll selected" />
              </li>
            </ul>
            <ul className="todo-func-list batch">
              <li>
                <input
                  type="button"
                  value="全部标为已完成"
                  className="btn-small completed-all"
                  onClick={handleCompleteAll}
                />
              </li>
              <li>
                <input
                  type="button"
                  value="清除全部"
                  className="btn-small clear-all"
                  onClick={handleClearAll}
                />
              </li>
            </ul>
            <ul className="todo-func-list datasave">
              <li>
                <input
                  type="button"
                  value="导出数据"
                  id="download"
                  className="btn-small action-download"
                  onClick={handleDownload}
                />
              </li>
              <li>
                <input
                  type="file"
                  id="import"
                  className="btn-small action-import"
                  onChange={handleImport}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="nav">
        <div className="about">
          <div className="info">
            <div className="info-ico" style={{ fontWeight: 'normal' }}>
              关于我
            </div>
          </div>
        </div>
        <div className="language switch-language">
          <a href="/" className="en">
            En
          </a>
          <span>/</span>
          <a href="javascript:;" target="_self" className="zh active">
            中
          </a>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
